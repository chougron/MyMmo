var PLAYER;

var Init = function(){
    
    Init.launch = function(){
        new Socket();
        new Drawer();
        new Motor();
        new Map();
        new Canvas($("#canvas").get(0));
        Canvas.init(this.getTileSetArray(), this.getSpriteArray());
        new MessageManager();
    };
    
    /**
     * Return the array of all the used Tilesets
     * @returns {Array}
     */
    Init.getTileSetArray = function(){
        var array = [
            "plaines", //0
            "plaines_objets", //1
            "murs", //2
            "mobilier" //3
        ];
        return array;
    };
    
    /**
     * Returns the array of all the used Sprites
     * @returns {Array}
     */
    Init.getSpriteArray = function(){
        var array = [
            "player", //0
            "paneau" //1
        ]; 
        return array;
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