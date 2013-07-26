var Variable = function(){
    this.value = 0; //Value of the variable. Can be anything. By default is 0.
    this._id;
    
    /**
     * Hydrate the current Variable with a given Variable
     * @param {Variable} variable
     * @returns {void}
     */
    this.hydrate = function(variable){
        this.value = variable.value;
        this._id = variable._id;
    };
    
    /**
     * Save the Variable value in the DB
     * @returns {void}
     */
    this.save = function(){
        var message = {act:'variableSave',variable:this};
        var json = JSON.stringify(message);
        Socket.connection.send(json);
    };
    
    /**
     * Set the value of the Variable
     * @param {type} value
     * @returns {void}
     */
    this.set = function(value){
        this.value = value;
        this.save();
    };
    
    /**
     * Increment the value if it's a number
     * @returns {void}
     */
    this.increment = function(){
        if(isNaN(this.value)) return;
        this.value++;
        this.save();
    };
};