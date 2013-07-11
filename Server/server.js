"use strict";
process.title = 'Server';

// Port where we'll run the websocket server
var webSocketsServerPort = 8080;

// websocket and http servers
var webSocketServer = require('websocket').server;
var http = require('http');

/**
 * Connexion et authentification à la B.D.D.
 */
var mongo = require('mongodb'),
  Server = mongo.Server,
  Db = mongo.Db;

var server = new Server('mongodb1.alwaysdata.com', 27017, {auto_reconnect: true}); //Connect to your MongoDB DB
var db = new Db('mymmo_1', server);

db.open(function(err, db) {
  if(!err) {
      db.authenticate('USERNAME', 'PASSWORD', function(){ //Change here with your credentials
          db.collection('pnj', function(err, collection){
            collection.remove();
            collection.insert([
                {
                    animation:null,
                    map:{author:"u0000001", name:"ForestHouse"},
                    zone:{x:0,y:0},
                    coords:{x:6,y:8},
                    block:false,
                    onWalk:"var NEWfONCTION = function(parameters){PLAYER.changeMap('u0000001','Maison',{x:0,y:0},{x:11,y:12});}",
                    onAct:"var NEWfONCTION = function(parameters){alert(\"Quelle belle porte !\");}",
                    onInit:"var NEWfONCTION = function(parameters){}",
                    onClose:"var NEWfONCTION = function(parameters){}"
                },
                {
                    animation:null,
                    map:{author:"u0000001", name:"Maison"},
                    zone:{x:0,y:0},
                    coords:{x:11,y:12},
                    block:false,
                    onWalk:"var NEWfONCTION = function(parameters){PLAYER.changeMap('u0000001','ForestHouse',{x:0,y:0},{x:6,y:8});}",
                    onAct:"var NEWfONCTION = function(parameters){alert(\"Quelle belle porte !\");}",
                    onInit:"var NEWfONCTION = function(parameters){}",
                    onClose:"var NEWfONCTION = function(parameters){}"
                },
                {
                    animation : {sprite:1,direction:2,action:2},
                    map:{author:"u0000001", name:"ForestHouse"},
                    zone:{x:0,y:0},
                    coords:{x:7,y:9},
                    block:true,
                    onWalk:"var NEWfONCTION = function(parameters){}",
                    onAct:"var NEWfONCTION = function(parameters){alert(\"Maison de Thierry.\");}",
                    onInit:"var NEWfONCTION = function(parameters){}",
                    onClose:"var NEWfONCTION = function(parameters){}"
                },
                {
                    animation : {sprite:0,direction:2,action:2},
                    map:{author:"u0000001", name:"Maison"},
                    zone:{x:0,y:0},
                    coords:{x:9,y:7},
                    block:true,
                    onWalk:"var NEWfONCTION = function(parameters){}",
                    onAct:"var NEWfONCTION = function(parameters){alert(\"Bonjour, je m'appelle Thierry.\");}",
                    onInit:"var NEWfONCTION = function(parameters){}",
                    onClose:"var NEWfONCTION = function(parameters){}"
                }
            ]);
          });
      });
    console.log("Authentifie et connecte a la B.D.D.");
  }
  else {
    console.log(err);
  }
});

/**
* HTTP server
*/
var server = http.createServer(function(request, response) {
    // Not important for us. We're writing WebSocket server, not HTTP server
});
server.listen(webSocketsServerPort, function() {
    console.log((new Date()) + " Server is listening on port " + webSocketsServerPort);
});

/**
* WebSocket server
*/
var wsServer = new webSocketServer({
    // WebSocket server is tied to a HTTP server. To be honest I don't understand why.
    httpServer: server
});

//La liste des joueurs connectés en socket
var clients = [ ];

