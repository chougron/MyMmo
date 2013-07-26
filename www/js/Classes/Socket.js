var Socket = function(){
    Socket.connection = io.connect('http://localhost:8080');
    Socket.connection.on('connect', function(){
        console.log("WS connection opened");
    });
    
    Socket.connection.on('message', function(message){
        var data = JSON.parse(message);
        console.log("Received : "+data.act);
        switch(data.act){
            case 'move':
                Socket.doMove(data.player);
                break;
            case 'changeMap':
                Socket.doChangeMap(data.map, data.pnjs, data.quests, data.players);
                break;
            case 'otherChangeMap':
                Socket.doOtherChangeMap(data.player,data.oldMap,data.newMap);
                break;
            case 'chat':
                Socket.doChat(data.content,data.player);
                break;
            case 'loadGame':
                Socket.doLoadGame(data.files, data.quests, data.variables);
                break;
            case 'loadMap':
                Socket.doLoadMap(data.map);
                break;
            case 'getAllItems':
                Socket.doGetAllItems(data.items);
                break;
            case 'disconnect':
                Socket.doDisconnect(data.player);
                break;
        }
    });
    
    /**
     * Ask the server the informations to change map
     * @param {Object} newMap
     * @returns {void}
     */
    Socket.changeMap = function(newMap){
        Motor.stop();
        ThingsManager.changeMap();
        var oldMap = {title:Map.title,author:Map.author};
        var message = {
            act:'changeMap',
            player:ThingsManager.user,
            oldMap:oldMap,
            newMap:newMap
        };
        var json = JSON.stringify(message);
        Socket.connection.send(json);
    };
    
    /**
     * Move a player on the Map
     * @param {BDD Player} player
     * @returns {void}
     */
    Socket.doMove = function(player){
        for(var i in ThingsManager.players){
            if(ThingsManager.players[i].name == player.name){
                if(ThingsManager.players[i].distance(player) != 0){
                    //If we missed a message, the player should be elsewhere
                    //So we put it in it's cell, and do the movement
                    ThingsManager.players[i].coords.x = player.coords.x;
                    ThingsManager.players[i].coords.y = player.coords.y;
                }
                ThingsManager.players[i].move(player.animation.direction);
                break;
            }
        }
    };
    
    /**
     * Change the Map for the User
     * @param {Map} map The new map
     * @param {Array} pnjs The pnjs presents on the new map
     * @param {Array} quests The quests for the new map
     * @param {Array} players The players presents on the new map
     */
    Socket.doChangeMap = function(map,pnjs,quests,players){
        Map.doLoadMap(map);
        ThingsManager.addPlayers(players);
        ThingsManager.addPnjs(pnjs);
        ThingsManager.user.setMap(map);
        QuestsManager.addMapQuests(quests);
        QuestsManager.refresh(QuestsManager.allQuests);
        Motor.launch();
    };
    
    /**
     * Remove a player leaving the map or add a player joining it
     * @param {Player} player
     * @param {Object} oldMap
     * @param {Object} newMap
     * @returns {void}
     */
    Socket.doOtherChangeMap = function(player,oldMap,newMap){
        if(Map.equals(oldMap))
            ThingsManager.removePlayer(player);
        if(Map.equals(newMap))
            ThingsManager.addPlayer(player);
    };
    
    /**
     * Make a player talk
     * @param {String} content
     * @param {BDD Player} player
     * @returns {void}
     */
    Socket.doChat = function(content,player){
        for(var i=0; i<Map.players.length; i++){
            if(Map.players[i].name == player.name){
                Map.players[i].speak(content);
                break;
            }
        }
    };
    
    /**
     * Load the game Data
     * @param {Array} files The files to load
     * @param {Array} quests The quests for all the maps
     * @param {Array} variables The variables of the user
     * @returns {void}
     */
    Socket.doLoadGame = function(files, quests, variables){
        FilesManager.doGetFromDB(files);
        QuestsManager.addAllQuests(quests);
        VariablesManager.addVariables(variables);
    };
    
    /**
     * Load the map requested
     * @param {BDD Map} map
     * @returns {void}
     */
    Socket.doLoadMap = function(map){
        Map.doLoadMap(map);
    };
    
    /**
     * Load all the items
     * @param {Array} items
     * @returns {void}
     */
    Socket.doGetAllItems = function(items){
        ItemsEditor.doGetAllItems(items);
    };
    
    /**
     * Remove a player that disconnected
     * @param {Player} player
     * @returns {void}
     */
    Socket.doDisconnect = function(player){
        ThingsManager.removePlayer(player);
    };
};