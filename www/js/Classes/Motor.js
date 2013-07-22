var Motor = function(){
    Motor.launched = false;
    Motor.time = 100;
    
    /**
     * Launch the motor
     * @returns {void}
     */
    Motor.launch = function(){
        Motor.launched = true;
        Motor.timer();
    };
    
    /**
     * Draw the Map if the motor is launched, and recall itself
     * @returns {void}
     */
    Motor.timer = function(){
        if(!Motor.launched)
            return;
        
        setTimeout(function() {
            if(Map.draw)Map.draw();
            Motor.timer();
        }, Motor.time);
    };
    
    /**
     * Stop the motor
     * @returns {void}
     */
    Motor.stop = function(){
        Motor.launched = false;
    };
};