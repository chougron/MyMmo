var FilesEditor = function(){
    
    FilesEditor.currentFile;
    
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
        var list_sprite = $("#list_sprite");
        list_sprite.empty();
        var list_itemset = $("#list_itemset");
        list_itemset.empty();
        var list_tileset = $("#list_tileset");
        list_tileset.empty();
        
        for(var index in FilesManager.sprites){
            var sprite = FilesManager.sprites[index];
            var templi = document.createElement('li');
            templi.innerHTML = sprite.name;
            templi.id = sprite.type + "_" + sprite._id;
            $(templi).click(function(){
                FilesEditor.preview(this.id);
            });
            list_sprite.append(templi);
        }
        
        for(var index in FilesManager.itemsets){
            var itemset = FilesManager.itemsets[index];
            var templi = document.createElement('li');
            templi.innerHTML = itemset.name;
            templi.id = itemset.type + "_" + itemset._id;
            $(templi).click(function(){
                FilesEditor.preview(this.id);
            });
            list_itemset.append(templi);
        }
        
        for(var index in FilesManager.tilesets){
            var tileset = FilesManager.tilesets[index];
            var templi = document.createElement('li');
            templi.innerHTML = tileset.name;
            templi.id = tileset.type + "_" + tileset._id;
            $(templi).click(function(){
                FilesEditor.preview(this.id);
            });
            list_tileset.append(templi);
        }
        $("#list").accordion("refresh");
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
        
        eval ("FilesEditor.currentFile = FilesManager."+type+"s['"+name+"'];");
        
        var preview = $("#preview").get(0);
        preview.src = FilesEditor.currentFile.img.src;
        
        $("#opt_width").val(FilesEditor.currentFile.width);
        $("#opt_height").val(FilesEditor.currentFile.height);
    };
    
    /**
     * Check if new files are in the folders.
     * @returns {void}
     */
    FilesEditor.checkNewFiles = function(){
        
        $("#preview").get(0).src = '';
        $("#opt_width").val('');
        $("#opt_height").val('');
        FilesEditor.currentFile = '';
        
        var message = {act:'checkNewFiles'};
        var toSend = JSON.stringify(message);
        Socket.connection.send(toSend);
    };
    
    /**
     * Change the values of the size of the current file, and save them in the DB.
     * @returns {Boolean} Always return false, so the form doesn't submit.
     */
    FilesEditor.changeValue = function(){
        if(!FilesEditor.currentFile)
            return false;
        FilesEditor.currentFile.width = $("#opt_width").val();
        FilesEditor.currentFile.height = $("#opt_height").val();
        
        FilesEditor.currentFile.save();
        return false;
    };
};

$(document).ready(function(){
    $("#list").accordion();
    Socket();
    FilesEditor();
    FilesEditor.launch();
    $("#refresh_list").click(function(){
        console.log("coucou");
        FilesEditor.checkNewFiles();
    });
    $("#opt_form").submit(function(){
        return FilesEditor.changeValue();
    });
});