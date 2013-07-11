var tileSets = new Array();
var sprites = new Array();
var INIT;
var MAP;
var TILESET;
var DRAWER;
var SELECT;
var CONNECTION;

var Init = function(){
    this.loaded = 0;
    this.toLoad = 0;
    
    this.launch = function(){
        startSocket();
        
        DRAWER = new Drawer();
        
        MAP = new Map();
        MAP.init();
        
        TILESET = new TileSet();
        TILESET.init();
        
        
        SELECT = new Select();
        
        var tileSetArray = this.getTileSetArray();
        var spriteArray = this.getSpriteArray();
        
        this.toLoad = tileSetArray.length + spriteArray.length;
        
        var i=0;
        tileSet = tileSetArray.shift();
        while(tileSet){
            tileSets[i] = this._loadTileSet(tileSet);
            i++;
            tileSet = tileSetArray.shift();
        }
        i=0;
        var sprite = true;
        sprite = spriteArray.shift();
        while(sprite){
            sprites[i] = this._loadSprite(sprite, i);
            i++;
            sprite = spriteArray.shift();
        }
    }
    
    /**
     * Retourne le tableau de tous les TileSets utilisés
     */
    this.getTileSetArray = function(){
        var array = [
            "www/Shared/img/plaines.png", //0
            "www/Shared/img/plaines_objets.png", //1
            "www/Shared/img/murs.png", //2
            "www/Shared/img/mobilier.png" //3
        ];
        return array;
    }
    
    /**
     * Retourne un tableau de tous les sprites utilisés
     */
    this.getSpriteArray = function(){
        var array = [
            "foxPNG" //0
        ]; 
        return array;
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
        
        var _this = this;
        
        tileSet.onload = function(){
            log("Tileset loaded.");
            _this.loaded += 1;
            _this.checkReady();
        }
        return tileSet;
    }
    
    /**
     * Charge un Sprite en mémoire, et vérifie s'il en reste à charger
     * @param path chemin d'accès au sprite 
     * @return le sprite chargé
     */
    this._loadSprite = function(name, i){
        var path = "www/Shared/img/sprites/"+name+".png";
        var sprite = new Sprite(name);
        var spriteImg = new Image();
        spriteImg.src = path;
        log("Loading Sprite : "+path);
        
        var _this = this;
        
        spriteImg.onload = function(){
            log("Sprite loaded.");
            _this.loaded += 1;
            _this.checkReady();
        }
        sprite.setImage(spriteImg);
        sprite.setLength(i);
        return sprite;
    }
    
    /**
     * Vérifie s'il reste des tileSet ou sprite à charger
     */
    this.checkReady = function(){
        if(this.loaded == this.toLoad){
            log("All TileSet & Sprite loaded");
            this.ready();
        }
    }
    
    this.ready = function(){
        SELECT.init();
        TILESET.loadTileSet(0);
        DRAWER.drawGrid(TILESET.object);
    }
}

var startSocket = function(){
    window.WebSocket = window.WebSocket || window.MozWebSocket;
    if (!window.WebSocket) alert("votre navigateur ne supporte pas les sockets");
    
    CONNECTION = new WebSocket('ws://localhost:8080'); //Here put the Node.JS server
    CONNECTION.onopen = function(){
        log("WS connection opened");
    }
}