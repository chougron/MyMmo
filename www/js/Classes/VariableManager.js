var VariableManager = Class.extend(
{
    init : function()
    {
        this.variables = {};
    },
    /**
     * Add a Variable in the variables Array
     * @param {Variable} variable
     * @returns {void}
     */
    addVariable : function(variable)
    {
        var tmpVariable = new Variable();
        tmpVariable.hydrate(variable);
        this.variables[tmpVariable._id] = tmpVariable;
        delete tmpVariable;
    },
    /**
     * Add an array of Variables in the variables Array
     * @param {Array<Variable>} variables
     * @returns {void}
     */
    addVariables : function(variables)
    {
        for(var i in variables)
            this.addVariable(variables[i]);
    }
});