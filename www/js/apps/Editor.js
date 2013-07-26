var Editor = function(){
    
    /**
     * Launch the editor application
     * @returns {void}
     */
    Editor.launch = function(){
        Socket();
        
        Drawer();
        EditorMap();
        
        FilesManager();
        
        QuestsManager();
        
        Canvas($("#canvas").get(0));
        Canvas.init();
        
        TileSet($("#tileSet").get(0));
        TileSet.init();
        
        VariablesManager();
        
        var message = {act:'loadGame',user:'u0000001'};
        var toSend = JSON.stringify(message);
        Socket.connection.send(toSend);
    };
    
    /**
     * Initialize the select element
     * @returns {void}
     */
    Editor.launchSelect = function(){
        var select = $("#select_tileset");
        
        for(var i in FilesManager.tilesets){
            var tmpTileSet = FilesManager.tilesets[i];
            select.append($('<option>', {value : tmpTileSet._id}).text(tmpTileSet.name));
            delete(tmpTileSet);
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
    
    /**
     * Function launched when the FilesManager loaded all resources.
     * @returns {void}
     */
    Editor.ready = function(){
        //Load the first tileset
        TileSet.loadTileSet(FilesManager.tilesets[Object.keys(FilesManager.tilesets)[0]]._id);
        
        Editor.launchSelect();
        Editor.launchMapCanvas();
        
        EditorMap.init();
        EditorMap.draw();
    };
};