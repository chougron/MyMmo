var Item = function(){
    Thing.call(this);
    
    this.onMap; //Is the item displayed on map ?
    this.itemSet = ''; //The itemset ID it is in
    this.setNumber; //The number of the item in the itemset
    this._id; //The item ID (DB ID)
    this.name = '';
    
    this.save = function(){
        var object = {
            itemSet     :   this.itemSet,
            setNumber   :   this.setNumber,
            name        :   this.name,
            _id         :   this._id
        };
        var message = {act:'saveItem',item:object};
        var toSend = JSON.stringify(message);
        Socket.connection.send(toSend);
    };
    
    /**
     * Hydrate the Object with another item
     * @param {Item} item
     * @returns {void}
     */
    this.hydrate = function(item){
        this._id = item._id;
        this.name = item.name;
        this.itemSet = item.itemSet;
        this.setNumber = item.setNumber;
    };
    
    /**
     * Get the px Coordinates of the Item in the Itemset
     * @returns {Coords}
     */
    this.getCoordsInTile = function(){
        var itemSet = FilesManager.itemsets[this.itemSet];
        var width = itemSet.width;
        var height = itemSet.height;
        var imageWidth = itemSet.img.width;
        var lineNumber = imageWidth / width; //Number of elements in one line
        var x = this.setNumber % lineNumber;
        var xpx = x * width; //The x position of the image in the Tile
        var ypx = (this.setNumber - x) / lineNumber * height;
        return new Coords(xpx,ypx);
    };
};