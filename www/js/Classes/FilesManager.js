var FilesManager = function(){
    FilesManager.sprites = new Array();
    //TODO: Change this to a object array with the _id and the Files
    FilesManager.tilesets = {};
    //TODO: Change this to a object array with the _id and the Files
    FilesManager.itemsets = new Array();
    //TODO: Change this to a object array with the _id and the Files
    
    FilesManager.toLoad = -1;
    
    /**
     * Ask the server for the files to load
     * @returns {void}
     */
    FilesManager.getFromDB = function(){
        var message = {act:'getFiles'};
        var toSend = JSON.stringify(message);
        Socket.connection.send(toSend);
    };
    
    /**
     * The function called when the server answer
     * @param {Array} files The files to load
     * @returns {void}
     */
    FilesManager.doGetFromDB = function(files){
        FilesManager.load(files.sprites,files.tilesets,files.itemsets);
    };
    
    /**
     * Load the different image files, and check if all are loaded.
     * @param {Array} sprites The array of sprites objects, format : {name,width,height}
     * @param {Array} tilesets The array of tilesets objects, format : {name,width,height}
     * @param {Array} itemsets The array of itemsets objects, format : {name,width,height}
     * @returns {void}
     */
    FilesManager.load = function(sprites,tilesets,itemsets){
        if(FilesManager.toLoad == -1) FilesManager.toLoad++;
        FilesManager.toLoad += sprites.length + tilesets.length + itemsets.length;
        //Load the sprites
        var sprite = sprites.shift();
        while(sprite){
            var path = "img/sprites/"+sprite.name;
            
            var tempSprite      = new ImageFile();
            tempSprite.hydrate(sprite);
            tempSprite.img.src  = path;
            tempSprite.type     = 'sprite';
            console.log("Loading sprite : "+sprite.name);
            
            tempSprite.img.onload = function(){
                console.log("Sprite loaded.");
                FilesManager.toLoad--;
                FilesManager.checkReady();
            };
            
            var index = FilesManager.sprites.push(tempSprite) - 1;
            FilesManager.sprites[index].index = index;
            
            delete tempSprite;
            sprite = sprites.shift();
        }
        //Load the tilesets
        var tileSet = tilesets.shift();
        while(tileSet){
            var path = "img/tilesets/"+tileSet.name;
            
            var tempTileset     = new ImageFile();
            tempTileset.hydrate(tileSet);
            tempTileset.img.src = path;
            tempTileset.type    = 'tileset';
            console.log("Loading tileSet : "+tileSet.name);
            
            tempTileset.img.onload = function(){
                console.log("TileSet loaded.");
                FilesManager.toLoad--;
                FilesManager.checkReady();
            };
            
            FilesManager.tilesets[tempTileset._id] = tempTileset;
            
            delete tempTileset;
            tileSet = tilesets.shift();
        }
        //Load the itemsets
        var itemset = itemsets.shift();
        while(itemset){
            var path = "img/itemsets/"+itemset.name;
            
            var tempItemset     = new ImageFile();
            tempItemset.hydrate(itemset);
            tempItemset.img.src = path;
            tempItemset.type    = 'itemset';
            console.log("Loading itemSet : "+itemset.name);
            
            tempItemset.img.onload = function(){
                console.log("ItemSet loaded.");
                FilesManager.toLoad--;
                FilesManager.checkReady();
            };
            
            var index = FilesManager.itemsets.push(tempItemset) - 1;
            FilesManager.itemsets[index].index = index;
            
            delete tempItemset;
            itemset = itemsets.shift();
        }
    };
    
    /**
     * The function launched after everything is loaded
     * @returns {Boolean} True if everything loaded
     */
    FilesManager.checkReady = function(){
        if(FilesManager.toLoad != 0)
            return false;
        
        if(typeof FilesEditor != "undefined")
                FilesEditor.ready();
        
        console.log("Everything loaded.");
        return true;
    };
};