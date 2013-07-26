"use strict";
process.title = 'Server';

//The port we listen for WebSockets
var WebSocketServerPort = 8080;

//The www folder
var WWWFolder = '../www';


//Launch the listening
var http = require('http');
var server = http.createServer(function(request, response){});
server.listen(WebSocketServerPort, function(){
    console.log((new Date()) + " Server started listening on port " + WebSocketServerPort);
});

var io = require('socket.io').listen(server);
io.set('log level', 1); // reduce logging

//Connect to the MongoDB DB
var mongo = require('mongodb'),
        Server = mongo.Server,
        Db = mongo.Db;
var ObjectID = require('mongodb').ObjectID;

var dbServer = new Server('localhost', 27017, {auto_reconnect: true});
var db = new Db('test', dbServer);

var dbInit = require('./dbInit');

db.open(function(err, db) {
  if(!err) {
      db.authenticate('root', 'root', function(){ //Change here with your credentials
          //Initialize the DB with objects for testing
          dbInit.imageFile(db);
          dbInit.pnj(db);
          dbInit.map(db);
          dbInit.item(db);
//          dbInit.quest(db); //Called by map, cause map takes too long
      });
    console.log((new Date()) + " Db connected correctly");
  }
  else {
    console.log(err);
  }
});

//The connected users list
var clients = [];

io.sockets.on('connection', function(socket){
  console.log((new Date()) + " Connection received");
  
  var client = {connection:socket,player:null};
  var index = clients.push(client) - 1;
  
  console.log((new Date()) + " Connection accepted. Index : " + index);

    // user sent some message
    socket.on('message', function(received) {
        var message = JSON.parse(received);
        console.log('Index Message :' + index);
        switch(message.act){
            case 'move':
                var direction = message.player.animation.direction;
                doMove(message.player, index);
                var _player = message.player;
                switch(direction){
                    case 1:
                        _player.coords.y--;
                        break;
                    case 2:
                        _player.coords.y++;
                        break;
                    case 3:
                        _player.coords.x--;
                        break;
                    case 0:
                        _player.coords.x++;
                        break;
                }
                clients[index].player = _player; //On enregistre le joueur après son déplacement pour notre serveur
                break;
            case 'saveMap':
                doSaveMap(message.name, message.tiles, message.tileSets, message.obstacles);
                break;
            case 'changeMap':
                clients[index].player = message.player;
                doChangeMap(message.player, message.oldMap, message.newMap, index);
                break;
            case 'chat':
                doChat(message.content,message.player,index);
                break;
            case 'getFiles':
                doGetFiles(index);
                break;
            case 'loadMap':
                doLoadMap(message.map,index);
                break;
            case 'checkNewFiles':
                doCheckNewFiles(index);
                break;
            case 'saveImageFile':
                doSaveImageFile(message.data);
                break;
            case 'removeImageFile':
                doRemoveImageFile(message.id);
                break;
            case 'getAllItems':
                doGetAllItems(index);
                break;
            case 'saveItem':
                doSaveItem(message.item,index);
                break;
        }
    });

    // user disconnected
    socket.on('disconnect', function(connection) { //TODO: send the disconnection to other users on map
        console.log((new Date()) + " Peer disconnected.");
        
        //If the client is a player, send a disconnection message to others
        if(clients[index].player){
            var message = {act:'disconnect',player:clients[index].player};
            var json = JSON.stringify(message);
            sendMessageMap(json,index,clients[index].player.map);
        }
        
        // remove user from the list of connected clients
        clients.splice(index, 1, "NULL");
        var nb = 0;
        var array = [];
        for (var i=0; i < clients.length; i++) {
            nb++;
            array.push(i);
        }
    });
});

/**
 * Send a message to a particular user
 * @param {JSON} message The message to send
 * @param {int} indexUser The user index
 * @returns {void}
 */
var sendMessageToUser = function(message, indexUser){
    clients[indexUser].connection.send(message);
    
    if(clients[indexUser].player)
        console.log("Message sent to "+clients[indexUser].player.name);
};

/**
 * Send a message to all the players in a Map except the sender (put indexUser to -1 else)
 * @param {JSON} message
 * @param {int} indexUser the User index
 * @param {Map} map The Map on which to send
 * @returns {void}
 */
