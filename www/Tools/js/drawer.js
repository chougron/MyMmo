var Drawer = function(){
    
    this.tileSet;
    
    /**
     * Renseigne un nouveau tileSet
     * @param number le numéro du tileSet (débute à 0)
     */
    this.setTileSet = function(number){
        this.tileSet = tileSets[number];
        this.tileSetWidth = this.tileSet.width / 32;
    }
    /**
     * Dessine une partie du tileSet (value) à l'endroit voulu sur le context (x,y)
     * @param x l'abscisse (en tiles) de la destination
     * @param y l'ordonnée (en tiles) de la destination
     * @param value la valeur du tile
     * @param canvas le canvas où dessiner
     */
    this.drawFromTileSet = function(x,y,value,canvas){
        var context = canvas.getContext("2d");
        var xSourceN = value % this.tileSetWidth;
        if(xSourceN == 0) xSourceN = this.tileSetWidth;
        var ySourceN = Math.ceil(value / this.tileSetWidth);
        var xSource = (xSourceN - 1) * 32;
        var ySource = (ySourceN - 1) * 32;
        var xContext = (x - 1) * 32;
        var yContext = (y - 1) * 32;
        context.drawImage(this.tileSet, xSource, ySource, 32, 32, xContext, yContext, 32, 32);
    }
    
    /**
     * Dessine le tileSet sur le canvas
     * @param canvas le canvas sur lequel dessiner
     */
    this.drawTileSet = function(canvas){
        var context = canvas.getContext("2d");
        
        var width = this.tileSet.width;
        var height = this.tileSet.height;
        context.drawImage(this.tileSet, 0, 0, width, height, 0, 0, width, height);
    }
    
    /**
     * Dessine la grille sur le canvas choisi
     * @param canvas le canvas
     */
    this.drawGrid = function(canvas){
        var context = canvas.getContext("2d");

        var width = canvas.width;
        var height = canvas.height;
        context.beginPath();
        context.lineWidth = 1;
        context.strokeStyle = "#000";

        for(var x=32; x<canvas.width; x+=32){
            context.moveTo(x,0);
            context.lineTo(x,height);
        }
        for(var y=32; y<canvas.height; y+=32){
            context.moveTo(0,y);
            context.lineTo(width,y);
        }
        context.stroke();
    }
    
    /**
     * Dessine le rectangle de selection sur le canvas choisi
     * @param topLeftPoint le point de départ
     * @param dCoords les variations de coordonées (grandeur)
     * @param canvas le canvas sur lequel dessiner
     */
    this.drawSelectionRectangle = function(topLeftPoint, dCoords, canvas){
        var context = canvas.getContext("2d");
        var x = (topLeftPoint.x - 1) * 32;
        var y = (topLeftPoint.y - 1) * 32;
        var dx = (dCoords.x * 32) + 32;
        var dy = (dCoords.y * 32) + 32;
        
        context.beginPath();
        context.lineWidth = 3;
        context.strokeStyle = "#f00";
        //Ligne du haut
        context.moveTo(x,y);
        context.lineTo(x+dx,y);
        //Ligne de droite
        context.lineTo(x+dx,y+dy);
        //Ligne du bas
        context.lineTo(x,y+dy);
        //Ligne de gauche
        context.lineTo(x,y);
        context.stroke();
    }
    
    /**
     * Dessine un fond blanc sur le canvas choisi
     * @param topLeftPoint le point de départ
     * @param dCoords les variations de coordonnées (grandeur)
     * @param canvas le canvas sur lequel dessiner
     */
    this.drawWhite = function(topLeftPoint, dCoords, canvas){
        var context = canvas.getContext("2d");
        var x = (topLeftPoint.x - 1) * 32;
        var y = (topLeftPoint.y - 1) * 32;
        var dx = (dCoords.x * 32) + 32;
        var dy = (dCoords.y * 32) + 32;
        
        context.fillStyle = "#fff";
        context.fillRect(x,y,dx,dy);  
    }
    
    /**
     * Dessine un petit carré rouge pour indiquer un obstacle
     * @param x l'abscisse
     * @param y l'ordonnée
     * @param canvas le canvas sur lequel dessiner
     */
    this.drawObstacle = function(x, y, canvas){
        var context = canvas.getContext("2d");
        var xContext = (x - 1) * 32;
        var yContext = (y - 1) * 32;
        context.fillStyle = "rgba(255,0,0,0.3)";
        context.fillRect(xContext, yContext, 32, 32);
    }
    
    /**
     * Dessine un petit carré blanc transparent pour faire paraître distants
     * les calques du dessous
     * @param x l'abscisse
     * @param y l'ordonnée
     * @param canvas le canvas sur lequel dessiner
     */
    this.lightBackground = function(x, y, canvas){
        var context = canvas.getContext("2d");
        var xContext = (x - 1) * 32;
        var yContext = (y - 1) * 32;
        context.fillStyle = "rgba(255,255,255,0.5)";
        context.fillRect(xContext, yContext, 32, 32);
    }
}