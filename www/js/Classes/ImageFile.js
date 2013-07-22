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
};