var sendMessageMap = function(message, indexUser, map){
    for (var i=0; i < clients.length; i++) {
        var player;
        if(clients[i]!="NULL" && clients[i].player != null)player = clients[i].player;
        else player = false;
        if(player &&
            i != indexUser && //If the user didn't emit message (to send to him, indexUser : -1)
            player.map.author == map.author && //If it's the good Map
            player.map.title == map.title){
            clients[i].connection.send(message);
            console.log("Message sent to "+clients[indexUser].player.name);
        }
    }
};

/**
 * Return all the players present on the map, except indexUser
 * @param {Map} map The Map where to search
 * @param {index} indexUser The user not to retrieve
 * @returns {Player Array} The array of all the presents players
 */
var whoIsMap = function(map, indexUser){
    var array = new Array();
    for(var i=0; i<clients.length; i++){
        var player;
        if(clients[i]!="NULL" && clients[i].player != null)player = clients[i].player;
        else player = false;
        if(player &&
            i != indexUser && //Si l'utilisateur n'est pas celui qui a émi le message
            player.map.author == map.author && //S'il se situe sur la bonne carte
            player.map.title == map.title){
                array.push(player);
            }
    }
    return array;
};

/**
 * Send a message to players to tell them a player move
 * @param {Player} player The moving player
 * @param {int} indexUser The user index
 * @returns {void}
 */
var doMove = function(player, indexUser){
    //Send the moving player to others so he moves to them too
    player.user = false;
    player.isMoving = false;
    var message = {act:'move',player:player};
    var json = JSON.stringify(message);
    sendMessageMap(json,indexUser,player.map);
};

/**
 * Send a message to players to tell them a player change Map
 * Send the player list and pnj list to the changing player
 * @param {Player} player The changing map player
 * @param {Map} oldMap The old Map
 * @param {Map} newMap The new Map
 * @param {int} indexUser The user index
 * @returns {void}
 */
var doChangeMap = function(player, oldMap, newMap, indexUser){
    db.collection('map',function(err, collection){
        collection.find({title:newMap.title,author:newMap.author}).nextObject(function(err,map){
            db.collection('pnj',function(err,collection){
                collection.find({map:{author: newMap.author, title: newMap.title}}).toArray(function(err,pnjs){
                    db.collection('quest',function(err,collection){
                        collection.find({maps: map._id}).toArray(function(err,quests){
                            var players = whoIsMap(newMap,indexUser);
                            var message = {
                                act:'changeMap',
                                map:map,
                                pnjs:pnjs,
                                quests:quests,
                                players:players
                            };
                            var json = JSON.stringify(message);
                            sendMessageToUser(json,indexUser);
                            player.map = newMap;
                            clients[indexUser].player = player;
                            message = {
                                act:'otherChangeMap',
                                player:player,
                                oldMap:oldMap,
                                newMap:newMap
                            };
                            json = JSON.stringify(message);
                            sendMessageMap(json,indexUser,oldMap);
                            sendMessageMap(json,indexUser,newMap);
                        });
                    });
                });
            });
        });
    });
};

/**
 * Save an edited map to the DB and to a js file
 * @param {String} name The name of the Map
 * @param {Array} tiles The map content layers
 * @param {Array} tileSets The different tilesets used
 * @param {Array} obstacles The obstacle layer
 * @returns {void}
 */
var doSaveMap = function(name, tiles, tileSets, obstacles){
    var fs = require('fs');
    var stream = fs.createWriteStream(WWWFolder+"/js/Maps/u0000001/"+name+".js");
    
    var width = 20;
    var height = 15;
    //save in DB
    var Map = {
        title : name,
        author : 'u0000001',
        width : width,
        height : height,
        tileSets : tileSets,
        tiles : tiles,
        obstacles : obstacles
    };
    db.collection('map', function(err, collection){
        collection.insert([Map]);
    });
    
    //Save in file
    stream.once('open', function(fd) {
        stream.write("var newMap = function(){\n");
        stream.write("this.width = "+width+";\n");
        stream.write("this.height = "+height+";\n");  
        stream.write("this.tileSets = "+JSON.stringify(tileSets)+";\n");  
        stream.write("this.tiles = "+JSON.stringify(tiles)+";\n");  
        stream.write("this.obstacles = "+JSON.stringify(obstacles)+";\n");  
        stream.write("};");  
    });
    console.log("Saved Map : "+name);
};

/**
 * Send a chat message to all the people on the map
 * @param {String} content The message
 * @param {Player} player The player talking
 * @param {int} indexUser The user talking
 * @returns {void}
 */
var doChat = function(content,player,indexUser){
    player.user = false;
    var message = {act:'chat',content:content,player:player};
    var json = JSON.stringify(message);
    sendMessageMap(json,indexUser,player.map);
};

