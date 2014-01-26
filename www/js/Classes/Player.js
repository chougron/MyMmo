var Player = Thing.extend(
{
    init : function()
    {
        this._super();
        this._id;
        this.name = '';
        this.animation = new Animation();
        this.isMoving = false;
        this.map;
    },
    /**
     * Hydrate the Player with another Player
     * @param {Player} player
     * @returns {void}
     */
    hydrate : function(player)
    {
        this._super(player);
        this._id = player._id;
        this.name = player.name;
        this.map = player.map;
        this.animation.hydrate(player.animation);
    },
    /**
     * Draw the player where he is
     * @returns {void}
     */
    draw : function(drawer)
    {
        if(this.map != GameEngineInstance.map._id)
            return;
        this.animation.draw(this.coords,drawer);
    },
    /**
     * Make the Player move if he is not currently moving
     * @param {DIRECTION} direction The movement direction
     * @returns {void}
     */
    move : function(direction){
        if(this.isMoving)return;
        
        this.animation.setDirection(direction);
        
        if(!this.canMove(direction)) return;
        
        this.isMoving = true;
        this.animation.setAction(ACTION.WALK);
        this.doMove(direction);
    },
    /**
     * Animate a movement in 10 steps
     * @param {DIRECTION} direction The movement direction
     * @returns {void}
     */
    doMove : function(direction)
    {
        switch(direction)
        {
            case DIRECTION.UP:
                this.coords.y -= 0.1;
                break;
            case DIRECTION.DOWN:
                this.coords.y += 0.1;
                break;
            case DIRECTION.LEFT:
                this.coords.x -= 0.1;
                break;
            case DIRECTION.RIGHT:
                this.coords.x += 0.1;
                break;
        }
        if((Math.round(this.coords.x*10))%10 == 0 && (Math.round(this.coords.y*10))%10 == 0)
        {
            this.coords.x = Math.round(this.coords.x);
            this.coords.y = Math.round(this.coords.y);
            this.isMoving = false;
            this.animation.setAction(ACTION.STAND);
        }
        if(this.isMoving)
        {
            setTimeout(function(thisObj){thisObj.doMove(direction)},50,this);
        }
    },
    /**
     * Check if a player can move in the given direction
     * @param {int} direction The movement direction
     * @returns {Boolean} Return true if the player can move
     */
    canMove : function(direction)
    {
        var newCoords
        switch(direction)
        {
            case DIRECTION.UP:
                newCoords = new Coords(this.coords.x, this.coords.y-1);
                if(this.coords.y == 1) 
                        return false;
                break;
            case DIRECTION.DOWN:
                newCoords = new Coords(this.coords.x, this.coords.y+1);
                if(this.coords.y == GameEngineInstance.map.height)
                        return false;
                break;
            case DIRECTION.LEFT:
                newCoords = new Coords(this.coords.x-1, this.coords.y);
                if(this.coords.x == 1)
                        return false;
                break;
            case DIRECTION.RIGHT:
                newCoords = new Coords(this.coords.x+1, this.coords.y);
                if(this.coords.x == GameEngineInstance.map.width)
                        return false;
                break;
            default :
                return false;
        }
        
        return (!GameEngineInstance.map.checkObstacle(newCoords) &&
                !GameEngineInstance.thingManager.obstacle(newCoords));
    },
    /**
     * Return the distance between the player and another one
     * @param {Player} player The Player to compare
     * @returns {int} The distance between the players
     */
    distance : function(player){
        return this.coords.distance(player.coords);
    }
});