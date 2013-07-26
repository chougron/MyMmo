var TileSet = function(tileSetCanvasDomObject){
    TileSet.object = tileSetCanvasDomObject;
    TileSet.context = tileSetCanvasDomObject.getContext("2d");
    
    TileSet.width = 320;
    TileSet.height = 384;
    
    TileSet.topLeftCoords = new Coords();
    TileSet.dCoords = new Coords();
    
    TileSet.tileSet;
    
    /**
     * Initialize the TileSet Canvas
     * @returns {void}
     */
    TileSet.init = function(){
        TileSet.object.width = TileSet.width;
        TileSet.object.height = TileSet.height;
        
        TileSet.setMouseActions();
    };
    
    /**
     * Load a new TileSet for the display
     * @param {String} number The _id of the new TileSet
     * @returns {void}
     */
    TileSet.loadTileSet = function(number){
        Drawer.drawWhite({x:1,y:1}, {x:10,y:12}, TileSet);
        var _tileSet = FilesManager.tilesets[number];
        if(_tileSet.img.width != 320){
            console.log("TileSet width != 320");
            return;
        }
        if(_tileSet.img.height != 384){
            console.log("TileSet height != 384");
            return;
        }
        TileSet.tileSet = number;
        Drawer.setTileSet(number);
        Drawer.drawTileSet(TileSet);
        Drawer.drawGrid(TileSet);
    };
    
    /**
     * Add the mouse actions for the TileSet
     * @returns {void}
     */
    TileSet.setMouseActions = function(){
        var coordsDown;
        var coordsUp;
        
        $(TileSet.object).mousedown(function(e){
            coordsDown = new Coords().pxToTile(getRealCoords(e.pageX, e.pageY, TileSet.object), 32);
        });
        
        $(TileSet.object).mouseup(function(e){
            coordsUp = new Coords().pxToTile(getRealCoords(e.pageX, e.pageY, TileSet.object), 32);
            TileSet.topLeftCoords.x = Math.min(coordsDown.x, coordsUp.x);
            TileSet.topLeftCoords.y = Math.min(coordsDown.y, coordsUp.y);
            TileSet.dCoords.x = Math.abs(coordsDown.x - coordsUp.x);
            TileSet.dCoords.y = Math.abs(coordsDown.y - coordsUp.y);
            if(EditorMap.currentLayer != -1)
                TileSet.drawSelectionRectangle();
        });
    };
    
    /**
     * Draw a selection Rectangle
     * @returns {void}
     */
    TileSet.drawSelectionRectangle = function(){
        Drawer.setTileSet(TileSet.tileSet);
        Drawer.drawWhite({x:1,y:1}, {x:10,y:12}, TileSet);
        Drawer.drawTileSet(TileSet);
        Drawer.drawGrid(TileSet);
        Drawer.drawSelectionRectangle(TileSet.topLeftCoords, TileSet.dCoords, TileSet);
    };
    
    /**
     * Return the number of the tile from the TileSet TopLeftPoint and the dX and dY given
     * @param {int} dX The delta X
     * @param {int} dY The delta Y
     * @returns {int} The number of the Tile
     */
    TileSet.getTileNumber = function(dX, dY){
        var tileX = TileSet.topLeftCoords.x + dX;
        var tileY = TileSet.topLeftCoords.y + dY;
        var number = (tileY-1)*10 + tileX;
        return number;
    };
};