/**
 * Send the image files to load.
 * @param {int} indexUser The user to send to
 * @returns {void}
 */
var doGetFiles = function(indexUser){
    db.collection('imageFile', function(err, collection){
        collection.find().toArray(function(err, items) {
            var files = {
                sprites: new Array(),
                tilesets: new Array(),
                itemsets: new Array()
            };
            
            var file = items.shift();
            while(file){
                files[file.type+"s"].push(file);
                file = items.shift();
            }
            db.collection('quest', function(err,collection){
                collection.find({maps:'all'}).toArray(function(err,quests){
                    var message = {act:'getFiles',files:files, quests:quests};
                    var json = JSON.stringify(message);
                    sendMessageToUser(json,indexUser);                    
                });
            });
        });
    });
};

/**
 * Get the map we want to load and send it to the right user.
 * @param {{author,name}} map The Map we want to retrieve
 * @param {int} indexUser The user to send the map to
 * @returns {void}
 */
var doLoadMap = function(map,indexUser){
    db.collection('map',function(err, collection){
        collection.find({title:map.title,author:map.author}).nextObject(function(err,item){
            var message = {act:'loadMap',map:item};
            var json = JSON.stringify(message);
            sendMessageToUser(json,indexUser);
        });
    });
};

/**
 * Check if there are new imageFiles in the folders.
 * @param {int} indexUser The index of the user making the demand
 * @returns {void}
 */
var doCheckNewFiles = function(indexUser){
    var fs = require('fs');
    
    var toAdd = new Array();
    var tempFile = {
        type : '',
        name : '',
        width : 0,
        height: 0
    };
    db.collection('imageFile',function(err,collection){
        //Let's start by the itemsets
        var listItemsets = fs.readdirSync(WWWFolder+"/img/itemsets");
        for(var i=0; i<listItemsets.length; i++){
            var key = {type : 'itemset', name : listItemsets[i]};

            var data = tempFile;
            data.type = 'itemset';
            data.name = listItemsets[i];

            collection.update(key,{ $setOnInsert: data},{upsert:true});
        }
        //then the sprites
        var listSprites = fs.readdirSync(WWWFolder+"/img/sprites");
        for(var i=0; i<listSprites.length; i++){
            var key = {type : 'sprite', name : listSprites[i]};

            var data = tempFile;
            data.type = 'sprite';
            data.name = listSprites[i];

            collection.update(key,{ $setOnInsert: data},{upsert:true});
        }
        //Finally the tilesets
        var listTilesets = fs.readdirSync(WWWFolder+"/img/tilesets");
        for(var i=0; i<listTilesets.length; i++){
            var key = {type : 'tileset', name : listTilesets[i]};

            var data = tempFile;
            data.type = 'tileset';
            data.name = listTilesets[i];

            collection.update(key,{ $setOnInsert: data},{upsert:true});
        }
    });
    doGetFiles(indexUser);
};

/**
 * Update an Image File in the DB
 * @param {imageFile} imageFile
 * @returns {void}
 */
var doSaveImageFile = function(imageFile){
    db.collection('imageFile', function(err,collection){
        collection.update(
                {_id : ObjectID(imageFile._id)},
                {$set:{width : imageFile.width, height : imageFile.height}}
        );
    });
};

/**
 * Remove an Image File from the DB
 * @param {int} id The ID of the Image File
 * @returns {void}
 */
var doRemoveImageFile = function(id){
    db.collection('imageFile', function(err,collection){
        collection.remove({_id : ObjectID(id)});
    });
};

/**
 * Retrieve and send all the items to the user
 * @param {int} indexUser
 * @returns {void}
 */
var doGetAllItems = function(indexUser){
    db.collection('item', function(err,collection){
        collection.find().toArray(function(err, items) {
            var message = {act:'getAllItems',items:items};
            var json = JSON.stringify(message);
            sendMessageToUser(json,indexUser);
        });
    });
};

/**
 * Update an item in the database, or create a new item if it doesn't exist
 * @param {Item} item The item to save
 * @param {int} indexUser The user index
 * @returns {void}
 */
var doSaveItem = function(item,indexUser){
    db.collection('item', function(err,collection){
        collection.update(
                {_id : ObjectID(item._id)},
                {$set:{itemSet : item.itemSet, setNumber : item.setNumber, name : item.name}},
                {upsert:true},
                function(){
                    doGetAllItems(indexUser); //Send all the items again
                }
        );
    });
};