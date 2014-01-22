var ImageFile = Class.extend({
    init : function()
    {
        this.img;       //DOM Object Image
        this.height;    //The height of one element in px
        this.width;     //The width of one element in px
        this.type;      //The type of the file (sprite/itemset/tileset)
        this.name;      //The name of the file
        this._id;       //The ID of the file in the DB
    },
    hydrate : function(imageFile)
    {
        this.img        = imageFile.img;
        this.height     = imageFile.height;
        this.width      = imageFile.width;
        this.type       = imageFile.type;
        this.name       = imageFile.name;
        this._id        = imageFile._id;
    },
    loadImage : function(path, onLoaded)
    {
        this.img = new Image();
        this.img.src = path;
        this.img.onload = onLoaded;
    }
});