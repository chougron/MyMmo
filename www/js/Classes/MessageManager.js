var MessageManager = Class.extend(
{
    init : function()
    {
        this.messages = {};
        this.nbMessage = 0;
    },
    /**
     * Display a message for a given duration
     * @param {Message} message The message to display
     * @pamam {int} duration The duration, in ms
     * @returns {void}
     */
    display : function(message, duration)
    {
        var id = "message_" + this.nbMessage;
        this.messages[id] = message;
        this.messages[id].display();
        this.nbMessage++;
        if(duration >= 0)
            setTimeout( function(){
                    GameEngineInstance.messageManager.remove(id);
                }, duration);
    },
    /**
     * Remove a message from the manager and from the screen
     * @param {string} id The id of the message in the manager
     * @returns {void}
     */
    remove : function(id)
    {
        if(!this.messages[id])
            return;
        
        this.messages[id].destroy();
        delete this.messages[id];
    }
});