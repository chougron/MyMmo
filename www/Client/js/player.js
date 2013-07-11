var Player = function(){
    this.name = '';
    this.map = {'author':'', 'name':''};
    this.zone = {'x':0, 'y':0};
    this.coords = {'x':0, 'y':0};
    this.animation = new Animation();
    this.cptTick = 0;
    this.isMoving = false;
    this.user = false;
    
    /**
     * Crée un nouveau joueur d'un nom, sprite et de direction donnée aux coordonées
     * @param name le nom du joueur
     * @param sprite le numéro du sprite le représentant (commence à 0)
     * @param direction la direction prise par le joueur (UP, DOWN...)
     * @param x son abscisse sur la zone
     * @param y son ordonnée sur la zone
     */
    this.create = function(name, sprite, direction, x, y){
        this.name = name;
        this.animation.setSprite(sprite);
        this.animation.setDirection(direction);
        this.animation.setAction("STAND");
        this.coords.x = x;
        this.coords.y = y;
    }
    
    /**
     * Change la carte sur laquelle est le joueur
     * @param author l'auteur de la carte
     * @param name le nom de la carte
     */
    this.setMap = function(author, name){
        this.map.author = author;
        this.map.name = name;
    }
    
    /**
     * Change la zone sur laquelle est le joueur
     * @param x l'abscisse
     * @param y l'ordonnée
     */
    this.setZone = function(x,y){
        this.zone.x = x;
        this.zone.y = y;
    }
    
    /**
     * Dessine le personnage à ses coordonnées
     */
    this.draw = function(){
        this.animation.draw(this.coords.x, this.coords.y);
    }
    
    /**
     * Fais bouger le joueur s'il n'est pas déjà en mouvement
     * @param direction la direction du mouvement
     */
    this.move = function(direction){
        if(this.isMoving)return;
        this.animation.setDirection(direction);
        if(!this.canMove(direction)){
            this.checkBorder(direction);
            return;
        }
        this.isMoving = true;
        this.animation.setAction("WALK");
        if(this.user){
            var message = {'act':'move','player':this};
            var tosend = JSON.stringify(message);
            CONNECTION.send(tosend);
        }
        this.doMove(direction);
    }
    
    /**
     * Anime un mouvement continu en 10 temps
     * @param direction la direction du mouvement
     */
    this.doMove = function(direction){
        switch(direction){
            case 'UP':case 1:
                this.coords.y-=0.1;
                break;
            case 'DOWN':case 2:
                this.coords.y+=0.1;
                break;
            case 'LEFT':case 3:
                this.coords.x-=0.1;
                break;
            case 'RIGHT':case 0:
                this.coords.x+=0.1;
                break;
        }
        if( (Math.round(this.coords.x*10))%10 == 0 && (Math.round(this.coords.y*10))%10 == 0){ //On s'arrête à la case suivante
            this.coords.x = Math.round(this.coords.x);
            this.coords.y = Math.round(this.coords.y);
            this.isMoving = false;
            this.animation.setAction("STAND");
            this.checkBorder(direction);
            this.checkOnPnj();
        }
        if(this.isMoving) setTimeout(function(thisObj){thisObj.doMove(direction)},50,this);
    }
    
    /**
     * Vérifie si le joueur peut se déplacer dans la direction donnée
     * @param direction la direction
     * @return boolean vrai si possible, faux sinon
     * //TODO : chercher les obstacles (QUAND IL Y EN AURA)
     */
    this.canMove = function(direction){
        switch(direction){
            case 'UP':case 1:
                if(this.coords.y == 1 || 
                    MAP.checkObstacle({x:this.coords.x, y:this.coords.y-1}))return false;
                return true;
                break;
            case 'DOWN':case 2:
                if(this.coords.y == 15 || 
                    MAP.checkObstacle({x:this.coords.x, y:this.coords.y+1}))return false;
                return true;
                break;
            case 'LEFT':case 3:
                if(this.coords.x == 1 || 
                    MAP.checkObstacle({x:this.coords.x-1, y:this.coords.y}))return false;
                return true;
                break;
            case 'RIGHT':case 0:
                if(this.coords.x == 20 || 
                    MAP.checkObstacle({x:this.coords.x+1, y:this.coords.y}))return false;
                return true;
                break;
            default:
                return false;
        }
    }
    
    /**
     * Vérifie si l'on arrive à une extrémité de la zone
     * Si oui, on change de zone
     * @param : direction la direction de déplacement
     */
    this.checkBorder = function(direction){
        if((this.coords.y == 1 && (direction == 'UP' || direction == 1)) ||
            (this.coords.y == 15 && (direction == 'DOWN' || direction == 2)) ||
            (this.coords.x == 1 && (direction == 'LEFT' || direction == 3)) ||
            (this.coords.x == 20 && (direction == 'RIGHT' || direction == 0)))this.changeZone(direction);
    }
    
    /**
     * Change la zone du joueur dans la direction donnée
     * @param : direction la direction de déplacement
     */
    this.changeZone = function(direction){
        if(this.user && !MAP.canChangeZone(direction))return;
        if(!this.user && !MAP.canChangeZone2(direction, this.zone.x, this.zone.y))return;
        var oldZone = {x:this.zone.x,y:this.zone.y}; //On enregistre l'ancienne zone s'il faut l'envoyer
        switch(direction){
            case 'UP':case 1:
                this.zone.y--;
                this.coords.y = 15;
                break;
            case 'DOWN':case 2:
                this.zone.y++;
                this.coords.y = 1;
                break;
            case 'LEFT':case 3:
                this.zone.x--;
                this.coords.x = 20;
                break;
            case 'RIGHT':case 0:
                this.zone.x++;
                this.coords.x = 1;
                break;
        }
        var newZone = {x:this.zone.x,y:this.zone.y};
        if(this.user){
            MAP.changeZone(this.zone.x, this.zone.y);
            
            var message = {'act':'changeZone','player':this,'oldZone':oldZone,'newZone':newZone};
            var tosend = JSON.stringify(message);
            CONNECTION.send(tosend);
        }
    }
    
    
    /**
     * Retourne la distance entre un joueur et un autre (en cases de déplacement)
     * @param : player le joueur à comparer
     * @return la distance entre les deux joueurs
     */
    this.distance = function(player){
        var dx = Math.abs(this.coords.x - player.coords.x);
        var dy = Math.abs(this.coords.y - player.coords.y);
        var distance = dx + dy;
        return distance;
    }
    
    /**
     * Fais effectuer une action à un joueur (touche action)
     * Si il y a une action a effectuer en face du joueur, alors il faut la lancer
     */
    this.act = function(){
        if(!this.user)return;
        var direction = this.animation.direction;
        var coords = {x:this.coords.x,y:this.coords.y};
        switch(direction){
            case 'UP':case 1:
                coords.y-=1;
                break;
            case 'DOWN':case 2:
                coords.y+=1;
                break;
            case 'LEFT':case 3:
                coords.x-=1;
                break;
            case 'RIGHT':case 0:
                coords.x+=1;
                break;
        }
        MAP.actPnj(coords, 'act');
    }
    
    this.checkOnPnj = function(){
        if(!this.user)return;
        MAP.actPnj(this.coords, 'walk');
    }
    
    this.changeMap = function(_author, _name, _zone, _coords){
        if(!this.user){
            MAP.removePlayer(this); 
            return;
        }
        if(this.user){
            var oldMap = MAP;
            this.coords = _coords;
            
            MAP = new Map();
            MAP.loadMap(_author, _name);
            
            PLAYER = MAP.addPlayer(this.name, this.animation.sprite, this.animation.direction, this.coords.x, this.coords.y);
            PLAYER.user = true;
            MAP.changeZone(_zone.x, _zone.y);
            PLAYER.zone = _zone;
            
            var newMap = MAP;
            
            var message = {'act':'changeMap','player':PLAYER,'oldMap':oldMap,'newMap':newMap};
            var tosend = JSON.stringify(message);
            CONNECTION.send(tosend);
            
        }
    }
}