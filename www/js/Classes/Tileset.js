var Tileset = ImageFile.extend({
    init : function()
    {
        this._super();
        this.type = "tileset";
    },
    hydrate : function(tileset)
    {
        this._super(tileset);
        this.type = "tileset";
    }
});