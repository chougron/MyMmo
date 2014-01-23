var communication;
var database;

var players_connected = {};
var pnjs = {};
var maps = {};

module.exports = function(_communication)
{
    communication = _communication;
    return module.exports;
};

module.exports.setDatabase = function(_database)
{
    database = _database;
};

module.exports.launch = function(_pnjs, _maps)
{
    for(var i in _maps)
    {
        var map = _maps[i];
        map.players = {};
        map.pnjs = {};
        maps[map._id] = map;
    }
    for(var i in _pnjs)
    {
        var pnj = _pnjs[i];
        pnjs[pnj._id] = pnj;
        maps[pnj.map].pnjs[pnj._id] = pnj._id;
    }
    console.log((new Date()) + " Game Launched.");
};

module.exports.disconnect = function(index)
{
    console.log((new Date()) + " Disconnected : " + index);
    var found = false;
    var player;
    for(var _id in players_connected)
    {
        if(players_connected[_id].index == index)
        {
            player = players_connected[_id];
            found = true;
            break;
        }
    }
    
    communication.disconnect(index);
    
    if(!found)
        return;
    
    //We save the player in the database
    database.savePlayer(player.player);
    
    //We tell users that the player left
    var toNotify = indexInSameMap(player.player.map, player.player._id);
    communication.playerLeaveMap(player.player._id,toNotify);
    
    delete maps[player.player.map].players[player.player._id];
    delete players_connected[player.player._id];
};

/**
 * A new Player enter the game
 * @param {Player} player
 * @param {index} index
 * @returns {void}
 */
module.exports.enterGame = function(player, index)
{
    var player_object = { player : null, index : null};
    players_connected[player._id] = player_object;
    players_connected[player._id].player = player;
    players_connected[player._id].index = index;
    module.exports.changeMap(player, player.map, index);
};

/**
 * A player changes map
 * @param {Player} player
 * @param {_id} newMap
 * @param {index} index
 * @returns {void}
 */
module.exports.changeMap = function(player, newMap, index)
{
    //We delete the player from the old Map
    if(player.map != newMap)
    {
        delete maps[player.map].players[player._id];
        var toNotify = indexInSameMap(player.map, player._id);
        communication.playerLeaveMap(player._id,toNotify);
    }
    
    //We send the informations of the new Map to the player
    var map = maps[newMap];
    
    var _players = new Array();
    var _pnjs = new Array();
    for(var _id in map.players)
        _players.push(players_connected[_id].player);
    for(var _id in map.pnjs)
        _pnjs.push(pnjs[_id]);
    
    player.map = newMap;
    communication.changeMap(player,map,_players,_pnjs,index);
    
    //We add the player to the new Map
    var toNotify = indexInSameMap(newMap, player._id);
    communication.playerJoinMap(player,toNotify);
    maps[newMap].players[player._id] = player._id;
    players_connected[player._id].player = player;
    
    //We save the player in the BDD ?
    database.savePlayer(player);
};

module.exports.move = function(direction, player_id, map_id)
{
    var player = players_connected[player_id].player;
    var newCoords = {x:0,y:0};
    switch(direction)
    {
        case DIRECTION.RIGHT:
            newCoords.x = player.coords.x+1;
            newCoords.y = player.coords.y;
            break;
        case DIRECTION.UP:
            newCoords.x = player.coords.x;
            newCoords.y = player.coords.y-1;
            break;
        case DIRECTION.DOWN:
            newCoords.x = player.coords.x;
            newCoords.y = player.coords.y+1;
            break;
        case DIRECTION.LEFT:
            newCoords.x = player.coords.x-1;
            newCoords.y = player.coords.y;
            break;
    }
    if(canMove(newCoords,map_id))
    {
        players_connected[player_id].player.coords = newCoords;
        var toNotify = indexInSameMap(map_id, player_id);
        communication.playerMove(direction, player_id, toNotify);
    }
};

var indexInSameMap = function(map_id, player_id)
{
    var retour = {};
    for(var i in maps[map_id].players)
    {
        if(i != player_id)
        {
            var index = players_connected[i].index;
            retour[index] = index;
        }
    }
    return retour;
};

var canMove = function(coords, _map)
{
    var map = maps[_map];
    if(coords.x <= 0 || coords.y <= 0 || 
            coords.x > map.width || coords.y > map.height)
    {
        console.log("canMove off grid");
        return false;
    }
    var tileNumber = (coords.y - 1) * map.width + coords.x -1;
    if(map.obstacles[tileNumber])
    {
        console.log("canMove obstacle");
        return false;
    }
    for(var i in map.pnjs)
    {
        var pnj = pnjs[i];
        if(pnj.coords.x == coords.x && pnj.coords.y == coords.y && pnj.block == true)
        {
            console.log("canMove pnj block");
            return false;
        }
    }
    return true;
};

/**
 * Represent the direction of a Thing
 * @returns {DIRECTION}
 */
var DIRECTION = function(){};
DIRECTION.RIGHT = 0;
DIRECTION.UP = 1;
DIRECTION.DOWN = 2;
DIRECTION.LEFT = 3;

/**
 * Represent the action of a Thing
 * @returns {ACTION}
 */
var ACTION = function(){};
ACTION.WALK   = 0;
ACTION.ATTACK = 1;
ACTION.STAND  = 2;
ACTION.ACT    = 3;