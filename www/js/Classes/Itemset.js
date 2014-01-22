var Itemset = ImageFile.extend({
    init : function()
    {
        this._super();
        this.type = "itemset";
    },
    hydrate : function(itemset)
    {
        this._super(itemset);
        this.type = "itemset";
    }
});