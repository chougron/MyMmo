var Message = Class.extend(
{
    init : function()
    {
        this.content;
        this.style = Array();
        this.domObject = document.createElement("span");
        this.domObject.setAttribute("class","message");
        this.coords = new Coords(0,0);
    },
    /**
     * Display the message, centered at its given Coords
     * @returns {void}
     */
    display : function()
    {
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
        
        var display_x = ((this.coords.x - width/2) < 0) ? 0 : Math.ceil((this.coords.x - width/2));
        var display_y = ((this.coords.y - height/2) < 0) ? 0 : Math.ceil((this.coords.y - height/2));
        
        display_x += GameEngineInstance.ecranJeu.offsetLeft;
        display_y += GameEngineInstance.ecranJeu.offsetTop;
        
        //Place the message
        this.domObject.style['position'] = 'fixed';
        this.domObject.style['left'] = display_x+"px";
        this.domObject.style['top'] = display_y+"px";
    },
    /**
     * Make the diplayed message disappear
     * @returns {undefined}
     */
    destroy : function()
    {
        var object = this.domObject;
        $(this.domObject).fadeOut(800,function(){
            document.body.removeChild(object);
        });
    }
});