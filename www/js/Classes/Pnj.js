var Pnj = Thing.extend(
{
    init : function()
    {
        this._super();
        
        this._id;
        this.animation = new Animation();
        this.map;
        this.block = false;
        this.relatedQuests = new Array();
        this.currentQuest = null;

        this.onWalk = null;
        this.oldWalk;

        this.onAct = null;
        this.oldAct;

        this.onCreate = null;
        this.oldCreate;

        this.onDestroy = null;
        this.oldDestroy;
    },
    /**
     * Hydrate a PNJ from a given Pnj
     * @param {Pnj} pnj The given Pnj
     * @returns {void}
     */
    hydrate : function(pnj)
    {
        this._super(pnj);
        this._id = pnj._id;
        if(pnj.animation != null)
            this.animation.hydrate(pnj.animation);
        else
            this.animation = null;
        this.map = pnj.map;
        this.block = pnj.block;
        
        this.onWalk = pnj.onWalk;
        if(typeof(this.onWalk) != "function")
            eval(this.onWalk);
        this.onAct = pnj.onAct;
        if(typeof(this.onAct) != "function")
            eval(this.onAct);
        this.onCreate = pnj.onCreate;
        if(typeof(this.onCreate) != "function")
            eval(this.onCreate);
        this.onDestroy = pnj.onDestroy;
        if(typeof(this.onDestroy) != "function")
            eval(this.onDestroy);
        this.oldWalk = pnj.oldWalk;
        if(typeof(this.oldWalk) != "function")
            eval(this.oldWalk);
        this.oldAct = pnj.oldAct;
        if(typeof(this.oldAct) != "function")
            eval(this.oldAct);
        this.oldCreate = pnj.oldCreate;
        if(typeof(this.oldCreate) != "function")
            eval(this.oldCreate);
        this.oldDestroy = pnj.oldDestroy;
        if(typeof(this.oldDestroy) != "function")
            eval(this.oldDestroy);
    },
    /**
     * Draw the Pnj at the coordinate
     * @returns {void}
     */
    draw : function()
    {    
        if(this.map != GameEngineInstance.map._id){
            return;
        }
        if(this.animation != null) this.animation.draw(this.coords);
    },
    /**
     * Refresh the related quests of the Pnj
     * @returns {void}
     */
    refreshQuests : function(){
            //Empty the related Quests
            var _relatedQuests = this.relatedQuests;
            this.relatedQuests = new Array();
            this.currentQuest = null;
            //Refresh the quests that will push the related Quests
            GameEngineInstance.questManager.refreshById(_relatedQuests);
    },
    /**
     * Trigger of the PNJ
     * @returns {void}
     */
    walk : function(){
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
    },
    /**
     * Trigger of the PNJ
     * @returns {void}
     */
    act : function(){
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
    },
    /**
     * Trigger of the PNJ
     * @returns {void}
     */
    create : function(){
        if(this.relatedQuests.length){
            this.onCreate();
            this.refreshQuests();
        } else {
            if(this.oldCreate){
                this.onCreate = this.oldCreate;
                this.oldCreate = null;
            }
            this.onCreate();
        }
    },
    /**
     * Trigger of the PNJ
     * @returns {void}
     */
    destroy : function(){
        if(this.relatedQuests.length){
            this.onDestroy();
            this.refreshQuests();
        } else {
            if(this.oldDestroy){
                this.onDestroy = this.oldDestroy;
                this.oldDestroy = null;
            }
            this.onDestroy();
        }
    },
    /**
     * Add a related Quest
     * @param {String} _id The quest _id
     * @returns {void}
     */
    addQuest : function(_id){
        if(!this.oldAct)
            this.oldAct = this.onAct;
        if(!this.oldDestroy)
            this.oldDestroy = this.onDestroy;
        if(!this.oldCreate)
            this.oldCreate = this.onCreate;
        if(!this.oldWalk)
            this.oldWalk = this.onWalk;
        
        this.relatedQuests.push(_id);
        this.currentQuest = _id;
    }
});