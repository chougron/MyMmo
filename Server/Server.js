"use strict";
process.title = 'MyMmo Server';

var WebSocketServerPort = 8080;

var http = require('http');
var server = http.createServer(function(request, response){});
server.listen(WebSocketServerPort, function()
{
    console.log((new Date()) + " Server started listening on port " + WebSocketServerPort);
});

var io = require('socket.io').listen(server);
io.set('log level', 1); // reduce logging

var communication = require('./Communication');
var game = require('./Game')(communication);
var database = require('./Database')(communication,game);
game.setDatabase(database);

io.of('/game').on('connection', function(socket)
{
    var index = communication.connection(socket);
    
    socket.on('disconnect', function()
    {
        game.disconnect(index);
    });
    
    socket.on('loadGame', function(data)
    {
        database.loadGame(data.user,index);
    });
    
    socket.on('enterGame', function(data)
    {
        database.enterGame(data.user,index);
    });
    
    socket.on('move', function(data)
    {
        game.move(data.direction,data.user,data.map);
    });
    
    socket.on('changeMap', function(data)
    {
        game.changeMap(data.user,data.map,index);
    });
    
    socket.on('saveVariable', function(data)
    {
        database.saveVariable(data.variable, data.user);
    });
});

io.of('/editor').on('connection', function(socket)
{
    var index = communication.connection(socket);
    
    socket.on('loadMapEditor', function()
    {
        database.loadMapEditor(index);
    });
    socket.on('loadMap', function(data)
    {
        database.loadById('map',data.id,index);
    });
});