var Map = function(){
    this.object;
    
    this.zones = new Array();
    this.tileSets = new Array(0,0,0);
    this.zone = {'x':0, 'y':0};
    this.obstacles = new Array();
    
    this.currentLayer = 0;
    
    this.init = function(){
        this.object = $("#map").get(0);
        
        this.object.width = 640;
        this.object.height = 480;
        
        DRAWER.drawGrid(this.object);
        
        //On construit des tableaux vides
        this.zones[0] = new Array();
        this.zones[0][0] = this.makeEmptyZone();
        this.obstacles[0] = new Array();
        this.obstacles[0][0] = this.makeEmptyObstacle();
        
        this.setMouseActions();
    }
    
    /**
     * Dessine la zone sur le canvas de map
     */
    this.drawZone = function(){
        var untilLayer = (this.currentLayer == -1 ? 2 : this.currentLayer);
        DRAWER.drawWhite({x:1,y:1}, {x:20,y:15}, this.object);
        for(var i=0; i<15*20; i++){
            for(var layer=0; layer<=untilLayer; layer++){
                DRAWER.setTileSet(this.tileSets[layer]);
                var value = this.zones[this.zone.x][this.zone.y][layer][i];
                var x = (i+1) % 20;
                if(x == 0) x = 20;
                var y = Math.ceil((i+1) / 20);
                if(layer == untilLayer && layer != 0)DRAWER.lightBackground(x,y,this.object);
                if(value != 0){ //Si value à 0, il n'y a rien sur cette case sur ce layer
                    DRAWER.drawFromTileSet(x, y, value,this.object);
                }
                if(layer == 2 && this.currentLayer == -1 && this.obstacles[this.zone.x][this.zone.y][i])DRAWER.drawObstacle(x,y,this.object);
                //S'il y a un obstacle, il faut le représenter
            }
        }
        DRAWER.drawGrid(this.object);
    }
    
    /**
     * Place la selection du TileSet sur la map
     * @param topLeft le point topLeft selectionné de la map
     * @param dCoords la grandeur de la selection sur la map
     */
    this.placeSelection = function(topLeft, dCoords){
        if(TILESET.topLeftCoords.x == null)return;
        var nbX = Math.ceil( (dCoords.x+1) / (TILESET.dCoords.x+1) ); //Nombre de fois que l'on peut dessiner le patern suivant les x
        var nbY = Math.ceil( (dCoords.y+1) / (TILESET.dCoords.y+1) ); //Nombre de fois que l'on peut dessiner le patern suivant les y
        for(var i=0; i<nbX; i++){
            for(var j=0; j<nbY; j++){
                //On retaille suivant les x si ça dépasse
                var restantX = (20 - topLeft.x - i + 1);
                var dessinX = (restantX < TILESET.dCoords.x+1) ? restantX : TILESET.dCoords.x;
                var restantY = (15 - topLeft.y - j + 1);
                var dessinY = (restantY < TILESET.dCoords.y+1) ? restantY : TILESET.dCoords.y;
                //Alors on parcourt le pattern et on attribue les cases
                for(var caseX=0; caseX <= dessinX; caseX++){
                    for(var caseY = 0; caseY <= dessinY; caseY++){
                        var number = TILESET.getTileNumber(caseX, caseY);
                        var x = topLeft.x + i*(TILESET.dCoords.x + 1) + caseX;
                        var y = topLeft.y + j*(TILESET.dCoords.y + 1) + caseY;
                        var index = 20*(y-1) + x - 1;
                        this.zones[this.zone.x][this.zone.y][this.currentLayer][index] = number;
                    }
                }
            }
        }
        this.drawZone();
    }
    
    /**
     * Place les listeners des évènements souris
     */
    this.setMouseActions = function(){
        var _this = this;
        var coordsDown;
        var coordsUp;
        
        $(this.object).mousedown(function(e){
            coordsDown = _this.coordsToTile(_this.getRealCoords(e.pageX, e.pageY));
        });
        
        $(this.object).mouseup(function(e){
            coordsUp = _this.coordsToTile(_this.getRealCoords(e.pageX, e.pageY));
            var topLeft = {x:null,y:null};
            var dCoords = {x:null,y:null};
            topLeft.x = Math.min(coordsDown.x, coordsUp.x);
            topLeft.y = Math.min(coordsDown.y, coordsUp.y);
            dCoords.x = Math.abs(coordsDown.x - coordsUp.x);
            dCoords.y = Math.abs(coordsDown.y - coordsUp.y);
            if(_this.currentLayer != -1)_this.placeSelection(topLeft, dCoords);
            else _this.placeObstable(topLeft, dCoords); //Layer à -1 = obstacles
        });
    }
    
    this.getRealCoords = function(pageX, pageY){
        var x = pageX - this.object.offsetLeft;
        var y = pageY - this.object.offsetTop;
        return {x:x, y:y};
    }
    
    this.coordsToTile = function(coords){
        var x = Math.floor(coords.x/32)+1;
        var y = Math.floor(coords.y/32)+1;
        return {x:x,y:y};
    }
    
    this.makeEmptyZone = function(){
        var array = new Array();
        for(var i=0; i<3; i++){ //Les 3 layers
            array[i] = new Array();
            for(var j=0; j<15*20; j++)array[i][j]=0;
        }
        return array;
    }
    
    this.save = function(){
        var name = $("#mapName").get(0).value;
        if(name == "")return;
        var message = {act:'saveMap',name:name,zones:this.zones,tileSets:this.tileSets,obstacles:this.obstacles};
        var tosend = JSON.stringify(message);
        CONNECTION.send(tosend);
        alert("Carte Sauvegardée.");
    }
    
    this.setTileSet = function(number){
        this.tileSets[this.currentLayer] = number;
        this.drawZone();
    }
    
    this.setCurrentLayer = function(number){
        this.currentLayer = number;
        this.drawZone();
        $("#number_1").attr('src', "www/Tools/img/1_blue.png");
        $("#number_2").attr('src', "www/Tools/img/2_blue.png");
        $("#number_3").attr('src', "www/Tools/img/3_blue.png");
        $("#obstacles").attr('src', "www/Tools/img/obs_blue.png");
        if(number != -1){
            $("#number_"+(number+1)).attr('src', "www/Tools/img/"+(number+1)+"_red.png");
            TILESET.loadTileSet(this.tileSets[number]);
            SELECT.setSelected(this.tileSets[number]);
        }
        else $("#obstacles").attr('src', "www/Tools/img/obs_red.png");
    }
    
    this.placeObstable = function(topLeft, dCoords){
        for(var i=0;i<=dCoords.x;i++){
            for(var j=0;j<=dCoords.y;j++){
                var x = topLeft.x + i;
                var y = topLeft.y + j;
                var index = 20*(y-1) + x - 1;
                this.obstacles[this.zone.x][this.zone.y][index] = !this.obstacles[this.zone.x][this.zone.y][index];
            }
        }
        this.drawZone();
    }
    
    this.makeEmptyObstacle = function(){
        var array = new Array();
        for(var i=0; i<15*20; i++)array[i]=0;
        return array;
    }
}