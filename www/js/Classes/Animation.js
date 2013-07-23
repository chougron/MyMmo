var Animation = function(){
    
    this.sprite;
    this.cptAnimation = 0;
    this.direction = 0;
    this.action = 0;
    
    this.RIGHT = 0;
    this.UP = 1;
    this.DOWN = 2;
    this.LEFT = 3;
    
    this.ATTACK = 0;
    this.WALK = 1;
    this.STAND = 2;
    
    /**
     * Hydrate an Animation from a BDD animation
     * @param {BDD Animation} _animation The received animation
     * @returns {void}
     */
    this.hydrate = function(_animation){
        this.sprite = _animation.sprite;
        this.direction = _animation.direction;
        this.action = _animation.action;
    };
    
    /**
     * Put the sprite number of the animation from the sprite array
     * @param {type} numero
     * @returns {undefined}
     */
    this.setSprite = function(numero){
        this.sprite = numero;
    };
    
    /**
     * Draw an animation then tick it
     * @param {int} x
     * @param {int} y
     * @returns {void}
     */
    this.draw = function(x,y){
        var ligneSprite = this.direction*3 + this.action;
        var tmpSprite = FilesManager.sprites[this.sprite];
        Drawer.drawAnimation(x, y, tmpSprite.img, ligneSprite, this.cptAnimation);
        this.tick();
    };
    
    /**
     * Put the direction
     * @param {String} dir The animation direction
     * @returns {void}
     */
    this.setDirection = function(dir){
        switch(dir){
            case 'LEFT':case 3:this.direction = this.LEFT;break;
            case 'UP':case 1:this.direction = this.UP;break;
            case 'DOWN':case 2:this.direction = this.DOWN;break;
            case 'RIGHT':case 0:this.direction = this.RIGHT;break;
        }
        this.cptAnimation = 0;
    };
    
    /**
     * Put the action
     * @param {String} act The action
     * @returns {void}
     */
    this.setAction = function(act){
        switch(act){
            case 'ATTACK':this.action = this.ATTACK;break;
            case 'WALK':this.action = this.WALK;break;
            case 'STAND':this.action = this.STAND;break;
        }
        this.cptAnimation = 0;
    };
    
    /**
     * Tick the animation to the next image
     * @returns {void}
     */
    this.tick = function(){
        var ligneSprite = this.direction*3 + this.action;
        this.cptAnimation++;
        if(FilesManager.sprites[this.sprite].spriteL[ligneSprite] <= this.cptAnimation)this.cptAnimation = 0;
    };
};