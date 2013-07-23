var Pnj = function(){
    Thing.call(this);
    
    this.animation = null;
    this.onWalk = null;
    this.onAct = null;
    this.onInit = null;
    this.onClose = null;
    this.map = null;
    this.block = null;
    this._id;   //The ID in the DB
    
    /**
     * Hydrate a PNJ from a BDD Pnj
     * @param {BDD Pnj} _pnj
     * @returns {void}
     */
    this.hydrate = function(_pnj){
        if(_pnj.animation != null){
            this.animation  = new Animation();
            this.animation.hydrate(_pnj.animation);
        }
        else this.animation = null;
        
        this.map = _pnj.map;
        this.coords = new Coords(_pnj.coords.x, _pnj.coords.y);
        this.block = _pnj.block;
        this._id = _pnj._id;
        
        eval(_pnj.onWalk);
        this.onWalk = NEWfONCTION;
        eval(_pnj.onAct);
        this.onAct = NEWfONCTION;
        eval(_pnj.onInit);
        this.onInit = NEWfONCTION;
        eval(_pnj.onClose);
        this.onClose = NEWfONCTION;
    };
    
    /**
     * Draw the Pnj at the coordinate
     * @returns {void}
     */
    this.draw = function(){
        if(this.animation != null) this.animation.draw(this.coords.x, this.coords.y);
    };
};