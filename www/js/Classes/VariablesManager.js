var VariablesManager = function(){
    VariablesManager.variables = {};
    
    /**
     * Add a Variable in the variables Array
     * @param {Variable} variable
     * @returns {void}
     */
    VariablesManager.addVariable = function(variable){
        var tmpVariable = new Variable();
        tmpVariable.hydrate(variable);
        VariablesManager.variables[tmpVariable._id] = tmpVariable;
        delete tmpVariable;
    };
    
    /**
     * Add an array of Variables in the variables Array
     * @param {Array} variables
     * @returns {void}
     */
    VariablesManager.addVariables = function(variables){
        for(var i in variables)
            VariablesManager.addVariable(variables[i]);
    };
};