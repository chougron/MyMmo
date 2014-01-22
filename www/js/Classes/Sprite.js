var Sprite = ImageFile.extend({
    init : function()
    {
        this._super();
        this.lengths = {};
        this.type = "sprite";
    },
    hydrate : function(sprite)
    {
        this._super(sprite);
        this.lengths = sprite.lengths;
        this.type = "sprite";
    }
});