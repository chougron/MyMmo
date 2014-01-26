var GraphicEngine = Class.extend(
{
    init : function()
    {
        this.pause = false;
    },
    start : function(drawer)
    {
        this.pause = false;
        this.draw(drawer);
    },
    stop : function()
    {
        this.pause = true;
    },
    drawMap : function(drawer)
    {
        GameEngineInstance.map.draw(drawer);
    },
    draw : function(drawer)
    {
        drawer.clear();
        GameEngineInstance.thingManager.draw(drawer);
        if(!this.pause)
            setTimeout(function(thisObj){thisObj.draw(drawer);},30,this);
    }
});