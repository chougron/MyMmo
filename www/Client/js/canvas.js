var Canvas = function(objectCanvas){
    
    this.object = objectCanvas;
    this.width = 640;
    this.height = 480;
    this.tileNumber = 0;
    this.spriteNumber = 0;
    this.tileSets = new Array();
    this.sprites = new Array();
    this.map;
    
    /**
     * Initialise la Map aux bonnes dimensions, et renseigne le nombre de tileSet à charger
     * @param tileSetArray tableau de chemins d'accès aux tileSets
     * @param spriteArray tableau de chemins d'accès aux sprites
     */
    this.init = function(tileSetArray, spriteArray){
        this.object.width = this.width;
        this.object.height = this.height;
        var i=0;
        var tileSet = true;
        this.tileNumber = tileSetArray.length;
        tileSet = tileSetArray.shift();
        while(tileSet){
            this.tileSets[i] = this._loadTileSet(tileSet);
            i++;
            tileSet = tileSetArray.shift();
        }
        i=0;
        var sprite = true;
        this.spriteNumber = spriteArray.length;
        sprite = spriteArray.shift();
        while(sprite){
            this.sprites[i] = this._loadSprite(sprite, i);
            i++;
            sprite = spriteArray.shift();
        }
    }
    
    /**
     * Charge un tileSet en mémoire, et vérifie s'il en reste à charger
     * @param path chemin d'accès au tileSet 
     * @return le tileSet chargé
     */
    this._loadTileSet = function(path){
        var tileSet = new Image();
        tileSet.src = path;
        log("Loading Tileset : "+path);
        tileSet.onload = function(){
            log("Tileset loaded.");
            CANVAS.tileNumber-=1;
            CANVAS.checkReady();
        }
        return tileSet;
    }
    
    /**
     * Charge un Sprite en mémoire, et vérifie s'il en reste à charger
     * @param name chemin d'accès au sprite 
     * @param i le numéro du sprite
     * @return le sprite chargé
     */
    this._loadSprite = function(name, i){
        var path = "Shared/img/sprites/"+name+".png";
        var sprite = new Image();
        sprite.src = path;
        sprite.onload = function(){
            log("Sprite loaded.");
            CANVAS.spriteNumber-=1;
            CANVAS.checkReady();
        }
        return sprite;
    }
    
    /**
     * Vérifie s'il reste des tileSet ou sprite à charger
     */
    this.checkReady = function(){
        if(this.tileNumber == 0 && this.spriteNumber == 0){
            log("All TileSet & Sprite loaded");
            this.ready();
            return true;
        }
        else return false;
    }
    
    this.ready = function(){
        MAP = new Map();
    }
}