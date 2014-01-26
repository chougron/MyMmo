var EditorThingManager = ThingManager.extend(
{
    init : function()
    {
        this.pnjs = {};
    },
    draw : function()
    {
        for(var i in this.pnjs){
            var _pnj = this.pnjs[i];
            _pnj.draw();
        }
    }
});