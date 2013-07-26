var Init = function(){
    
    Init.launch = function(){
        new Socket();
        new Drawer();
        new Motor();
        new Map();
        new Canvas($("#canvas").get(0));
        Canvas.init();
        new MessageManager();
        new FilesManager();
        FilesManager.getFromDB();
        new QuestsManager();
        new ThingsManager();
    };
    
    /**
     * Join the game, with a chosen name
     * @param {String} name
     * @returns {void}
     */
    Init.join = function(name){
        var playerSprite = FilesManager.sprites[Object.keys(FilesManager.sprites)[0]]._id; //We take the first sprite
        ThingsManager.user.create(name, playerSprite, 'UP', 6, 11);
        ThingsManager.user.user = true;
        
        var map = {title:'ForestHouse',author:'u0000001'};
        Socket.changeMap(map);
    };
};

$(document).ready(function(){
    new Init();
    Init.launch();
});