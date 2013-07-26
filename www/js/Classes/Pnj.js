var Pnj = function(){
    Thing.call(this);
    
    this.animation = null;
    
    this.onWalk = null;
    this.oldWalk;
    
    this.onAct = null;
    this.oldAct;
    
    this.onInit = null;
    this.oldInit;
    
    this.onClose = null;
    this.oldClose;
    
    this.map = null;
    this.block = null;
    this._id;   //The ID in the DB
    this.relatedQuests = new Array();
    
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
    
    /**
     * Refresh the related quests of the Pnj
     * @returns {void}
     */
    this.refreshQuests = function(){
            //Empty the related Quests
            var _relatedQuests = this.relatedQuests;
            this.relatedQuests = new Array();
            //Refresh the quests that will push the related Quests
            QuestsManager.refresh(_relatedQuests);
    };
    
    /**
     * Trigger of the PNJ
     * @returns {void}
     */
    this.walk = function(){
        if(this.relatedQuests.length){
            this.onWalk();
            this.refreshQuests();
        } else {
            if(this.oldWalk){
                this.onWalk = this.oldWalk;
                this.oldWalk = null;
            }
            this.onWalk();
        }
    };
    
    /**
     * Trigger of the PNJ
     * @returns {void}
     */
    this.act = function(){
        if(this.relatedQuests.length){
            this.onAct();
            this.refreshQuests();
        } else {
            if(this.oldAct){
                this.onAct = this.oldAct;
                this.oldAct = null;
            }
            this.onAct();
        }
    };
    
    /**
     * Trigger of the PNJ
     * @returns {void}
     */
    this.init = function(){
        if(this.relatedQuests.length){
            this.onInit();
            this.refreshQuests();
        } else {
            if(this.oldInit){
                this.onInit = this.oldInit;
                this.oldInit = null;
            }
            this.onInit();
        }
    };
    
    /**
     * Trigger of the PNJ
     * @returns {void}
     */
    this.close = function(){
        if(this.relatedQuests.length){
            this.onClose();
            this.refreshQuests();
        } else {
            if(this.oldClose){
                this.onClose = this.oldClose;
                this.oldClose = null;
            }
            this.onClose();
        }
    };
    
    /**
     * Add a related Quest
     * @param {String} _id
     * @returns {void}
     */
    this.addQuest = function(_id){
        if(!this.oldAct)
            this.oldAct = this.onAct;
        if(!this.oldClose)
            this.oldClose = this.onClose;
        if(!this.oldInit)
            this.oldInit = this.onInit;
        if(!this.oldWalk)
            this.oldWalk = this.onWalk;
        
        this.relatedQuests.push(_id);
    };
};