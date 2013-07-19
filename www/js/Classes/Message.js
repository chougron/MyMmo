var Message = function(ID){
    this.content;
    this.style = Array();
    this.domObject = document.createElement("span");
    this.domObject.setAttribute("class","message");
    this.managerID = ID;
    
    /**
     * Display the message, centered at the given Coords
     * @param {Coords} coords The Coords, in px
     * @returns {void}
     */
    this.display = function(coords){
        //Add the content
        this.domObject.innerHTML = this.content;
        
        //Add the style
        for(var attr in this.style){
            this.domObject.style[attr] = this.style[attr];
        }
        
        //Append, so the width and height exist
        document.body.appendChild(this.domObject);
        
        //Calculate the position
        var width = this.domObject.offsetWidth;
        var height = this.domObject.offsetHeight;
        
        var display_x = ((coords.x - width/2) < 0) ? 0 : Math.ceil((coords.x - width/2));
        var display_y = ((coords.y - height/2) < 0) ? 0 : Math.ceil((coords.y - height/2));
        
        display_x += $("#ecranJeu").get(0).offsetLeft;
        display_y += $("#ecranJeu").get(0).offsetTop;
        
        //Place the message
        this.domObject.style['position'] = 'fixed';
        this.domObject.style['left'] = display_x+"px";
        this.domObject.style['top'] = display_y+"px";
    };
    
    /**
     * Make the diplayed message disappear
     * @returns {undefined}
     */
    this.destroy = function(){
        var object = this.domObject;
        $(this.domObject).fadeOut(800,function(){
            document.body.removeChild(object);
        });
    };
};