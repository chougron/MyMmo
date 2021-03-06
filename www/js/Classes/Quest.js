var Quest = Class.extend(
{
    init : function()
    {
        this._id;
        this.script;
    },
    /**
     * Activate the current Quest
     * @returns {void}
     */
    activate : function(){
        eval(this.script);
    },
    /**
     * Hydrate the current Quest with another Quest object
     * @param {Quest} quest
     * @returns {void}
     */
    hydrate : function(quest){
        this._id = quest._id;
        this.script = quest.script;
    },
    /**
     * Return a Pnj Object by it's _id
     * @param {String} _id
     * @returns {Pnj} The selected PNJ or new PNJ if doesn't exists
     */
    PNJ : function(_id){
        var thingManager = GameEngineInstance.thingManager;
        var pnj = thingManager.pnjs[_id] ? thingManager.pnjs[_id] : new Pnj(); 
        pnj.addQuest(this._id);
        return pnj;
    },
    /**
     * Return a Variable Object by it's name
     * @param {String} name
     * @returns {Variable} The selected Variable or new Variable if doesn't exists
     */
    VAR : function(name){
        var _name = this._id + '_' + name;
        var tmpVar;
        var variableManager = GameEngineInstance.variableManager;
        if(!variableManager.variables[_name])
        {
            tmpVar = new Variable();
            tmpVar.name = _name;
            variableManager.addVariable(tmpVar);
        }
        return  variableManager.variables[_name];
    }
});