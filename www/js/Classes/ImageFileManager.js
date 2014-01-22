var ImageFileManager = Class.extend(
{
    init : function()
    {
        this._spritePath = "img/sprites/";
        this._itemsetPath = "img/itemsets/";
        this._tilesetPath = "img/tilesets/";
        
        this.sprites = {};
        this.tilesets = {};
        this.itemsets = {};
        
        this.onLoaded = function(){};

        this._toLoad = 0;
    },
    /**
     * Load the different image files and check if all are loaded
     * @param {Array<string>} sprites
     * @param {Array<string>} tilesets
     * @param {Array<string>} itemsets
     * @param {function} onLoaded
     * @returns {void}
     */
    load : function(sprites, tilesets, itemsets, onLoaded)
    {
        this.onLoaded = onLoaded;
        
        this._toLoad += sprites.length + tilesets.length + itemsets.length;
        
        var sprite = sprites.shift();
        while(sprite)
        {
            var path = this._spritePath + sprite.name;
            
            var temp = new Sprite();
            temp.hydrate(sprite);
            var onLoaded = function(){
                console.log("Sprite loaded.")
                GameEngineInstance.imageFileManager._toLoad--;
                GameEngineInstance.imageFileManager.checkReady();
            };
            temp.loadImage(path, onLoaded);
            
            this.sprites[temp._id] = temp;
            delete temp;
            
            sprite = sprites.shift();
        }
        
        var tileSet = tilesets.shift();
        while(tileSet)
        {
            var path = this._tilesetPath + tileSet.name;
            
            var temp = new Tileset();
            temp.hydrate(tileSet);
            var onLoaded = function(){
                console.log("Tileset loaded.")
                GameEngineInstance.imageFileManager._toLoad--;
                GameEngineInstance.imageFileManager.checkReady();
            };
            temp.loadImage(path, onLoaded);
            
            this.tilesets[temp._id] = temp;
            delete temp;
            
            tileSet = tilesets.shift();
        }
        
        var itemset = itemsets.shift();
        while(itemset)
        {
            var path = this._itemsetPath + itemset.name;
            
            var temp = new Itemset();
            temp.hydrate(itemset);
            var onLoaded = function(){
                console.log("Itemset loaded.")
                GameEngineInstance.imageFileManager._toLoad--;
                GameEngineInstance.imageFileManager.checkReady();
            };
            temp.loadImage(path, onLoaded);
            
            this.itemsets[temp._id] = temp;
            delete temp;
            
            itemset = itemsets.shift();
        }
    },
    /**
     * Check if everything is loaded
     * If it's the case, launch the onLoaded function
     */
    checkReady : function()
    {
        if(this._toLoad != 0)
            return;
        console.log("All imagefiles loaded.");
        this.onLoaded();
    }
});