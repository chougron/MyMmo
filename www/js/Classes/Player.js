var Player = function(){
    Thing.call(this);
    
    this.name = '';
    this.map = {'author':'name','title':''};
    this.animation = new Animation();
    this.cptTick = 0;
    this.isMoving = false;
    this.user = false;
    
    /**
     * Create a new Player
     * @param {String} name The player name
     * @param {int} sprite The player sprite
     * @param {int} direction The player direction (UP, DOWN...)
     * @param {int} x The player abscissa
     * @param {int} y The player ordinate
     * @returns {void}
     */
    this.create = function(name, sprite, direction, x, y){
        this.name = name;
        this.animation.setSprite(sprite);
        this.animation.setDirection(direction);
        this.animation.setAction("STAND");
        this.coords.x = x;
        this.coords.y = y;
    };
    
    /**
     * Change the map on which is the player
     * @param {String} author The map author
     * @param {String} name The map name
     * @returns {void}
     */
    this.setMap = function(author, name){
        this.map.author = author;
        this.map.title = name;
    };
    
    /**
     * Draw the player where he is
     * @returns {void}
     */
    this.draw = function(){
        this.animation.draw(this.coords.x, this.coords.y);
    };
    
    /**
     * Make the Player move if he is not currently moving
     * @param {int} direction The movement direction
     * @returns {void}
     */
    this.move = function(direction){
        if(this.isMoving)return;
        this.animation.setDirection(direction);
        if(this.user){
            var message = {'act':'move','player':this};
            var tosend = JSON.stringify(message);
            Socket.connection.send(tosend);
        }
        
        if(!this.canMove(direction)){
            return;
        }
        
        this.isMoving = true;
        this.animation.setAction("WALK");
        this.doMove(direction);
    };
    
    /**
     * Animate a movement in 10 steps
     * @param {int} direction The movement direction
     * @returns {void}
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
            this.checkOnPnj();
        }
        if(this.isMoving) setTimeout(function(thisObj){thisObj.doMove(direction)},50,this);
    };
    
    /**
     * Check if a player can move in the given direction
     * @param {int} direction The movement direction
     * @returns {Boolean} Return true if the player can move
     */
    this.canMove = function(direction){
        switch(direction){
            case 'UP':case 1:
                if(this.coords.y == 1 || 
                    Map.checkObstacle(new Coords(this.coords.x,this.coords.y-1)))return false;
                return true;
                break;
            case 'DOWN':case 2:
                if(this.coords.y == Map.height || 
                    Map.checkObstacle(new Coords(this.coords.x,this.coords.y+1)))return false;
                return true;
                break;
            case 'LEFT':case 3:
                if(this.coords.x == 1 || 
                    Map.checkObstacle(new Coords(this.coords.x-1,this.coords.y)))return false;
                return true;
                break;
            case 'RIGHT':case 0:
                if(this.coords.x == Map.width || 
                    Map.checkObstacle(new Coords(this.coords.x+1,this.coords.y)))return false;
                return true;
                break;
            default:
                return false;
        }
    };
    
    /**
     * Action key pressed, if there is an action in front of player, launch it
     * @returns {void}
     */
    this.act = function(){
        if(!this.user)return;
        var direction = this.animation.direction;
        var coords = new Coords(this.coords.x,this.coords.y);
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
        Map.actPnj(coords, 'act');
    };
    
    /**
     * Check if the player is on a PNJ, if it's the case, launch the walk action
     * @returns {void}
     */
    this.checkOnPnj = function(){
        if(!this.user)return;
        Map.actPnj(this.coords, 'walk');
    };
    
    /**
     * Change the Map for the player
     * @param {String} _author The map author
     * @param {String} _name The map name
     * @param {Coords} _coords The new coords
     * @returns {void}
     */
    this.changeMap = function(_author, _name, _coords){
        if(!this.user){
            Map.removePlayer(this); 
            return;
        }
        if(this.user){
            var oldMap = {author:Map.author,title:Map.title};
            this.coords = new Coords(_coords.x,_coords.y);
            
            
            Map.loadMap(_author, _name);
            
            PLAYER = Map.addPlayer(this.name, this.animation.sprite, this.animation.direction, this.coords);
            PLAYER.user = true;
            
            var newMap = {author:Map.author,title:Map.title};
            
            var message = {'act':'changeMap','player':PLAYER,'oldMap':oldMap,'newMap':newMap};
            var tosend = JSON.stringify(message);
            Socket.connection.send(tosend);
            
        }
    };
    
    /**
     * Return the distance between the player and another one
     * @param {Player} player The Player to compare
     * @returns {int} The distance between the players
     */
    this.distance = function(player){
        return this.coords.distance(player.coords);
    };
};