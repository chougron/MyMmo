/**
 * A Coordinates class
 * @param {int} x
 * @param {int} y
 * @returns {Coords}
 */
var Coords = function(x,y){
    this.x = x;
    this.y = y;
    
    /**
     * Transform the coordinate to a map index
     * @param {int} mapWidth The map width
     * @param {Boolean} floor round to floor or ceil
     * @returns {int} The index of the tile in the Map
     */
    this.toIndex = function(mapWidth, floor){
        if(floor)
            return mapWidth * Math.floor(this.y - 1) + Math.floor(this.x) - 1;
        else
            return mapWidth * Math.ceil(this.y - 1) + Math.ceil(this.x) - 1;
    };
    
    /**
     * Transform the coordinate of the tile above to a map index
     * @param {int} mapWidth The map width
     * @param {Boolean} floor round to floor or ceil
     * @returns {int} The index of the above tile in the Map
     */
    this.toIndexUp = function(mapWidth, floor){
        if(floor)
            return mapWidth * Math.floor(this.y - 2) + Math.floor(this.x) - 1;
        else
            return mapWidth * Math.ceil(this.y - 2) + Math.ceil(this.x) - 1;
    };
    
    /**
     * Check if the Coords are the same as the one given
     * @param {Coords} coords
     * @returns {Boolean} Return true if it's the same Coords
     */
    this.equals = function(coords){
        return (this.x == coords.x) && (this.y == coords.y);
    };
    
    /**
     * Return the distance between two coordinates
     * @param {Coords} coords The Coords to compare
     * @returns {int} The distance
     */
    this.distance = function(coords){
        var dx = Math.abs(this.x - coords.x);
        var dy = Math.abs(this.y - coords.y);
        return dx+dy;
    };
    
    /**
     * Transform px Coords to tile Coords
     * @param {Coords} coords The px coords
     * @param {int} tileSize The tile square size (in px)
     * @returns {Coords} The tile Coords
     */
    this.pxToTile = function(coords, tileSize){
        var x = Math.floor(coords.x/tileSize)+1;
        var y = Math.floor(coords.y/tileSize)+1;
        return new Coords(x,y);
    };
};


/**
 * Get the coordinate from inside an element instead of page
 * @param {int} pageX The click X
 * @param {int} pageY The click Y
 * @param {Dom Object} object The Dom Object
 * @returns {Coords} The real Coordinates
 */
function getRealCoords(pageX, pageY, object){
    var x = pageX - object.offsetLeft;
    var y = pageY - object.offsetTop;
    return new Coords(x,y);
}