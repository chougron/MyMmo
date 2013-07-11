var TileSet = function(){
    this.object;
    this.topLeftCoords = {x:null,y:null};
    this.dCoords = {x:0,y:0};
    this.tileSet;
    
    this.init = function(){
        this.object = $("#tileSet").get(0);
        this.object.width = 320;
        this.object.height = 384;
        this.setMouseActions();
    }
    
    /**
     * Charge un TileSet pour le canvas
     * @param : number le numéro du TileSet
     */
    this.loadTileSet = function(number){
        DRAWER.drawWhite({x:1,y:1}, {x:10,y:12}, this.object);
        var _tileSet = tileSets[number];
        if(_tileSet.width != 320){
            log("La largeur du TileSet != 320");
            return;
        }
        if(_tileSet.height != 384){
            log("La hauteur du TileSet != 384");
            return;
        }
        this.tileSet = number;
        DRAWER.setTileSet(number);
        DRAWER.drawTileSet(this.object);
        DRAWER.drawGrid(this.object);
    }
    
    /**
     * Place les listeners des évènements souris
     */
    this.setMouseActions = function(){
        var _this = this;
        var coordsDown;
        var coordsUp;
        
        $(this.object).mousedown(function(e){
            coordsDown = _this.coordsToTile(_this.getRealCoords(e.pageX, e.pageY));
        });
        
        $(this.object).mouseup(function(e){
            coordsUp = _this.coordsToTile(_this.getRealCoords(e.pageX, e.pageY));
            _this.topLeftCoords.x = Math.min(coordsDown.x, coordsUp.x);
            _this.topLeftCoords.y = Math.min(coordsDown.y, coordsUp.y);
            _this.dCoords.x = Math.abs(coordsDown.x - coordsUp.x);
            _this.dCoords.y = Math.abs(coordsDown.y - coordsUp.y);
            if(MAP.currentLayer != -1)_this.drawSelectionRectangle();
        });
    }
    
    
    /**
     * Dessine le rectangle de selection sur le canvas
     */
    this.drawSelectionRectangle = function(){
        DRAWER.setTileSet(this.tileSet);
        DRAWER.drawWhite({x:1,y:1}, {x:10,y:12}, this.object);
        DRAWER.drawTileSet(this.object);
        DRAWER.drawGrid(this.object);
        DRAWER.drawSelectionRectangle(this.topLeftCoords, this.dCoords, this.object);
    }
    
    /**
     * Retourne le numéro de tile du Tileset à partir du TopLeftPoint et des dX, dY choisis
     * @param dX le décalage en x par rapport au TopLeftPoint
     * @param dY le décalage en y par rapport au topLeftPoint
     */
    this.getTileNumber = function(dX, dY){
        var tileX = this.topLeftCoords.x + dX;
        var tileY = this.topLeftCoords.y + dY;
        var number = (tileY-1)*10 + tileX;
        return number;
    }
    
    this.getRealCoords = function(pageX, pageY){
        var x = pageX - this.object.offsetLeft;
        var y = pageY - this.object.offsetTop;
        return {x:x, y:y};
    }
    
    this.coordsToTile = function(coords){
        var x = Math.floor(coords.x/32)+1;
        var y = Math.floor(coords.y/32)+1;
        return {x:x,y:y};
    }
}