var MessageManager = function(){
    MessageManager.messages = {};
    MessageManager.nbMessage = 0;
    
    /**
     * Add a Message to the manager then display it
     * @param {String} content The content of the message
     * @param {Array} style The style of the message (attr => value)
     * @param {Coords} coords The Coords in px where to put the message
     * @param {int} timeout The duration in ms of the message (<0 = no timeout)
     * @returns {void}
     */
    MessageManager.add = function(content,style,coords,timeout){
        var ID = "ID_"+ MessageManager.nbMessage;
        var temp = new Message(ID);
        
        temp.content = content;
        temp.style = style;
        
        MessageManager.messages[ID] = temp;
        MessageManager.messages[ID].display(coords);
        
        delete temp;
        
        MessageManager.nbMessage++;
        
        if(timeout >= 0)
            setTimeout( function(){MessageManager.remove(ID);} , timeout);
    };
    
    /**
     * Remove a message from the manager and from the screen
     * @param {string} ID The ID of the message in the manager
     * @returns {void}
     */
    MessageManager.remove = function(ID){
        if(!MessageManager.messages[ID])
            return;
        
        MessageManager.messages[ID].destroy();
        delete MessageManager.messages[ID];
    };
};