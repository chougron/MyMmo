var Pnj = function(){
    
    var _currentPNJ = this;
    
    this.animation = new Animation();
    this.onWalk = null;
    this.onAct = null;
    this.onInit = null;
    this.onClose = null;
    this.map = null;
    this.zone = null;
    this.coords = null;
    this.block = null;
    
    /**
     * Hydrate un PNJ à partir d'un PNJ directement reçu de la B.D.D.
     * @param _pnj : le pnj reçu de la base (objet)
     */
    this.hydrate = function(_pnj){
        if(_pnj.animation != null) this.animation.hydrate(_pnj.animation);
        else this.animation = null;
        
        this.map = _pnj.map;
        this.zone = _pnj.zone;
        this.coords = _pnj.coords;
        this.block = _pnj.block;
        
        eval(_pnj.onWalk);
        this.onWalk = NEWfONCTION;
        eval(_pnj.onAct);
        this.onAct = NEWfONCTION;
        eval(_pnj.onInit);
        this.onInit = NEWfONCTION;
        eval(_pnj.onClose);
        this.onClose = NEWfONCTION;
    }
    
    /**
     * Dessine le pnj à ses coordonnées
     */
    this.draw = function(){
        if(this.animation != null) this.animation.draw(this.coords.x, this.coords.y);
    }
}