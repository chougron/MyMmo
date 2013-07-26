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
     * @param {String} _id
     * @returns {Pnj} The selected PNJ or new PNJ if doesn't exists
     */
    this.PNJ = function(_id){
        var pnj = ThingsManager.pnjs[_id] ? ThingsManager.pnjs[_id] : new Pnj(); 
        pnj.addQuest(this._id);
        return pnj;
    };
    
    /**
     * Return a Variable Object by it's name
     * @param {String} name
     * @returns {Variable} The selected Variable or new Variable if doesn't exists
     */
    this.VAR = function(name){
        var _id = this._id + '_' + name;
        
        var tmpVar;
        if(VariablesManager.variables[_id]){
            tmpVar = VariablesManager.variables[_id];
        } else {
            tmpVar = new Variable();
            tmpVar._id = _id;
            VariablesManager.addVariable(tmpVar);
        }
        return  VariablesManager.variables[_id];
    };
};

/**
 * Access a Variable from outside the quest
 * @param {String} _id The _id of the variable
 * @returns {Variable}
 */
var VAR = function(_id){
    var tmpVar;
    if(VariablesManager.variables[_id]){
        tmpVar = VariablesManager.variables[_id];
    } else {
        tmpVar = new Variable();
        tmpVar._id = _id;
        VariablesManager.addVariable(tmpVar);
    }
    return  VariablesManager.variables[_id];
};