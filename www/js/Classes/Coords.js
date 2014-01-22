var Coords = Class.extend(
{
    init : function(x,y)
    {
        this.x = x;
        this.y = y;
    },
    /**
     * Hydrate the Coords with another Coords
     * @param {Coords} coords
     * @returns {void}
     */
    hydrate : function(coords){
        this.x = coords.x;
        this.y = coords.y;
    },
    /**
     * Return the distance between two coordinates
     * @param {Coords} coords The Coords to compare
     * @returns {int} The distance
     */
    distance : function(coords){
        var dx = Math.abs(this.x - coords.x);
        var dy = Math.abs(this.y - coords.y);
        return dx+dy;
    },
    /**
     * Check if the Coords are the same as the one given
     * @param {Coords} coords
     * @returns {Boolean} Return true if it's the same Coords
     */
    equals : function(coords){
        return (this.x == coords.x) && (this.y == coords.y);
    },
    
    /**
     * Transform the coordinate to a map index
     * @param {int} mapWidth The map width (in tiles)
     * @param {Boolean} floor round to floor or ceil
     * @returns {int} The index of the tile in the Map
     */
    toIndex : function(mapWidth, floor){
        if(floor)
            return mapWidth * Math.floor(this.y - 1) + Math.floor(this.x) - 1;
        else
            return mapWidth * Math.ceil(this.y - 1) + Math.ceil(this.x) - 1;
    },
    /**
     * Return a new Coords Object, transformed into px
     * @param {int} mapWidth The width of a tile of the map
     * @returns {Coords} The new Coords
     */
    toPx : function(mapWidth){
        return new Coords(this.x * mapWidth, this.y * mapWidth);
    }
});