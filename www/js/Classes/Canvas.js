/**
 * A Canvas Object
 * @param {DOM Canvas} canvasDomObject
 * @returns {Canvas}
 */
var Canvas = function(canvasDomObject){
    Canvas.object = canvasDomObject;
    Canvas.context = canvasDomObject.getContext("2d");
    
    Canvas.width = 640;
    Canvas.height = 480;
    
    Canvas.tileNumber = 0;
    Canvas.spriteNumber = 0;
    
    Canvas.tileSets = new Array();
    Canvas.sprites = new Array();
    
    Canvas.map;
    
    /**
     * Init the Dom Object to the right size, and put the number of tileSet and
     * Sprite to load
     * @param {String[]} tileSetArray Array of tileSets names
     * @param {String[]} spriteArray Array of sprites names
     * @returns {void}
     */
    Canvas.init = function(tileSetArray, spriteArray){
        Canvas.object.width = Canvas.width;
        Canvas.object.height = Canvas.height;
        var i=0;
        var tileSet = true;
        Canvas.tileNumber = tileSetArray.length;
        tileSet = tileSetArray.shift();
        while(tileSet){
            Canvas.tileSets[i] = Canvas._loadTileSet(tileSet);
            i++;
            tileSet = tileSetArray.shift();
        }
        i=0;
        var sprite = true;
        Canvas.spriteNumber = spriteArray.length;
        sprite = spriteArray.shift();
        while(sprite){
            Canvas.sprites[i] = Canvas._loadSprite(sprite);
            i++;
            sprite = spriteArray.shift();
        }
    };
    
    /**
     * Load a tileSet in memory, then check if there are others things to load
     * @param {String} name The tileSet name
     * @returns {Image} The image of the tileSet
     */
    Canvas._loadTileSet = function(name){
        var path = "img/tilesets/"+name+".png";
        var tileSet = new Image();
        tileSet.src = path;
        console.log("Loading Tileset : "+name);
        tileSet.onload = function(){
            console.log("Tileset loaded.");
            Canvas.tileNumber-=1;
            Canvas.checkReady();
        };
        return tileSet;
    };
    
    /**
     * Load a sprite in memory, then check if there are others things to load
     * @param {String} name The sprite name
     * @returns {Image} The image of the sprite
     */
    Canvas._loadSprite = function(name){
        var path = "img/sprites/"+name+".png";
        var sprite = new Image();
        sprite.src = path;
        console.log("Loading Sprite : "+name);
        sprite.onload = function(){
            console.log("Sprite loaded.");
            Canvas.spriteNumber-=1;
            Canvas.checkReady();
        };
        return sprite;
    };
    
    /**
     * Check if evertything is loaded.
     * @returns {Boolean}
     */
    Canvas.checkReady = function(){
        if(Canvas.tileNumber == 0 && Canvas.spriteNumber == 0){
            console.log("All TileSet & Sprite loaded");
            
            //For the editor only
            if(typeof Editor != "undefined")
                Editor.ready();
            
            return true;
        }
        else
            return false;
    };
};