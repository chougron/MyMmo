var EventListener = Class.extend(
{
    init : function()
    {
        $(document).keydown(function(event){
            var e = event || window.event;
            var key = e.which || e.keycode;
            switch(key){
                case 38: //UP
                    GameEngineInstance.move(DIRECTION.UP);
                    break;
                case 40: //DOWN
                    GameEngineInstance.move(DIRECTION.DOWN);
                    break;
                case 37: //LEFT
                    GameEngineInstance.move(DIRECTION.LEFT);
                    break;
                case 39: //RIGHT
                    GameEngineInstance.move(DIRECTION.RIGHT);
                    break;
                case 13: //ENTER
                    GameEngineInstance.action();
                    break;
            }
        });
    },
});