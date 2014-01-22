var Animation = Class.extend({
    init : function()
    {
        this.sprite;
        this.tickAnimation = 0;
        this.divTick = 5;
        this.divTickI = 0;
        this.direction = 0;
        this.action = 0;
    },
    /**
     * Hydrate an Animation from a given one
     * @param {Animation} animation The received animation
     * @returns {void}
     */
    hydrate : function(animation)
    {
        this.sprite = animation.sprite;
        this.direction = animation.direction;
        this.action = animation.action;
    },
    /**
     * Put the sprite number of the animation from the sprite array
     * @param {_id} the _id of the choosen sprite
     * @returns {void}
     */
    setSprite : function(_id)
    {
        this.sprite = _id;
    },
    /**
     * Draw an animation then tick it
     * @param {Coords} coords
     * @returns {void}
     */
    draw : function(coords)
    {
        GameEngineInstance.drawerThings.drawAnimation(coords, this.sprite, this.action, this.direction, this.tickAnimation);
        this.tick();
    },
    /**
     * Put the direction
     * @param {DIRECTION} direction The animation direction
     * @returns {void}
     */
    setDirection : function(direction){
        this.direction = direction;
        this.tickAnimation = 0;
    },
    /**
     * Put the action
     * @param {ACTION} action The action
     * @returns {void}
     */
    setAction : function(action){
        this.action = action;
        this.tickAnimation = 0;
    },
    /**
     * Tick the animation to the next image
     * @returns {void}
     */
    tick : function(){
        this.divTickI++;
        if(this.divTickI == this.divTick)
        {
            this.divTickI=0;
            this.tickAnimation++;
        }
        var nbTicks = GameEngineInstance.imageFileManager.sprites[this.sprite].lengths[this.direction*3 + this.action];
        if(nbTicks <= this.tickAnimation)
            this.tickAnimation = 0;
    }
}); 