var Quest = function(){
    this.maps; //The maps on which the quest is active : Array of _ids or 'all'
    this.script; //The script of the Quest : function
    this._id; //The _id of the Quest : String
    
    /**
     * Activate the current Quest
     * @returns {void}
     */
    this.activate = function(){
        eval(this.script);
    };
    
    /**
     * Hydrate the current Quest with another Quest object
     * @param {Quest} quest
     * @returns {void}
     */
    this.hydrate = function(quest){
        this.maps = quest.maps;
        this.script = quest.script;
        this._id = quest._id;
    };
    
    /**
     * Return a Pnj Object by it's _id
     * @param {type} _id
     * @returns {Pnj} The selected PNJ or new PNJ if doesn't exists
     */
    this.PNJ = function(_id){
        var pnj = ThingsManager.pnjs[_id] ? ThingsManager.pnjs[_id] : new Pnj(); 
        pnj.addQuest(this._id);
        return pnj;
    };
};