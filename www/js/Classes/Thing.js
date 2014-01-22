var Thing = Class.extend(
{
    init : function()
    {
        this.coords = new Coords(0,0);
    },
    /**
     * Make the thing speak
     * @param {string} content The message to display
     * @returns {void}
     */
    speak : function(content)
    {
        var tpx = this.coords.toPx(GameEngineInstance.map.tileSize);
        
        tpx.x -= 16; //Center
        tpx.y -= 64; //Up
        
        var style = {
            color:'white',
            background:'rgba(1,1,1,0.7)',
            padding:'3px',
            'font-size':'10px'
        };
        var message = new Message();
        message.content = content;
        message.style = style;
        message.coords = tpx;
        
        GameEngineInstance.messageManager.display(message, 3000);
        delete tpx;
        delete message;
    },
    hydrate : function(thing)
    {
        this.coords.hydrate(thing.coords);
    }
});