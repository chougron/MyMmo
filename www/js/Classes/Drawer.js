/**
 * The Drawer Object to draw in the Canvas
 * @returns {Drawer}
 */
var Drawer = function(){
    Drawer.tileSet;
    Drawer.numberWidth;
    
    Drawer.width = 32; //Size of a square tile, in px
    Drawer.height;
    
    /**
     * Set a new tileSet for the Drawer
     * @param {int} number The tileSet number in the FilesManager Array
     * @returns {void}
     */
    Drawer.setTileSet = function(number){ 
        Drawer.height = FilesManager.tilesets[number].height;
        Drawer.width = FilesManager.tilesets[number].width;
        
        Drawer.tileSet = FilesManager.tilesets[number].img;
        if(FilesManager.tilesets[number].img != undefined)
            Drawer.numberWidth = FilesManager.tilesets[number].img.width / Drawer.width;
    };
    
    /**
     * Draw a tile of the tileSet (the value one) in the context 
     * @param {int} x The abscissa (in tiles) of where to draw
     * @param {int} y The ordinate (in tiles) of where to draw
     * @param {int} value The tile value in the tileSet
     * @param {Canvas} canvas The canvas on which to draw
     * @returns {void}
     */
    Drawer.drawFromTileSet = function(x,y,value, canvas){
        var xSourceN = value % Drawer.numberWidth;
        if(xSourceN == 0) xSourceN = Drawer.numberWidth;
        var ySourceN = Math.ceil(value / Drawer.numberWidth);
        var xSource = (xSourceN - 1) * Drawer.width;
        var ySource = (ySourceN - 1) * Drawer.width;
        var xContext = (x - 1) * Drawer.width;
        var yContext = (y - 1) * Drawer.width;
        canvas.context.drawImage(Drawer.tileSet, xSource, ySource, Drawer.width, Drawer.width, xContext, yContext, Drawer.width, Drawer.width);
    };
    
    /**
     * Draw an animation in the context
     * @param {int} x The abscissa (in tiles) of where to draw
     * @param {int} y The ordinate (in tiles) of where to draw
     * @param {Image} image The animation sprite
     * @param {int} ligne The line of the sprite
     * @param {int} cpt The counter of the animation
     * @returns {void}
     */
    Drawer.drawAnimation = function(x,y,image,ligne,cpt){
        var xSource = cpt * Drawer.width;
        var ySource = ligne * Math.ceil(Drawer.width * 1.5);
        var xContext = (x - 1) * Drawer.width;
        var yContext = (y - 1) * Math.ceil(Drawer.width) - Math.ceil(Drawer.width * 0.5);
        
        Canvas.context.drawImage(image, xSource, ySource, Drawer.width, Math.ceil(Drawer.width * 1.5), xContext, yContext, Drawer.width, Math.ceil(Drawer.width * 1.5));
    };
    
    /**
     * Draw the whole tileSet on the given Canvas
     * @param {Canvas} canvas
     * @returns {void}
     */
    Drawer.drawTileSet = function(canvas){
        var width = this.tileSet.width;
        var height = this.tileSet.height;
        canvas.context.drawImage(this.tileSet, 0, 0, width, height, 0, 0, width, height);
    };
    
    /**
     * Draw a grid on the given Canvas
     * @param {Canvas} canvas
     * @returns {void}
     */
    Drawer.drawGrid = function(canvas){
        var context = canvas.context;

        var width = canvas.width;
        var height = canvas.height;
        context.beginPath();
        context.lineWidth = 1;
        context.strokeStyle = "#000";

        for(var x=32; x<canvas.width; x+=32){
            context.moveTo(x,0);
            context.lineTo(x,height);
        }
        for(var y=32; y<canvas.height; y+=32){
            context.moveTo(0,y);
            context.lineTo(width,y);
        }
        context.stroke();
    };
    
    /**
     * Draw a selection rectangle on the given Canvas
     * @param {Coords} topLeftPoint The start coords (in tiles)
     * @param {Coords} dCoords The delta Coords (selection length)
     * @param {Canvas} canvas The Canvas
     * @returns {void}
     */
    Drawer.drawSelectionRectangle = function(topLeftPoint, dCoords, canvas){
        var context = canvas.context;
        var x = (topLeftPoint.x - 1) * 32;
        var y = (topLeftPoint.y - 1) * 32;
        var dx = (dCoords.x * 32) + 32;
        var dy = (dCoords.y * 32) + 32;
        
        context.beginPath();
        context.lineWidth = 3;
        context.strokeStyle = "#f00";
        //Ligne du haut
        context.moveTo(x,y);
        context.lineTo(x+dx,y);
        //Ligne de droite
        context.lineTo(x+dx,y+dy);
        //Ligne du bas
        context.lineTo(x,y+dy);
        //Ligne de gauche
        context.lineTo(x,y);
        context.stroke();
    };
    
    /**
     * Draw a white background on the given Canvas
     * @param {Coords} topLeftPoint The start coords (in tiles)
     * @param {Coords} dCoords The delta Coords
     * @param {Canvas} canvas The canvas
     * @returns {void}
     */
    Drawer.drawWhite = function(topLeftPoint, dCoords, canvas){
        var context = canvas.context;
        var x = (topLeftPoint.x - 1) * 32;
        var y = (topLeftPoint.y - 1) * 32;
        var dx = (dCoords.x * 32) + 32;
        var dy = (dCoords.y * 32) + 32;
        
        context.fillStyle = "#fff";
        context.fillRect(x,y,dx,dy);  
    };
    
    /**
     * Draw a little red square to indicate an obstacle
     * @param {int} x The absissa (in tiles)
     * @param {int} y The ordinate (in tiles)
     * @param {Canvas} canvas The Canvas
     * @returns {void}
     */
    Drawer.drawObstacle = function(x, y, canvas){
        var context = canvas.context;
        var xContext = (x - 1) * 32;
        var yContext = (y - 1) * 32;
        context.fillStyle = "rgba(255,0,0,0.3)";
        context.fillRect(xContext, yContext, 32, 32);
    };
    
    /**
     * Draw a light Background so the under layers are less visibles
     * @param {int} x The abscissa (in tiles)
     * @param {int} y The ordinate (in tiles)
     * @param {Canvas} canvas The canvas
     * @returns {void}
     */
    Drawer.lightBackground = function(x, y, canvas){
        var context = canvas.context;
        var xContext = (x - 1) * 32;
        var yContext = (y - 1) * 32;
        context.fillStyle = "rgba(255,255,255,0.5)";
        context.fillRect(xContext, yContext, 32, 32);
    };
};