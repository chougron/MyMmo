var Variable = Class.extend(
{
    init : function()
    {
        this._id;
        this.value = 0;
    },
    /**
     * Hydrate the current Variable with a given Variable
     * @param {Variable} variable
     * @returns {void}
     */
    hydrate : function(variable)
    {
        this._id = variable._id;
        this.value = variable.value;
    },
    /**
     * Set the value of the Variable
     * @param {type} value
     * @returns {void}
     */
    set : function(value)
    {
        this.value = value;
        Server.saveVariable(this);
    },
    /**
     * Increment the value if it's a number
     * @returns {void}
     */
    increment : function()
    {
        if(isNaN(this.value)) return;
        this.value++;
        this.save();
    }
});