var Motor = function(){
    this.launch = function(){
        this.timer();
    }
    
    this.timer = function(){
        setTimeout(function() {
            if(MAP.drawZone)MAP.drawZone();
            MOTOR.timer();
        }, 100);
    }
}