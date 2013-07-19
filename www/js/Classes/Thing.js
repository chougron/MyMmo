var Thing = function(){
    
    this.coords = new Coords(0,0);
    
    /**
     * Make the thing speak
     * @param {type} content The message to display
     * @returns {void}
     */
    this.speak = function(content){
        var tpx = this.coords.toPx();
        
        tpx.x -= 16; //Center
        tpx.y -= 64; //Up
        
        var style = {
            color:'white',
            background:'rgba(1,1,1,0.7)',
            padding:'3px',
            'font-size':'10px'
        };
        
        MessageManager.add(content,style,tpx,3000);
        delete tpx;
    };
};