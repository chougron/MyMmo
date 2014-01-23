var Server = function()
{
    Server.connection = io.connect('http://localhost:8080');
    Server.connection.on('connect', function(){
        console.log("Server connection established");
    });
    
    Server.connection.on('error', function(error)
    {
        var data = JSON.parse(error);
        console.log(data.message);
    });
    
    Server.loadGame = function()
    {
        var message = {
            user : GameEngineInstance.thingManager.user._id
        };
        Server.connection.emit('loadGame', message);
    };
    
    Server.connection.on('loadGame', function(message)
    {
        var data = JSON.parse(message);
        GameEngineInstance.doLoadGame(data.files, data.quests, data.variables, data.user);
    });
    
    Server.enterGame = function()
    {
        var message = {
            user : GameEngineInstance.thingManager.user._id
        };
        Server.connection.emit('enterGame', message);
    };
    
    Server.changeMap = function(map)
    {
        var message = {
            map     :   map,
            user    :   GameEngineInstance.thingManager.user
        };
        Server.connection.emit('changeMap', message);
    };
    
    Server.connection.on('changeMap', function(message)
    {
        var data = JSON.parse(message);
        console.log(data.user);
        GameEngineInstance.changeMap(data.user, data.map, data.players, data.pnjs);
    });
    
    Server.connection.on('playerLeaveMap', function(message)
    {
        var data = JSON.parse(message);
        GameEngineInstance.thingManager.removePlayer(data.player_id);
    });
    
    Server.connection.on('playerJoinMap', function(message)
    {
        var data = JSON.parse(message);
        GameEngineInstance.thingManager.addPlayer(data.player);
    });
    
    Server.move = function(direction)
    {
        var message = {
            direction   :   direction,
            user        :   GameEngineInstance.thingManager.user._id,
            map         :   GameEngineInstance.map._id
        };
        Server.connection.emit('move', message);
    };
    
    Server.connection.on('playerMove', function(message)
    {
        var data = JSON.parse(message);
        GameEngineInstance.thingManager.players[data.player].move(data.direction);
    });
    
    Server.saveVariable = function(variable)
    {
        var message = { 
            variable    :   variable,
            user        :   GameEngineInstance.thingManager.user._id
        };
        Server.connection.emit('saveVariable', message);
    };
};