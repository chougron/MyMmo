"use strict";
process.title = 'Server';

//The port we listen for WebSockets
var WebSocketServerPort = 8080;

//Launch the listening
var http = require('http');
var server = http.createServer(function(request, response){});
server.listen(WebSocketServerPort, function(){
    console.log((new Date()) + " Server started listening on port " + WebSocketServerPort);
});

var io = require('socket.io').listen(server);

//Connect to the MongoDB DB
var mongo = require('mongodb'),
        Server = mongo.Server,
        Db = mongo.Db;
var dbServer = new Server('localhost', 27017, {auto_reconnect: true});
var db = new Db('test', dbServer);

db.open(function(err, db) {
  if(!err) {
      db.authenticate('root', 'root', function(){ //Change here with your credentials
          db.collection('pnj', function(err, collection){
            collection.remove();
            collection.insert([
                {
                    animation:null,
                    map:{author:"u0000001", title:"ForestHouse"},
                    coords:{x:6,y:8},
                    block:false,
                    onWalk:"var NEWfONCTION = function(parameters){PLAYER.changeMap('u0000001','Maison',{x:11,y:12});}",
                    onAct:"var NEWfONCTION = function(parameters){alert(\"What a great door !\");}",
                    onInit:"var NEWfONCTION = function(parameters){}",
                    onClose:"var NEWfONCTION = function(parameters){}"
                },
                {
                    animation:null,
                    map:{author:"u0000001", title:"Maison"},
                    coords:{x:11,y:12},
                    block:false,
                    onWalk:"var NEWfONCTION = function(parameters){PLAYER.changeMap('u0000001','ForestHouse',{x:6,y:8});}",
                    onAct:"var NEWfONCTION = function(parameters){alert(\"What a great door !\");}",
                    onInit:"var NEWfONCTION = function(parameters){}",
                    onClose:"var NEWfONCTION = function(parameters){}"
                },
                {
                    animation : {sprite:1,direction:2,action:2},
                    map:{author:"u0000001", title:"ForestHouse"},
                    coords:{x:7,y:9},
                    block:true,
                    onWalk:"var NEWfONCTION = function(parameters){}",
                    onAct:"var NEWfONCTION = function(parameters){alert(\"Thierry's House.\");}",
                    onInit:"var NEWfONCTION = function(parameters){}",
                    onClose:"var NEWfONCTION = function(parameters){}"
                },
                {
                    animation : {sprite:0,direction:2,action:2},
                    map:{author:"u0000001", title:"Maison"},
                    coords:{x:9,y:7},
                    block:true,
                    onWalk:"var NEWfONCTION = function(parameters){}",
                    onAct:"var NEWfONCTION = function(parameters){alert(\"Hello, I'm Thierry.\");}",
                    onInit:"var NEWfONCTION = function(parameters){}",
                    onClose:"var NEWfONCTION = function(parameters){}"
                }
            ]);
          });
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
  
  console.log((new Date()) + " Connection accepted");

    // user sent some message
    socket.on('message', function(received) {
        var message = JSON.parse(received);
        switch(message.act){
            case 'join':
                clients[index].player = message.player;
                doJoin(message.player, index);
                break;
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
        }
    });

    // user disconnected
    socket.on('disconnect', function(connection) {
        console.log((new Date()) + " Peer disconnected.");
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
 * When a new player join a map, send messge to the others, and send him players and pnjs
 * @param {Player} player The player joining
 * @param {int} indexUser The user index
 * @returns {void}
 */
var doJoin = function(player, indexUser){
    //Send the new players to others, so they add him
    player.user = false;
    var message = {act:'join',player:player};
    var json = JSON.stringify(message);
    sendMessageMap(json,indexUser,player.map);
    //On récupère la liste de tous les joueurs de la zone, que l'on envoie au joueur courant
    var players = whoIsMap(player.map, indexUser);
    message = {act:'getPlayerList',players:players};
    json = JSON.stringify(message);
    sendMessageToUser(json,indexUser);
    sendPnj(player.map, indexUser);
};

/**
 * Send all the PNJs in the Map
 * @param {Map} map The Map where to find the PNJs
 * @param {int} indexUser The user to send the results
 * @returns {undefined}
 */
var sendPnj = function(map, indexUser){
    console.log(map);
    db.collection('pnj', function(err, collection){
        collection.find({map:map}).toArray(function(err, items) {
            var message = {act:'getPnjList',pnjs:items};
            var json = JSON.stringify(message);
            sendMessageToUser(json,indexUser);
        });
    });
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
    //Send the moving player to others so he moves to them too
    player.user = false;
    var message = {act:'changeMap',player:player,oldMap:oldMap,newMap:newMap};
    var json = JSON.stringify(message);
    sendMessageMap(json,indexUser,oldMap);
    sendMessageMap(json,indexUser,newMap);
    //We send the player list in the new map to the changing player
    var players = whoIsMap(player.map, indexUser);
    message = {act:'getPlayerList',players:players};
    json = JSON.stringify(message);
    sendMessageToUser(json,indexUser);
    //We send the pnj list in the new map to the changing player
    sendPnj(player.map, indexUser);
};

var doSaveMap = function(name, tiles, tileSets, obstacles){
    var fs = require('fs');
    var stream = fs.createWriteStream("../www/js/Maps/u0000001/"+name+".js");
    
    var width = 20;
    var height = 15;
    
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