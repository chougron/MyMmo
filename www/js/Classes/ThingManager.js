var ThingManager = Class.extend(
{
    init : function()
    {
         this.players = {};
         this.pnjs = {};
         this.user = new User();
    },
    /**
     * Draw the Pnjs and the Players
     * @returns {void}
     */
    draw : function(drawer)
    {
        //First we draw then PNJs
        for(var i in this.pnjs){
            var _pnj = this.pnjs[i];
            _pnj.draw(drawer);
        }
        //Then we draw the Players
        for(var i in this.players){
            var _player = this.players[i];
            _player.draw(drawer);
        }
        this.user.draw(drawer);
    },
    /**
     * Add a Player in the players Array
     * @param {Player} player
     * @returns {void}
     */
    addPlayer : function(player)
    {
        var tmpPlayer = new Player();
        tmpPlayer.hydrate(player);
        this.players[tmpPlayer._id] = tmpPlayer;
        delete tmpPlayer;
    },
    /**
     * Add a Pnj in the pnjs Array
     * @param {Pnj} pnj
     * @returns {void}
     */
    addPnj : function(pnj){
        var tmpPnj = new Pnj();
        tmpPnj.hydrate(pnj);
        this.pnjs[tmpPnj._id] = tmpPnj;
        GameEngineInstance.questManager.refreshAll();
        this.pnjs[tmpPnj._id].create();
    },
    /**
     * Remove a Player in the players Array
     * @param {_id} player
     * @returns {void}
     */
    removePlayer : function(player){
        delete this.players[player];
    },
    /**
     * Check if a Pnj is at the given coords.
     * If so, give it the act to do
     * @param {Coords} coords
     * @param {ACTION} action
     * @returns {void}
     */
    actPnj : function(coords, action){
        for(var i in this.pnjs){
            if(coords.equals(this.pnjs[i].coords)){
                if(action == ACTION.ACT)
                    this.pnjs[i].act();
                if(action == ACTION.WALK)
                    this.pnjs[i].walk();
            }
        }
    },
    /**
     * Check if there is something blocking the Coords
     * @param {Coords} coords
     * @returns {Boolean}
     */
    obstacle : function(coords){
        for (var i in this.pnjs){
            var _pnj = this.pnjs[i];
            if(_pnj.block && _pnj.coords.equals(coords))return true;
        }
        return false;
    },
    /**
     * Add an array of Player to the players list
     * @param {Array<Player>} players
     * @returns {void}
     */
    addPlayers : function(players){
        for (var i in players){
            var tmpPlayer = players[i];
            tmpPlayer.user = false;
            this.addPlayer(tmpPlayer);
            delete tmpPlayer;
        }
    },
    /**
     * Add an array of Pnj to the pnjs list
     * @param {Array<Pnj>} pnjs
     * @returns {void}
     */
    addPnjs : function(pnjs){
        for (var i in pnjs){
            var pnj = new Pnj();
            pnj.hydrate(pnjs[i]);
            this.pnjs[pnj._id] = pnj;
        }
        GameEngineInstance.questManager.refreshAll();
        for (var i in pnjs){
            var pnj = pnjs[i];
            this.pnjs[pnj._id].create();
        }
    },
    /**
     * Clean the objets of the manager
     * @return {void}
     */
    reset : function()
    {
        for(var i in this.pnjs)
            delete this.pnjs[i];
        for(var i in this.players)
            delete this.players[i];
        delete this.user;
        this.user = new User();
    }
});