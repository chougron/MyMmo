var Map = Class.extend(
{
    init : function()
    {
        this._id;
        this.author;
        this.title;
        this.width;
        this.height;
        this.tileSize = 32;
        this.tileSets = new Array();
        
        this.obstacles = new Array();
        this.tiles = new Array();
    },
    /**
     * Hydrate the Map with a given one
     * @param {Map} map
     * @returns {void}
     */
    hydrate : function(map)
    {
        this._id         = map._id;
        this.title       = map.title;
        this.author      = map.author;
        this.width       = map.width;
        this.height      = map.height;
        this.tileSize    = map.tileSize;
        this.tileSets    = map.tileSets;
        this.obstacles   = map.obstacles;
        this.tiles       = map.tiles;
    },
    /**
     * Draw the Map
     * @returns {void}
     */
    draw : function(drawer)
    {
        for(var layer=0; layer<this.tileSets.length; layer++)
        {
            for(var i=0; i<this.height * this.width; i++)
            {
                var value = this.tiles[layer][i];
                if(value != 0)
                {
                    var x = (i+1) % this.width;
                    if(x == 0)
                        x = this.width;
                    var y = Math.ceil((i+1) / this.width);
                    var coords = new Coords(x,y);
                    drawer.drawTile(coords,this.tileSets[layer],value);
                }
            }
        }
    },
    /**
     * Check if there is an obstacle at the given coords
     * @param {Coords} coords The coordinates to look
     * @returns {Boolean} Return false if there is no obstacle
     */
    checkObstacle : function(coords){
        var index = coords.toIndex(this.width, true);
        return this.obstacles[index];
    }
});