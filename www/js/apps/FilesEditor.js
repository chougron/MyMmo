var FilesEditor = function(){
    
    /**
     * The initial function to launch the file Editor
     * @returns {void}
     */
    FilesEditor.launch = function(){
        FilesManager();
        FilesManager.getFromDB();
    };
        
    /**
     * The function launched when all the files to load are loaded
     * @returns {void}
     */
    FilesEditor.ready = function(){    
        var list_sprite = $("#list_sprite").get(0);
        var list_itemset = $("#list_itemset").get(0);
        var list_tileset = $("#list_tileset").get(0);
        
        for(var index in FilesManager.sprites){
            var sprite = FilesManager.sprites[index];
            var templi = document.createElement('li');
            templi.innerHTML = sprite.name;
            templi.id = sprite.type + "_" + sprite.name;
            $(templi).click(function(){
                FilesEditor.preview(this.id);
            });
            list_sprite.appendChild(templi);
        }
        
        for(var index in FilesManager.itemsets){
            var itemset = FilesManager.itemsets[index];
            var templi = document.createElement('li');
            templi.innerHTML = itemset.name;
            templi.id = itemset.type + "_" + itemset.name;
            $(templi).click(function(){
                FilesEditor.preview(this.id);
            });
            list_itemset.appendChild(templi);
        }
        
        for(var index in FilesManager.tilesets){
            var tileset = FilesManager.tilesets[index];
            var templi = document.createElement('li');
            templi.innerHTML = tileset.name;
            templi.id = tileset.type + "_" + tileset.name;
            $(templi).click(function(){
                FilesEditor.preview(this.id);
            });
            list_tileset.appendChild(templi);
        }
    };
    
    /**
     * Preview the file clicked
     * @param {String} id The id of the li element calling the function
     * @returns {void}
     */
    FilesEditor.preview = function(id){
        var splits = id.split('_');
        var type = splits[0];
        var name = splits[1];
        for(var i=2;i<splits.length;i++){ //If the name contains a "_"
            name += "_" + splits[i];
        }
        
        var preview = $("#preview").get(0);
        preview.src = 'img/'+type+"s/"+name;
    };
};

$(document).ready(function(){
    Socket();
    FilesEditor();
    FilesEditor.launch();
});