var Map = function(){
    Map.author = '';
    Map.title = '';
    Map.width;
    Map.height;
    Map.tileSets = new Array(); //Array of tilesets ID corresponding to the imageFiles
    Map.obstacles = new Array();
    
    //The Map
    Map.tiles = new Array();
    Map.repaint = new Array();
    
    /**
     * Load a Map
     * @param {String} author The Map author
     * @param {String} _name The Map name
     * @returns {void}
     */
    Map.loadMap = function(author, _name){
        Map.author = author;
        Map.title = _name;
        
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
        
        Map.title       = map.title;
        Map.author      = map.author;
        Map.width       = map.width;
        Map.height      = map.height;
        Map.tileSets    = map.tileSets;
        Map.obstacles   = map.obstacles;
        Map.tiles       = map.tiles;
        
        for(var i=0; i<Map.height * Map.width;i++)
            Map.repaint[i]=true;
        
        console.log('Map script loaded');
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
        ThingsManager.draw();
    };
    
    /**
     * Check if there is an obstacle at the given coords
     * @param {Coords} coords The coordinates to look
     * @returns {Boolean} Return false if there is no obstacle
     */
    Map.checkObstacle = function(coords){
        var index = coords.toIndex(Map.width, true);
        return Map.obstacles[index] || ThingsManager.obstacle(coords);
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