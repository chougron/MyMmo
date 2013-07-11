var Drawer = function(){
    
    this.tileSet;
    this.tileSetWidth;
    
    /**
     * Renseigne un nouveau tileSet
     * @param number le numéro du tileSet (débute à 0)
     */
    this.setTileSet = function(number){
        this.tileSet = CANVAS.tileSets[number];
        if(CANVAS.tileSets[number] != undefined)
        this.tileSetWidth = CANVAS.tileSets[number].width / 32;
    }
    /**
     * Dessine une partie du tileSet (value) à l'endroit voulu sur le context (x,y)
     * @param x l'abscisse (en tiles) de la destination
     * @param y l'ordonnée (en tiles) de la destination
     * @param value la valeur du tile
     */
    this.drawFromTileSet = function(x,y,value){
        var xSourceN = value % this.tileSetWidth;
        if(xSourceN == 0) xSourceN = this.tileSetWidth;
        var ySourceN = Math.ceil(value / this.tileSetWidth);
        var xSource = (xSourceN - 1) * 32;
        var ySource = (ySourceN - 1) * 32;
        var xContext = (x - 1) * 32;
        var yContext = (y - 1) * 32;
        CONTEXT.drawImage(this.tileSet, xSource, ySource, 32, 32, xContext, yContext, 32, 32);
    }
    
    /**
     * Dessine une animation à l'endroit voulu sur le context (x,y)
     * @param x l'abscisse (en tiles) de la destination
     * @param y l'ordonnée (en tiles) de la destination
     * @param image le sprite de l'animation
     * @param ligne la ligne du sprite
     * @param cpt le compteur de l'animation
     */
    this.drawAnimation = function(x,y,image,ligne,cpt){
        var xSource = cpt * 32;
        var ySource = ligne * 48;
        var xContext = (x - 1) * 32;
        var yContext = (y - 1) * 32 - 16;
        CONTEXT.drawImage(image, xSource, ySource, 32, 48, xContext, yContext, 32, 48);
    }
}