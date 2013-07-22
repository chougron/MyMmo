var PLAYER;

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
    };
    
    /**
     * Join the game, with a chosen name
     * @param {String} name
     * @returns {void}
     */
    Init.join = function(name){
        Map.loadMap("u0000001",'ForestHouse');
        PLAYER = Map.addPlayer(name, 0, 'UP', {x:6, y:11});
        PLAYER.user = true;

        var message = {'act':'join','player':PLAYER};
        var tosend = JSON.stringify(message);
        Socket.connection.send(tosend);
    };
};

$(document).ready(function(){
    new Init();
    Init.launch();
});