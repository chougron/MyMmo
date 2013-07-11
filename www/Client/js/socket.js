var Socket = function(){
    window.WebSocket = window.WebSocket || window.MozWebSocket;
    if (!window.WebSocket) alert("votre navigateur ne supporte pas les sockets");
    
    CONNECTION = new WebSocket('ws://localhost:8080'); //Here we need to put our Node.JS server
    CONNECTION.onopen = function(){
        log("WS connection opened");
    }
    
    var _this = this;
    
    /**
     * Traite les messages reçus en WebSockets
     * @param message le message reçu
     */
    CONNECTION.onmessage = function(message){
        var data = JSON.parse(message.data);
        log("message reçu : "+data.act);
        switch(data.act){
            case 'join':
                _this.doJoin(data.player);
                break;
            case 'getPlayerList':
                _this.doGetPlayerList(data.players);
                break;
            case 'getPnjList':
                _this.doGetPnjList(data.pnjs);
                break;
            case 'move':
                _this.doMove(data.player);
                break;
            case 'changeZone':
                _this.doChangeZone(data.player, data.oldZone, data.newZone);
                break;
            case 'changeMap':
                _this.doChangeMap(data.player, data.oldMap, data.newMap);
                break;
        }
    }
    
    /**
     * Fais apparaître un joueur qui rejoint tout juste la zone (connexion)
     * @param player le joueur qui rejoint
     */
    this.doJoin = function(player){
        MAP.addPlayer(player.name, player.animation.sprite, player.animation.direction, player.coords.x, player.coords.y);
    }
    
    /**
     * Fais apparaître tous les joueurs de la zone
     * @param players la liste des joueurs de la zone
     */
    this.doGetPlayerList = function(players){
        for(var i=0; i<players.length; i++){
            var player = players[i];
            MAP.addPlayer(player.name, player.animation.sprite, player.animation.direction, player.coords.x, player.coords.y);
        }
    }
    
    /**
     * Fais apparaître tous les pnjs de la zone
     * @param pnjs la liste des pnjs de la zone
     */
    this.doGetPnjList = function(pnjs){
        for(var i=0; i<pnjs.length; i++){
            var pnj = new Pnj();
            pnj.hydrate(pnjs[i]);
            
            MAP.addPnj(pnj);
        }
    }
    
    /**
     * Fais bouger un joueur sur la zone
     * @param player le joueur avant son déplacement
     */
    this.doMove = function(player){
        for(var i=0; i<MAP.players.length; i++){
            if(MAP.players[i].name == player.name){
                if(MAP.players[i].distance(player) != 0){
                    //On a manqué un message, le joueur devrait être ailleurs
                    //On le place dans sa case et on effectue le déplacement
                    MAP.players[i].coords.x = player.coords.x;
                    MAP.players[i].coords.y = player.coords.y;
                }
                MAP.players[i].move(player.animation.direction);
                break;
            }
        }
    }
    
    /**
     * Fais changer un joueur de zone
     * @param player le joueur après son changement de zone
     * @param oldZone la zone quittée
     * @param newZone la zone rejointe
     */
    this.doChangeZone = function(player, oldZone, newZone){
        if(MAP.zone.x == oldZone.x && MAP.zone.y == oldZone.y)MAP.removePlayer(player);
        if(MAP.zone.x == newZone.x && MAP.zone.y == newZone.y)MAP.addPlayer(player.name, player.animation.sprite, player.animation.direction, player.coords.x, player.coords.y);
    }
    
    this.doChangeMap = function(player, oldMap, newMap){
        if(MAP.author == oldMap.author && MAP.name == oldMap.name)MAP.removePlayer(player);
        if(MAP.author == newMap.author && MAP.name == newMap.name && MAP.zone.x == newMap.zone.x && MAP.zone.y == newMap.zone.y)MAP.addPlayer(player.name, player.animation.sprite, player.animation.direction, player.coords.x, player.coords.y);
    }
}