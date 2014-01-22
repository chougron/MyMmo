var User = Player.extend(
{
    init : function()
    {
        this._super();
    },
    /**
     * Action key pressed, if there is an action in front of player, launch it
     * @returns {void}
     */
    act : function(){
        var direction = this.animation.direction;
        var coords = new Coords(this.coords.x,this.coords.y);
        switch(direction){
            case DIRECTION.UP:
                coords.y-=1;
                break;
            case DIRECTION.DOWN:
                coords.y+=1;
                break;
            case DIRECTION.LEFT:
                coords.x-=1;
                break;
            case DIRECTION.RIGHT:
                coords.x+=1;
                break;
        }
        GameEngineInstance.thingManager.actPnj(coords, ACTION.ACT);
    },
    /**
     * Hydrate a User with a given one
     * @param {User} user The given User
     * @return {void}
     */
    hydrate : function(user)
    {
        this._super(user);
    },
    /**
     * Check if the player is on a PNJ, if it's the case, launch the walk action
     * @returns {void}
     */
    checkOnPnj : function()
    {
        GameEngineInstance.thingManager.actPnj(this.coords, ACTION.WALK);
    },
    move : function(direction)
    {
        if(this.isMoving)return;
        if(!this.canMove(direction))return;
        Server.move(direction);
        this._super(direction);
    },
    doMove : function(direction)
    {
        this._super(direction);
        this.checkOnPnj();
    }
    
});