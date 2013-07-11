var CANVAS;
var CONTEXT;
var MAP;
var DRAWER;
var MOTOR;
var PLAYER;
var CONNECTION;

var Init = function(){
    
    this.launch = function(){
        new Socket();
        DRAWER = new Drawer();
        MOTOR  = new Motor();
        CONTEXT = $("#canvas").get(0).getContext("2d");
        CANVAS = new Canvas($("#canvas").get(0));
        CANVAS.init(this.getTileSetArray(), this.getSpriteArray());
    }
    
    /**
     * Retourne le tableau de tous les TileSets utilisés
     */
    this.getTileSetArray = function(){
        var array = [
            "Shared/img/plaines.png", //0
            "Shared/img/plaines_objets.png", //1
            "Shared/img/murs.png", //2
            "Shared/img/mobilier.png" //3
        ];
        return array;
    }
    
    /**
     * Retourne un tableau de tous les sprites utilisés
     */
    this.getSpriteArray = function(){
        var array = [
            "player", //0
            "paneau" //1
        ]; 
        return array;
    }
    
    /**
     * Fais rejoindre la map, sous un nom choisi
     * @param name le nom
     */
    this.rejoindre = function(name){
        MAP.loadMap("u0000001", "ForestHouse");
        PLAYER = MAP.addPlayer(name, 0, 'UP', 6, 11);
        PLAYER.user = true;

        var message = {'act':'join','player':PLAYER};
        var tosend = JSON.stringify(message);
        CONNECTION.send(tosend);
    }
}