var Editor = function(){
    
    Editor.launch = function(){
        Socket();
        
        Drawer();
        EditorMap();
        
        var tileSetArray = Editor.getTileSetArray();
        var spriteArray = Editor.getSpriteArray();
        
        Canvas($("#canvas").get(0));
        Canvas.init(tileSetArray, spriteArray);
        
        TileSet($("#tileSet").get(0));
        TileSet.init();
        
        Editor.launchSelect();
        Editor.launchMapCanvas();
        
    };
    
    /**
     * Get the TileSetArray
     * @returns {Array}
     */
    Editor.getTileSetArray = function(){
        var array = [
            "plaines", //0
            "plaines_objets", //1
            "murs", //2
            "mobilier" //3
        ];
        return array;
    };
    
    /**
     * Get the SpriteArray
     * @returns {Array}
     */
    Editor.getSpriteArray = function(){
        var array = [
            "foxPNG" //0
        ]; 
        return array;
    };
    
    /**
     * Initialize the select element
     * @returns {void}
     */
    Editor.launchSelect = function(){
        var select = $("#select_tileset");
        
        for(var i=0; i<Canvas.tileSets.length; i++){
            var name = Canvas.tileSets[i].src.split("/").pop();
            select.append($('<option>', {value : i}).text(name)); 
        }
        
        select.change(function(){
            TileSet.loadTileSet($("#select_tileset").get(0).value); //TODO:
            EditorMap.setTileSet($("#select_tileset").get(0).value);
        });
    };
    
    /**
     * Initialize the clicks on the map canvas
     * @returns {void}
     */
    Editor.launchMapCanvas = function(){
        var coordsDown;
        var coordsUp;
        
        $(Canvas.object).mousedown(function(e){
            coordsDown = new Coords().pxToTile(getRealCoords(e.pageX,e.pageY,Canvas.object), 32);
        });
        
        $(Canvas.object).mouseup(function(e){
            coordsUp = new Coords().pxToTile(getRealCoords(e.pageX,e.pageY,Canvas.object), 32);
            var topLeft = new Coords();
            var dCoords = new Coords();
            topLeft.x = Math.min(coordsDown.x, coordsUp.x);
            topLeft.y = Math.min(coordsDown.y, coordsUp.y);
            dCoords.x = Math.abs(coordsDown.x - coordsUp.x);
            dCoords.y = Math.abs(coordsDown.y - coordsUp.y);
            if(EditorMap.currentLayer != -1)
                EditorMap.placeSelection(topLeft,dCoords);
            else
                EditorMap.placeObstable(topLeft,dCoords);
        });
    };
    
    Editor.ready = function(){
        TileSet.loadTileSet(0);
        EditorMap.draw();
    };
};