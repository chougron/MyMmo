var GraphicEngine = Class.extend(
{
    init : function()
    {
        this.pause = false;
    },
    start : function()
    {
        this.pause = false;
        this.draw();
    },
    stop : function()
    {
        this.pause = true;
    },
    drawMap : function()
    {
        GameEngineInstance.map.draw();
    },
    draw : function()
    {
        GameEngineInstance.drawerThings.clear();
        GameEngineInstance.thingManager.draw();
        if(!this.pause)
            setTimeout(function(thisObj){thisObj.draw();},30,this);
    }
});