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
     * Hydrate une Animation à partir d'une animation directement reçue de la B.D.D.
     * @param _animation : l'animation reçue de la base (objet)
     */
    this.hydrate = function(_animation){
        this.sprite = _animation.sprite;
        this.direction = _animation.direction;
        this.action = _animation.action;
    }
    
    /**
     * Renseigne le numéro du sprite de l'animation dans le tableau des sprites
     * (débute à 0)
     * @param numero le numéro du sprite
     */
    this.setSprite = function(numero){
        this.sprite = numero;
    }
    
    /**
     * Dessine une animation en x,y sur la zone, puis avance son rendu dans le temps
     * @param x l'abscisse de la zone (en tiles)
     * @param y l'ordonnée de la zone (en tiles)
     */
    this.draw = function(x,y){
        var ligneSprite = this.direction*3 + this.action;
        var tmpSprite = CANVAS.sprites[this.sprite];
        DRAWER.drawAnimation(x, y, tmpSprite, ligneSprite, this.cptAnimation);
        this.tick();
    }
    
    /**
     * Renseigne la direction
     * @param dir la direction de l'animation 
     */
    this.setDirection = function(dir){
        switch(dir){
            case 'LEFT':case 3:this.direction = this.LEFT;break;
            case 'UP':case 1:this.direction = this.UP;break;
            case 'DOWN':case 2:this.direction = this.DOWN;break;
            case 'RIGHT':case 0:this.direction = this.RIGHT;break;
        }
        this.cptAnimation = 0;
    }
    
    /**
     * Renseigne l'action 
     * @param act l'action de l'animation
     */
    this.setAction = function(act){
        switch(act){
            case 'ATTACK':this.action = this.ATTACK;break;
            case 'WALK':this.action = this.WALK;break;
            case 'STAND':this.action = this.STAND;break;
        }
        this.cptAnimation = 0;
    }
    
    /**
     * Fais avancer l'animation à son image suivante
     */
    this.tick = function(){
        var ligneSprite = this.direction*3 + this.action;
        this.cptAnimation++;
        if(spriteL[this.sprite][ligneSprite] <= this.cptAnimation)this.cptAnimation = 0;
    }
}