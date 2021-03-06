$(window).ready(function(){
    
    /**
     * Handle the Keyboard functions
     */
    $(document).keydown(function(event){
        
        if(event.target == $("#chat_message").get(0)) //If we are writting a message
            return true;
        
        var e = event || window.event;
        var key = e.which || e.keyCode;
        if(ThingsManager.user != null){
            switch(key) {
                case 38 : case 122 : case 119 : case 90 : case 87 : // UP, z, w, Z, W
                        ThingsManager.user.move('UP');
                        break;
                case 40 : case 115 : case 83 : // DOWN, s, S
                        ThingsManager.user.move('DOWN');
                        break;
                case 37 : case 113 : case 97 : case 81 : case 65 : //LEFT, q, a, Q, A
                        ThingsManager.user.move('LEFT');
                        break;
                case 39 : case 100 : case 68 : // RIGHT, d, D
                        ThingsManager.user.move('RIGHT');
                        break;
                case 13 : //ENTER
                        ThingsManager.user.act();
                default : 
                        //alert(key);
                        return true;
            }
        }
    });
    
    /**
     * Handle the chat form
     */
    $("#chat_form").submit(function(){
        var input = $("#chat_message");
        ThingsManager.user.speak(input.val());
        
        var message = {act:'chat',player:ThingsManager.user,content:input.val()};
        var toSend = JSON.stringify(message);
        Socket.connection.send(toSend);
        
        input.val("");
        
        return false;
    });
});
