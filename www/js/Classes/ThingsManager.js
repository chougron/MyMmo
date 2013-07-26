var ThingsManager = function(){
    ThingsManager.players = new Array();
    ThingsManager.pnjs = {};
    ThingsManager.user = new Player();
    
    /**
     * Draw the Pnjs and the Players
     * @returns {void}
     */
    ThingsManager.draw = function(){
        //First we draw the PNJs
        for(var i in ThingsManager.pnjs){
            var _pnj = ThingsManager.pnjs[i];
            _pnj.draw();
            var nb = _pnj.coords.toIndex(Map.width, true);
            Map.repaint[nb] = true;
            var nbup = _pnj.coords.toIndexUp(Map.width, true);
            Map.repaint[nbup] = true;
            nb = _pnj.coords.toIndex(Map.width, false);
            Map.repaint[nb] = true;
            nbup = _pnj.coords.toIndexUp(Map.width, false);
            Map.repaint[nbup] = true;
        }
        //Then we draw the Players
        for(var i=0; i<ThingsManager.players.length; i++){
            var _player = ThingsManager.players[i];
            _player.draw();
            var nb = _player.coords.toIndex(Map.width, true);
            Map.repaint[nb] = true;
            var nbup = _player.coords.toIndexUp(Map.width, true);
            Map.repaint[nbup] = true;
            nb = _player.coords.toIndex(Map.width, false);
            Map.repaint[nb] = true;
            nbup = _player.coords.toIndexUp(Map.width, false);
            Map.repaint[nbup] = true;
        }
        //Finally the user
        _player = ThingsManager.user;
        _player.draw();
        var nb = _player.coords.toIndex(Map.width, true);
        Map.repaint[nb] = true;
        var nbup = _player.coords.toIndexUp(Map.width, true);
        Map.repaint[nbup] = true;
        nb = _player.coords.toIndex(Map.width, false);
        Map.repaint[nb] = true;
        nbup = _player.coords.toIndexUp(Map.width, false);
        Map.repaint[nbup] = true;
    };
    
    /**
     * Add a Player in the players Array
     * @param {Player} player
     * @returns {void}
     */
    ThingsManager.addPlayer = function(player){
        var tmpPlayer = new Player();
        tmpPlayer.hydrate(player);
        ThingsManager.players.push(tmpPlayer);
        delete tmpPlayer;
    };
    
    /**
     * Add a Pnj in the pnjs Array
     * @param {Pnj} pnj
     * @returns {void}
     */
    ThingsManager.addPnj = function(pnj){
        var tmpPnj = new Pnj();
        tmpPnj.hydrate(pnj);
        ThingsManager.pnjs[tmpPnj._id] = tmpPnj;
        delete tmpPnj;
    };
    
    /**
     * Remove a Player in the players Array
     * @param {Player} player
     * @returns {void}
     */
    ThingsManager.removePlayer = function(player){
        for(var i=0; i<ThingsManager.players.length; i++){
            if(ThingsManager.players[i].name == player.name){
                ThingsManager.players.splice(i,1);
                break;
            }
        }
    };
    
    /**
     * Check if a Pnj is at the given coords.
     * If so, give it the act to do
     * @param {Coords} coords
     * @param {String} action
     * @returns {void}
     */
    ThingsManager.actPnj = function(coords, action){
        for(var i in ThingsManager.pnjs){
            if(coords.equals(ThingsManager.pnjs[i].coords)){
                if(action == 'act')ThingsManager.pnjs[i].act('');
                if(action == 'walk')ThingsManager.pnjs[i].walk('');
            }
        }
    };
    
    /**
     * Check if there is something blocking the Coords
     * @param {Coords} coords
     * @returns {Boolean}
     */
    ThingsManager.obstacle = function(coords){
        for (var i in ThingsManager.pnjs){
            var _pnj = ThingsManager.pnjs[i];
            if(_pnj.block && _pnj.coords.equals(coords))return true;
        }
        return false;
    };
    
    /**
     * Add an array of Player to the players list
     * @param {Array} players
     * @returns {void}
     */
    ThingsManager.addPlayers = function(players){
        for (var i in players){
            var tmpPlayer = players[i];
            tmpPlayer.user = false;
            ThingsManager.addPlayer(tmpPlayer);
            delete tmpPlayer;
        }
    };
    
    /**
     * Add an array of Pnj to the pnjs list
     * @param {Array} pnjs
     * @returns {void}
     */
    ThingsManager.addPnjs = function(pnjs){
        for (var i in pnjs){
            ThingsManager.addPnj(pnjs[i]);
        }
    };
    
    /**
     * Resets the pnjs and the players
     * @returns {void}
     */
    ThingsManager.changeMap = function(){
        ThingsManager.pnjs = {};
        ThingsManager.players = new Array();
    };
};