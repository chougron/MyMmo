var ImageFile = function(){
    this.img;       //DOM Object Image
    this.height;    //The height of one element in px
    this.width;     //The width of one element in px
    this.type;      //The type of the file (sprite/itemset/tileset)
    this.name;      //The name of the file
    this._id;       //The ID of the file in the DB
    
    /**
     * Hydrate an ImageFile from the DB
     * @param {ImageFile} dbImageFile An ImageFile from the DB
     * @returns {void}
     */
    this.hydrate = function(dbImageFile){
        this.img        = new Image();
        this.height     = dbImageFile.height;
        this.width      = dbImageFile.width;
        this.name       = dbImageFile.name;
        this._id        = dbImageFile._id;
    };
    
    /**
     * Update the ImageFile in the DB. It should already exists in.
     * @returns {Boolean}
     */
    this.save = function(){
        if(!this._id) return false;
        
        var message = {act : 'saveImageFile', data : this};
        var toSend = JSON.stringify(message);
        Socket.connection.send(toSend);
        return true;
    };
    
    /**
     * Remove the ImageFile from the DB. It should already exists in.
     * @returns {Boolean}
     */
    this.remove = function(){
        if(!this._id) return false;
        
        var message = {act : 'removeImageFile', id : this._id};
        var toSend = JSON.stringify(message);
        Socket.connection.send(toSend);
        return true;
    };
};