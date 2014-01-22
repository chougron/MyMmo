var Item = Thing.extend(
{
    init : function()
    {
        this.onMap; //Is the item displayed on map ?
        this.itemSet = ''; //The itemset ID it is in
        this.setNumber; //The number of the item in the itemset
        this._id; //The item ID (DB ID)
        this.name = '';
    },
    /**
     * Hydrate the Object with another item
     * @param {Item} item
     * @returns {void}
     */
    hydrate : function(item)
    {
        this._id = item._id;
        this.name = item.name;
        this.itemSet = item.itemSet;
        this.setNumber = item.setNumber;
    },
    /**
     * Draw the Item at its coordinates
     */
    draw : function()
    {
        GameEngineInstance.drawerThings.drawItem(this.coords, this.itemSet, this.setNumber);
    }
});