var Motor = function(){
    Motor.launch = function(){
        Motor.timer();
    };
    
    Motor.timer = function(){
        setTimeout(function() {
            if(Map.draw)Map.draw();
            Motor.timer();
        }, 100);
    };
};