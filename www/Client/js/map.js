var Map = function(){
    this.width;
    this.height;
    //Les différentes zones de la map
    this.zones = new Array();
    this.tileSets = new Array();
    this.obstacles = new Array();
    this.pnjs = new Array(); //Tableau de pnjs
    this.author;
    this.name;
    this.zone = {'x':0, 'y':0};
    this.players = new Array();
    this.repaint = new Array();
    
    /**
     * Charge la Map en fonction de son auteur et de son nom
     * @param author l'auteur de la Map
     * @param name le nom de la Map
     */
    this.loadMap = function(author, name){
        this.author = author;
        this.name = name;
        $.getScript("Shared/Maps/"+author+"/"+name+".js", function() {
            MAP.doLoadMap();
        });
    }
    
    /**
     * Effectue le passement de variables après le chargement du script de Map
     * Puis lance la peinture de la Map
     */
    this.doLoadMap = function(){
        var _newMap = new newMap();
        this.width = _newMap.width;
        this.height = _newMap.height;
        this.zones = _newMap.zones;
        this.tileSets = _newMap.tileSets;
        this.obstacles = _newMap.obstacles;
        
        this.zone = {'x':0, 'y':0}; //ON SE MET EN ZONE 0
        for(var i=0; i<15*20;i++)this.repaint[i]=true;
        log('Map script loaded');
        MOTOR.launch();
    }
    
    /**
     * Demande au Drawer de représenter la Map dans le Canvas
     */
    this.drawZone = function(){
        for(var i=0; i<15*20; i++){
            if(this.repaint[i]){
                for(var layer=0; layer<3; layer++){
                    DRAWER.setTileSet(this.tileSets[layer]);
                    var value = this.zones[this.zone.x][this.zone.y][layer][i];
                    if(value != 0){ //Si value à 0, il n'y a rien sur cette case sur ce layer
                        var x = (i+1) % 20;
                        if(x == 0) x = 20;
                        var y = Math.ceil((i+1) / 20);
                        DRAWER.drawFromTileSet(x, y, value);
                    }
                }
                this.repaint[i] = false;
            }
        }
        for(var i=0; i<this.pnjs.length; i++){
            var _pnj = this.pnjs[i];
            _pnj.draw();
            var nb = Math.floor(_pnj.coords.y-1)*20 + Math.floor(_pnj.coords.x) - 1;
            this.repaint[nb] = true;
            nbup = Math.floor(_pnj.coords.y-2)*20 + Math.floor(_pnj.coords.x) - 1;
            this.repaint[nbup] = true;
            nb = Math.ceil(_pnj.coords.y-1)*20 + Math.ceil(_pnj.coords.x) - 1;
            this.repaint[nb] = true;
            nbup = Math.ceil(_pnj.coords.y-2)*20 + Math.ceil(_pnj.coords.x) - 1;
            this.repaint[nbup] = true;
        }
        for(var i=0; i<this.players.length; i++){
            var _player = this.players[i];
            if(_player.map.author == this.author &&
                _player.map.name == this.name &&
                _player.zone.x == this.zone.x &&
                _player.zone.y == this.zone.y){
                    this.players[i].draw();
                    var nb = Math.floor(_player.coords.y-1)*20 + Math.floor(_player.coords.x) - 1;
                    this.repaint[nb] = true;
                    nbup = Math.floor(_player.coords.y-2)*20 + Math.floor(_player.coords.x) - 1;
                    this.repaint[nbup] = true;
                    nb = Math.ceil(_player.coords.y-1)*20 + Math.ceil(_player.coords.x) - 1;
                    this.repaint[nb] = true;
                    nbup = Math.ceil(_player.coords.y-2)*20 + Math.ceil(_player.coords.x) - 1;
                    this.repaint[nbup] = true;
                }
        }
    }
    
    /**
     * Ajoute un joueur à la zone
     * @param name le nom du joueur
     * @param sprite le sprite le représentant (commence à 0)
     * @param direction la direction qu'il prend
     * @param x son abscisse
     * @param y son ordonnée
     * @return le joueur
     */
    this.addPlayer = function(name, sprite, direction, x, y){
        var tmpPlayer = new Player();
        tmpPlayer.create(name, sprite, direction, x, y);
        tmpPlayer.setMap(this.author, this.name);
        tmpPlayer.setZone(this.zone.x, this.zone.y);
        this.players.push(tmpPlayer);
        return tmpPlayer;
    }
    
    /**
     * Ajoute un pnj au tableau des pnjs
     */
    this.addPnj = function(pnj){
        this.pnjs.push(pnj);
    }
    
    /**
     * Supprime un joueur à la zone
     * @param player le joueur à supprimer
     */
    this.removePlayer = function(player){
        for(var i=0; i<this.players.length; i++){
            if(this.players[i].name == player.name){
                this.players.splice(i,1);
                break;
            }
        }
    }
    
    /**
     * Change la zone de la map en cours
     * @param x l'abscisse de la zone
     * @param y l'ordonnée de la zone
     */
    this.changeZone = function(x,y){
        this.zone.x = x;
        this.zone.y = y;
        for(var i=0; i<15*20;i++)this.repaint[i]=true;
        this.players = new Array(PLAYER);
        this.pnjs = new Array();
    }
    
    /**
     * Vérifie s'il existe une zone dans la direction donnée
     * @param direction la direction
     * @return boolean vrai s'il en existe une, faux sinon
     */
    this.canChangeZone = function(direction){
        switch(direction){
            case 'UP':
                if(this.zone.y == 0)return false;
                if(this.zones[this.zone.x][this.zone.y-1]) return true;
                return false;
                break;
            case 'DOWN':
                if(this.zones[this.zone.x][this.zone.y+1]) return true;
                return false;
                break;
            case 'LEFT':
                if(this.zone.x == 0)return false;
                if(this.zones[this.zone.x-1][this.zone.y]) return true;
                return false;
                break;
            case 'RIGHT':
                if(this.zones[this.zone.x+1][this.zone.y]) return true;
                return false;
                break;
        }
    } 
    
    /**
     * Vérifie s'il existe une zone dans la direction donnée
     * @param direction la direction
     * @param zonex l'abscisse de la zone
     * @param zoney l'ordonnée de la zone
     * @return boolean vrai s'il en existe une, faux sinon
     */
    this.canChangeZone2 = function(direction, zonex, zoney){
        switch(direction){
            case 'UP':case 1:
                if(zoney == 0)return false;
                if(this.zones[zonex][zoney-1]) return true;
                return false;
                break;
            case 'DOWN':case 2:
                if(this.zones[zonex][zoney+1]) return true;
                return false;
                break;
            case 'LEFT':case 3:
                if(zonex == 0)return false;
                if(this.zones[zonex-1][zoney]) return true;
                return false;
                break;
            case 'RIGHT':case 0:
                if(this.zones[zonex+1][zoney]) return true;
                return false;
                break;
        }
    }
    
    /**
     * Fais agir (s'il y en a un) le PNJ aux coordonnées voulues
     * @param coords : les coordonées du PNJ
     * @param action : act ou walk
     */
    this.actPnj = function(coords, action){
        if(!this.pnjs.length)return;
        for(var i=0; i<this.pnjs.length;i++){
            if(coords.x == this.pnjs[i].coords.x && coords.y == this.pnjs[i].coords.y){
                if(action == 'act')this.pnjs[i].onAct('');
                if(action == 'walk')this.pnjs[i].onWalk('');
            }
        }
    }
    
    /**
     * Vérifie s'il y a un obstacle sur la carte ou non
     * Si c'est le cas, retourne vrai
     * @param coords les coordonnées à vérifier
     * @return boolean vrai si il y a un obstacle
     */
    this.checkObstacle = function(coords){
        var index = 20 * (coords.y -1) + coords.x - 1;
        if(this.obstacles[this.zone.x][this.zone.y][index])return true;
        for(var i=0; i<this.pnjs.length; i++){
            var _pnj = this.pnjs[i];
            if(_pnj.block && _pnj.coords.x == coords.x && _pnj.coords.y == coords.y)return true;
        }
        return false;
    }
    
    
}