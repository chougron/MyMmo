var connections = {};

exports.sendMessageToUser = function(emit,message,index)
{
    connections[index].emit(emit,message);
};

exports.sendMessageToUsers = function(emit,message,users)
{
    for(var index in users)
    {
        module.exports.sendMessageToUser(emit,message,index);
    }
};

exports.sendErrorToUser = function(message,index)
{
    connections[index].emit('error', {message : message});
};

exports.connection = function(connection)
{
    var index;
    var indexFound = false;
    while(!indexFound)
    {
        index = "u" + new Date().getTime();
        if(!connections[index])
        {
            indexFound = true;
        }
    }
    connections[index] = connection;
    console.log((new Date()) + " Connected : " + index);
    return index;
};

exports.disconnect = function(index)
{
    delete connections[index];
};

exports.loadGame = function(files,quests,variables,index)
{
    var message = {
        files       :   files,
        quests      :   quests,
        variables   :   variables
    };
    var json = JSON.stringify(message);
    module.exports.sendMessageToUser('loadGame',json,index);
};

exports.playerLeaveMap = function(player_id,toNotify)
{
    var message = {
        id  :   player_id
    };
    var json = JSON.stringify(message);
    module.exports.sendMessageToUsers('playerLeaveMap',json,toNotify);
};

exports.playerJoinMap = function(player,toNotify)
{
    var message = {
        player  :   player
    };
    var json = JSON.stringify(message);
    module.exports.sendMessageToUsers('playerJoinMap',json,toNotify);
};

exports.changeMap = function(player,map,players,pnjs,index)
{
    var message = {
        user    :   player,
        map     :   map,
        players :   players,
        pnjs    :   pnjs
    };
    var json = JSON.stringify(message);
    module.exports.sendMessageToUser('changeMap',json,index);
};

exports.playerMove = function(direction, player_id, toNotify)
{
    var message = {
        direction   :   direction,
        player      :   player_id
    };
    var json = JSON.stringify(message);
    module.exports.sendMessageToUsers('playerMove',json,toNotify);
};