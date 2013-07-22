var Map = function(){
    Map.author;
    Map.width;
    Map.height;
    Map.tileSets = new Array(); //Array of tilesets ID corresponding to the imageFiles
    Map.obstacles = new Array();
    
    //The Map
    Map.tiles = new Array();
    
    Map.pnjs = new Array();
    Map.players = new Array();
    Map.repaint = new Array();
    
    
    /**
     * Load a Map
     * @param {String} author The Map author
     * @param {String} _name The Map name
     * @returns {void}
     */
    Map.loadMap = function(author, _name){
        Motor.stop();
        Map.name = _name;
        Map.author = author;
        Map.title = _name;
        
        Map.pnjs = new Array();
        Map.players = new Array();
        
        var message = {act:'loadMap',map:{author:author,title:_name}};
        var toSend = JSON.stringify(message);
        Socket.connection.send(toSend);
    };
    
    /**
     * Hydrate the Map with the file content
     * Then launch the Motor
     * @param {type} map
     * @returns {undefined}
     */
    Map.doLoadMap = function(map){
        
        Map.width       = map.width;
        Map.height      = map.height;
        Map.tileSets    = map.tileSets;
        Map.obstacles   = map.obstacles;
        Map.tiles       = map.tiles;
        
        for(var i=0; i<Map.height * Map.width;i++)
            Map.repaint[i]=true;
        
        console.log('Map script loaded');
        Motor.launch();
    };
    
    /**
     * Draw the Map in the following order :
     * Tiles, PNJs, Players
     * @returns {void}
     */
    Map.draw = function(){
        //At first, we draw the Map tiles
        for(var i=0; i<Map.height * Map.width; i++){
            if(Map.repaint[i]){
                for(var layer=0; layer<Map.tileSets.length; layer++){
                    Drawer.setTileSet(Map.tileSets[layer]);
                    var value = Map.tiles[layer][i];
                    if(value != 0){ //If value is 0, nothing on tile
                        var x = (i+1) % Map.width;
                        if(x == 0) x = Map.width;
                        var y = Math.ceil((i+1) / Map.width);
                        Drawer.drawFromTileSet(x,y,value,Canvas);
                    }
                }
                Map.repaint[i] = false;
            }
        }
        //Then we draw the PNJs
        for(var i=0; i<Map.pnjs.length; i++){
            var _pnj = Map.pnjs[i];
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
        for(var i=0; i<Map.players.length; i++){
            var _player = Map.players[i];
            if(Map.equals(_player.map)){
                Map.players[i].draw();
                var nb = _player.coords.toIndex(Map.width, true);
                Map.repaint[nb] = true;
                var nbup = _player.coords.toIndexUp(Map.width, true);
                Map.repaint[nbup] = true;
                nb = _player.coords.toIndex(Map.width, false);
                Map.repaint[nb] = true;
                nbup = _player.coords.toIndexUp(Map.width, false);
                Map.repaint[nbup] = true;
            }
        }
    };
    
    /**
     * Add a player to the Map
     * @param {String} name The player Name
     * @param {int} sprite The player Sprite
     * @param {int} direction The player direction
     * @param {Coords} coords The player coordinates
     * @returns {Player} The player added
     */
    Map.addPlayer = function(name, sprite, direction, coords){
        var tmpPlayer = new Player();
        tmpPlayer.create(name, sprite, direction, coords.x, coords.y);
        tmpPlayer.setMap(Map.author, Map.title);
        Map.players.push(tmpPlayer);
        return tmpPlayer;
    };
    
    /**
     * Add a PNJ to the PNJ array
     * @param {PNJ} pnj The PNJ to add
     * @returns {void}
     */
    Map.addPnj = function(pnj){
        Map.pnjs.push(pnj);
    };
    
    /**
     * Remove a player from the Map
     * @param {Player} player
     * @returns {void}
     */
    Map.removePlayer = function(player){
        for(var i=0; i<Map.players.length; i++){
            if(Map.players[i].name == player.name){
                Map.players.splice(i,1);
                break;
            }
        }
    };
    
    /**
     * Search for a PNJ at the coords, and give them
     * the action if it exists
     * @param {Coords} coords The coordinates to look
     * @param {String} action The action to perform
     * @returns {void}
     */
    Map.actPnj = function(coords, action){
        if(!Map.pnjs.length)return;
        for(var i=0; i<Map.pnjs.length;i++){
            if(coords.equals(Map.pnjs[i].coords)){
                if(action == 'act')Map.pnjs[i].onAct('');
                if(action == 'walk')Map.pnjs[i].onWalk('');
            }
        }
    };
    
    /**
     * Check if there is an obstacle at the given coords
     * @param {Coords} coords The coordinates to look
     * @returns {Boolean} Return false if there is no obstacle
     */
    Map.checkObstacle = function(coords){
        var index = coords.toIndex(Map.width, true);
        if(Map.obstacles[index])return true;
        for(var i=0; i<Map.pnjs.length; i++){
            var _pnj = Map.pnjs[i];
            if(_pnj.block && _pnj.coords.equals(coords))return true;
        }
        return false;
    };
    
    /**
     * Check if the Map is the same as the one given
     * @param {Map} map The map to compare
     * @returns {Boolean} Return true if they are the same
     */
    Map.equals = function(map){
        return (Map.author == map.author) && (Map.title == map.title);
    };
};