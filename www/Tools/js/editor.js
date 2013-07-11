var drawGrid = function(canvas){
    var context = canvas.getContext("2d");
    
    var width = canvas.width;
    var height = canvas.height;
    context.beginPath();
    context.lineWidth = 1;
    context.strokeStyle = "#000";
    
    for(var x=32; x<canvas.width; x+=32){
        context.moveTo(x,0);
        context.lineTo(x,height);
    }
    for(var y=32; y<canvas.height; y+=32){
        context.moveTo(0,y);
        context.lineTo(width,y);
    }
    context.stroke();
}