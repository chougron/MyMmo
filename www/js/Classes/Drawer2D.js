var Drawer2D = Drawer.extend(
{
    init : function(canvas)
    {
        this._super(canvas);
        this.context = canvas.getContext("2d");
    },
    /**
     * Draw an animation at the given coordinates
     * @param {Coord} coords The Coodinates where to draw
     * @param {_id} sprite The sprite id
     * @param {ACTION} action The current action of the animation
     * @param {DIRECTION} direction The current direction of the animation
     * @param {int} tickAnimation The current tick of the animation
     * @returns {void}
     */
    drawAnimation : function(coords, sprite, action, direction, tickAnimation)
    {
        var _sprite = GameEngineInstance.imageFileManager.sprites[sprite];
        var xSource = tickAnimation * _sprite.width;
        var ySource = (direction*3 + action) * _sprite.height;
        
        var tileSize = GameEngineInstance.map.tileSize;
        var width = _sprite.width;
        var height = _sprite.height;
        var xContext = (coords.x - 1) * tileSize
                        + Math.round(tileSize/2)
                        - Math.round(_sprite.width/2);
        if(xContext < 0)
        {
            xSource += xContext;
            width += xContext;
            xContext = 0;
        }
        var yContext = coords.y * tileSize - _sprite.height;
        if(yContext < 0)
        {
            ySource += yContext;
            height += yContext;
            yContext = 0;
        }
        this.context.drawImage(_sprite.img, xSource, ySource, width, height, xContext, yContext, width, height);
    },
    /**
     * Draw an item at the given coordinates
     * @param {Coords} coords
     * @param {_id} itemset The itemset id
     * @param {int} setNumber The number of the item in the set
     * @returns {void}
     */
    drawItem : function(coords, itemset, setNumber)
    {
        var itemSet = GameEngineInstance.itemsets[itemset];
        var width = itemSet.width;
        var height = itemSet.height;
        var imageWidth = itemSet.img.width;
        var lineNumber = imageWidth / width; //Number of elements in one line
        var x = setNumber % lineNumber;
        //This is the position of the image in the Tile
        var xpx = x * width; 
        var ypx = (this.setNumber - x) / lineNumber * height;
    },
    /**
     * Draw a tile of the tileSet (the value one) in the context 
     * @param {Coords} coords The coords of where to draw
     * @param {_id} tileset The id of the tileset
     * @param {int} setNumber The number of the tile in the tileset
     * @returns {void}
     */
    drawTile : function(coords, tileset, setNumber)
    {
        var _tileset = GameEngineInstance.imageFileManager.tilesets[tileset];
        
        var numberWidth = Math.round(_tileset.img.width / _tileset.width);
        var xSourceN = setNumber % numberWidth;
        if(xSourceN == 0) xSourceN = numberWidth;
        var ySourceN = Math.ceil(setNumber / numberWidth);
        var width = _tileset.width;
        var height = _tileset.height;
        var xSource = (xSourceN - 1) * width;
        var ySource = (ySourceN - 1) * height;
        var xContext = (coords.x - 1) * width;
        var yContext = (coords.y - 1) * height;
        this.context.drawImage(_tileset.img, xSource, ySource, width, height, xContext, yContext, width, height);
    },
    clear : function()
    {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
});