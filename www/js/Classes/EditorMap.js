var EditorMap = function(){
    
    EditorMap.width = 20;
    EditorMap.height = 15;    
    
    /**
     * Create an empty array for the obstacles or tiles
     * @returns {Array}
     */
    EditorMap.emptyArray = function(){
        var array = new Array();
        for(var i=0; i<EditorMap.width * EditorMap.height; i++)
            array[i]=0;
        return array;
    };
    
    EditorMap.tileSets = new Array(0,0,0);
    EditorMap.obstacles = EditorMap.emptyArray();
    EditorMap.tiles = new Array(EditorMap.emptyArray(),
                                EditorMap.emptyArray(),
                                EditorMap.emptyArray());
    
    EditorMap.currentLayer = 0;
    
    
    EditorMap.draw = function(){
        var untilLayer = (this.currentLayer == -1 ? 2 : this.currentLayer);
        Drawer.drawWhite({x:1,y:1}, {x:20,y:15}, Canvas);
        for(var i=0; i<EditorMap.width * EditorMap.height; i++){
            for(var layer=0; layer<=untilLayer; layer++){
                Drawer.setTileSet(this.tileSets[layer]);
                var value = this.tiles[layer][i];
                var x = (i+1) % EditorMap.width;
                if(x == 0) x = EditorMap.width;
                var y = Math.ceil((i+1) / EditorMap.width);
                if(layer == untilLayer && layer != 0)
                    Drawer.lightBackground(x,y,Canvas);
                if(value != 0){ //Si value à 0, il n'y a rien sur cette case sur ce layer
                    Drawer.drawFromTileSet(x, y, value,Canvas);
                }
                if(layer == 2 && this.currentLayer == -1 && this.obstacles[i])
                    Drawer.drawObstacle(x,y,Canvas);
                //If there is an obstacle, draw it
            }
        }
        Drawer.drawGrid(Canvas);
    };
    
    /**
     * Save the Map to a file
     * @returns {void}
     */
    EditorMap.save = function(){
        var name = $("#mapName").get(0).value;
        if(name == "")return;
        
        var message = {act:'saveMap',name:name,tiles:this.tiles,tileSets:this.tileSets,obstacles:this.obstacles};
        var tosend = JSON.stringify(message);
        Socket.connection.send(tosend);
        alert("Map Saved"); //TODO: wait for the server confirmation
    };
    
    /**
     * Set a new TileSet for the current Layer
     * @param {int} number The number of the new TileSet
     * @returns {void}
     */
    EditorMap.setTileSet = function(number){
        EditorMap.tileSets[this.currentLayer] = number;
        EditorMap.draw();
    };
    
    /**
     * Change the current Layer
     * @param {int} number The new Layer
     * @returns {void}
     */
    EditorMap.setCurrentLayer = function(number){
        EditorMap.currentLayer = number;
        EditorMap.draw();
        $("#number_1").attr('src', "img/editor/1_blue.png");
        $("#number_2").attr('src', "img/editor/2_blue.png");
        $("#number_3").attr('src', "img/editor/3_blue.png");
        $("#obstacles").attr('src', "img/editor/obs_blue.png");
        if(number != -1){
            $("#number_"+(number+1)).attr('src', "img/editor/"+(number+1)+"_red.png");
            TileSet.loadTileSet(EditorMap.tileSets[number]);
            SELECT.setSelected(EditorMap.tileSets[number]);
        }
        else $("#obstacles").attr('src', "img/editor/obs_red.png");
    };
    
    /**
     * Add obstacles to the selected tiles
     * @param {Coords} topLeft The start Coords (in tiles)
     * @param {Coords} dCoords The delta Coords
     * @returns {void}
     */
    EditorMap.placeObstable = function(topLeft, dCoords){
        for(var i=0;i<=dCoords.x;i++){
            for(var j=0;j<=dCoords.y;j++){
                var x = topLeft.x + i;
                var y = topLeft.y + j;
                var index = EditorMap.width * (y-1) + x - 1;
                EditorMap.obstacles[index] = !EditorMap.obstacles[index];
            }
        }
        EditorMap.draw();
    };
    
    /**
     * Put the selection of the TileSet on the Map
     * @param {Coords} topLeft The starting Coords
     * @param {Coords} dCoords The delta Coords
     * @returns {void}
     */
    EditorMap.placeSelection = function(topLeft, dCoords){
        if(TileSet.topLeftCoords.x == null)return;
        var nbX = Math.ceil( (dCoords.x+1) / (TileSet.dCoords.x+1) ); //Nombre de fois que l'on peut dessiner le patern suivant les x
        var nbY = Math.ceil( (dCoords.y+1) / (TileSet.dCoords.y+1) ); //Nombre de fois que l'on peut dessiner le patern suivant les y
        for(var i=0; i<nbX; i++){
            for(var j=0; j<nbY; j++){
                //On retaille suivant les x si ça dépasse
                var restantX = (EditorMap.width - topLeft.x - i + 1);
                var dessinX = (restantX < TileSet.dCoords.x+1) ? restantX : TileSet.dCoords.x;
                var restantY = (EditorMap.height - topLeft.y - j + 1);
                var dessinY = (restantY < TileSet.dCoords.y+1) ? restantY : TileSet.dCoords.y;
                //Alors on parcourt le pattern et on attribue les cases
                for(var caseX=0; caseX <= dessinX; caseX++){
                    for(var caseY = 0; caseY <= dessinY; caseY++){
                        var number = TileSet.getTileNumber(caseX, caseY);
                        var x = topLeft.x + i*(TileSet.dCoords.x + 1) + caseX;
                        var y = topLeft.y + j*(TileSet.dCoords.y + 1) + caseY;
                        var index = EditorMap.width * (y-1) + x - 1;
                        EditorMap.tiles[EditorMap.currentLayer][index] = number;
                    }
                }
            }
        }
        this.draw();
    };
};