// This callback function is called every time someone
// tries to connect to the WebSocket server
wsServer.on('request', function(request) {
    console.log((new Date()) + ' Connection from origin ' + request.origin + '.');

    // accept connection - you should check 'request.origin' to make sure that
    // client is connecting from your website
    // (http://en.wikipedia.org/wiki/Same_origin_policy)
    var connection = request.accept(null, request.origin);
    // we need to know client index to remove them on 'close' event
    var client = {connection:connection,player:null};
    var index = clients.push(client) - 1;

    console.log((new Date()) + ' Connection accepted.');

    // user sent some message
    connection.on('message', function(received) {
        var message = JSON.parse(received.utf8Data);
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
            case 'changeZone':
                clients[index].player = message.player;
                doChangeZone(message.player, message.oldZone, message.newZone, index);
                break;
            case 'saveMap':
                doSaveMap(message.name, message.zones, message.tileSets, message.obstacles);
                break;
            case 'changeMap':
                clients[index].player = message.player;
                doChangeMap(message.player, message.oldMap, message.newMap, index);
                break;
        }
    });

    // user disconnected
    connection.on('close', function(connection) {
        console.log((new Date()) + " Peer "
            + connection.remoteAddress + " disconnected.");
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
 * On envoie un message aux joueurs pour les prévenir de la connexion
 * Et on en envoie un autre au joueur pour lui donner la liste de ceux présents
 * @param player le joueur connecté
 * @param indexUser l'index de la connexion du joueur
 */
var doJoin = function(player, indexUser){
    //ON envoie le nouveau joueur aux utilisateurs, pour qu'ils l'affichent
    player.user = false;
    var message = {act:'join',player:player};
    var json = JSON.stringify(message);
    sendMessageZone(json,indexUser,player.map,player.zone);
    //On récupère la liste de tous les joueurs de la zone, que l'on envoie au joueur courant
    var players = whoIsZone(player.map, player.zone, indexUser);
    message = {act:'getPlayerList',players:players};
    json = JSON.stringify(message);
    sendMessageToUser(json,indexUser);
    sendPnjInZone(player.map, player.zone, indexUser);
}

/**
 * On envoie un message aux joueurs pour les prévenir que le joueur bouge
 * @param player le joueur qui bouge
 * @param indexUser l'index de la connexion du joueur
 */
var doMove = function(player, indexUser){
    //On envoie le joueur qui bouge aux joueurs, pour qu'ils le bouge aussi
    player.user = false;
    player.isMoving = false;
    var message = {act:'move',player:player};
    var json = JSON.stringify(message);
    sendMessageZone(json,indexUser,player.map,player.zone);
}

/**
 * On envoie un message aux joueur de l'ancienne et de la nouvelle zone
 * pour les prévenir que le joueur à changé de zone
 * On envoie aussi un message au joueur qui change pour lui donner la liste
 * des joueurs de la nouvelle zone
 * @param player le joueur qui change de zone
 * @param oldZone l'ancienne zone
 * @param newZone la nouvelle zone
 * @param indexUser l'index de la connexion du joueur
 */
var doChangeZone = function(player, oldZone, newZone, indexUser){
    //On envoie le joueur qui change de zone aux joueurs, pour qu'ils le change aussi
    player.user = false;
    var message = {act:'changeZone',player:player,oldZone:oldZone,newZone:newZone};
    var json = JSON.stringify(message);
    sendMessageZone(json,indexUser,player.map,oldZone);
    sendMessageZone(json,indexUser,player.map,newZone);
    //On récupère la liste de tous les joueurs de la zone, que l'on envoie au joueur courant
    var players = whoIsZone(player.map, player.zone, indexUser);
    message = {act:'getPlayerList',players:players};
    json = JSON.stringify(message);
    sendMessageToUser(json,indexUser);
    sendPnjInZone(player.map, player.zone, indexUser);
}

/**
 * On envoie un message aux joueurs qui sont dans la même map que 
 * map, et on ne l'envoie pas à l'utilisateur indexUser
 * @param message le message à envoyer
 * @param indexUser l'index du joueur à qui il ne faut pas envoyer (-1 pour annuler)
 * @param map la map à qui envoyer le message
 */
var sendMessageMap = function(message, indexUser, map){
    for (var i=0; i < clients.length; i++) {
        var player;
        if(clients[i]!="NULL" && clients[i].player != null)player = clients[i].player;
        else player = false;
        if(player &&
            i != indexUser && //Si l'utilisateur n'est pas celui qui a émi le message (pour lui envoyer un message, -1)
            player.map.author == map.author && //S'il se situe sur la bonne carte
            player.map.name == map.name){
            clients[i].connection.sendUTF(message);
            console.log("Message envoyé à "+clients[indexUser].player.name);
            //console.log("Message envoyé à "+clients[indexUser].connection.remoteAddress);
        }
    }
}

/**
 * On envoie un message aux joueurs qui sont dans la même map et zone que 
 * map et zone, et on ne l'envoie pas à l'utilisateur indexUser
 * @param message le message à envoyer
 * @param indexUser l'index du joueur à qui il ne faut pas envoyer (-1 pour annuler)
 * @param map la map à qui envoyer le message
 * @param zone la zone à qui envoyer le message
 */
var sendMessageZone = function(message, indexUser, map, zone){
    for (var i=0; i < clients.length; i++) {
        var player;
        if(clients[i]!="NULL" && clients[i].player != null)player = clients[i].player;
        else player = false;
        if(player &&
            i != indexUser && //Si l'utilisateur n'est pas celui qui a émi le message (pour lui envoyer un message, -1)
            player.map.author == map.author && //S'il se situe sur la bonne carte
            player.map.name == map.name && 
            player.zone.x == zone.x && //Et s'il est dans la bonne zone
            player.zone.y == zone.y){
            clients[i].connection.sendUTF(message);
            console.log("Message envoyé à "+clients[indexUser].player.name);
            //console.log("Message envoyé à "+clients[indexUser].connection.remoteAddress);
        }
    }
}

/**
 * On envoie un message à un utilisateur en particulier
 * @param message le message à envoyer
 * @param indexUser l'index de l'utilisateur à qui envoyer
 */
var sendMessageToUser = function(message, indexUser){
    clients[indexUser].connection.sendUTF(message);
    console.log("Message envoyé à "+clients[indexUser].player.name);
    //console.log("Message envoyé à "+clients[indexUser].connection.remoteAddress);
}

/**
 * Retourne tous les joueurs différents de indexUser présent dans la zone d'une map
 * @param map une carte
 * @param zone une zone de la carte
 * @param indexUser l'index de l'utilisateur à ne pas chercher
 * @return un tableau des joueurs présents dans la zone
 */
var whoIsZone = function(map, zone, indexUser){
    var array = new Array();
    for(var i=0; i<clients.length; i++){
        var player;
        if(clients[i]!="NULL" && clients[i].player != null)player = clients[i].player;
        else player = false;
        if(player &&
            i != indexUser && //Si l'utilisateur n'est pas celui qui a émi le message
            player.map.author == map.author && //S'il se situe sur la bonne carte
            player.map.name == map.name && 
            player.zone.x == zone.x && //Et s'il est dans la bonne zone
            player.zone.y == zone.y){
                array.push(player);
            }
    }
    return array;
}

var sendPnjInZone = function(map, zone, indexUser){
    var pnjs = new Array();
    db.collection('pnj', function(err, collection){
        collection.find({map:map,zone:zone}).toArray(function(err, items) {
            var message = {act:'getPnjList',pnjs:items};
            var json = JSON.stringify(message);
            sendMessageToUser(json,indexUser);
        });
    });
}

var doSaveMap = function(name, zones, tileSets, obstacles){
    var fs = require('fs');
    var stream = fs.createWriteStream("../www/Shared/Maps/u0000001/"+name+".js");
    var width = zones.length;
    var height = 0;
    for(var i=0; i<width; i++)if(zones[i].length > height)height = zones[i].length;
    stream.once('open', function(fd) {
        stream.write("var newMap = function(){\n");
        stream.write("this.width = "+width+";\n");
        stream.write("this.height = "+height+";\n");  
        stream.write("this.tileSets = "+JSON.stringify(tileSets)+";\n");  
        stream.write("this.zones = "+JSON.stringify(zones)+";\n");  
        stream.write("this.obstacles = "+JSON.stringify(obstacles)+";\n");  
        stream.write("}");  
    });
    console.log("Carte sauvegardée : "+name);
}

var doChangeMap = function(player, oldMap, newMap, indexUser){
    //On envoie le joueur qui change de zone aux joueurs, pour qu'ils le change aussi
    player.user = false;
    var message = {act:'changeMap',player:player,oldMap:oldMap,newMap:newMap};
    var json = JSON.stringify(message);
    sendMessageMap(json,indexUser,oldMap);
    sendMessageMap(json,indexUser,newMap);
    //On récupère la liste de tous les joueurs de la zone, que l'on envoie au joueur courant
    var players = whoIsZone(player.map, player.zone, indexUser);
    message = {act:'getPlayerList',players:players};
    json = JSON.stringify(message);
    sendMessageToUser(json,indexUser);
    //On récupère la liste de tous les pnjs de la zone, que l'on envoie au joueur courant
    sendPnjInZone(player.map, player.zone, indexUser);
}