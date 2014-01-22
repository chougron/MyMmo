/**
 * A Canvas Object
 * @param {DOM Canvas} canvasDomObject
 * @returns {Canvas}
 */
var Canvas = function(canvasDomObject){
    Canvas.object = canvasDomObject;
    Canvas.context = canvasDomObject.getContext("2d");
    
    Canvas.width = 640;
    Canvas.height = 480;
    Canvas.map;
    
    /**
     * Init the Dom Object to the right size
     * @returns {void}
     */
    Canvas.init = function(){
        Canvas.object.width = Canvas.width;
        Canvas.object.height = Canvas.height;
    };
};