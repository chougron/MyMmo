var Socket = function(){
    Socket.connection = io.connect('http://localhost:8080');
    Socket.connection.on('connect', function(){
        console.log("WS connection opened");
    });
    
    Socket.connection.on('message', function(message){
        var data = JSON.parse(message);
        console.log("Received : "+data.act);
        switch(data.act){
            case 'join':
                Socket.doJoin(data.player);
                break;
            case 'getPlayerList':
                Socket.doGetPlayerList(data.players);
                break;
            case 'getPnjList':
                Socket.doGetPnjList(data.pnjs);
                break;
            case 'move':
                Socket.doMove(data.player);
                break;
            case 'changeZone':
                Socket.doChangeZone(data.player, data.oldZone, data.newZone);
                break;
            case 'changeMap':
                Socket.doChangeMap(data.player, data.oldMap, data.newMap);
                break;
        }
    });
    
    /**
     * Add a player that just joined the map
     * @param {BDD Player} player
     * @returns {void}
     */
    Socket.doJoin = function(player){
        Map.addPlayer(player.name, player.animation.sprite, player.animation.direction, player.coords.x, player.coords.y);
    };
    
    /**
     * Add all the players of the map
     * @param {BDD Player[]} players
     * @returns {void}
     */
    Socket.doGetPlayerList = function(players){
        for(var i=0; i<players.length; i++){
            var player = players[i];
            Map.addPlayer(player.name, player.animation.sprite, player.animation.direction, player.coords.x, player.coords.y);
        }
    };
    
    /**
     * Add all the PNJs of the map
     * @param {BDD PNJ[]} pnjs
     * @returns {void}
     */
    Socket.doGetPnjList = function(pnjs){
        for(var i=0; i<pnjs.length; i++){
            var pnj = new Pnj();
            pnj.hydrate(pnjs[i]);
            
            Map.addPnj(pnj);
        }
    };
    
    /**
     * Move a player on the Map
     * @param {BDD Player} player
     * @returns {void}
     */
    Socket.doMove = function(player){
        for(var i=0; i<Map.players.length; i++){
            if(Map.players[i].name == player.name){
                if(Map.players[i].distance(player) != 0){
                    //If we missed a message, the player should be elsewhere
                    //So we put it in it's cell, and do the movement
                    Map.players[i].coords.x = player.coords.x;
                    Map.players[i].coords.y = player.coords.y;
                }
                Map.players[i].move(player.animation.direction);
                break;
            }
        }
    };
    
    /**
     * Change the Map for a player
     * @param {BDD Player} player
     * @param {Map} oldMap
     * @param {Map} newMap
     * @returns {void}
     */
    Socket.doChangeMap = function(player, oldMap, newMap){
        if(Map.equals(oldMap))
            Map.removePlayer(player);
        if(Map.equals(newMap))
            Map.addPlayer(player.name, player.animation.sprite, player.animation.direction, player.coords.x, player.coords.y);
    };
};