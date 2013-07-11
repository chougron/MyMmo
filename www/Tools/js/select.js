var Select = function(){
    this.object = $('#select_tileset');
    
    this.init = function(){
        for(var i=0; i<tileSets.length; i++){
            var name = tileSets[i].src.split("/").pop();
            this.object.append($('<option>', {value : i}).text(name)); 
        }
        var _this = this;
        this.object.change(function(){
            TILESET.loadTileSet(_this.object.get(0).value);
            MAP.setTileSet(_this.object.get(0).value);
        });
    }
    
    this.setSelected = function(number){
        this.object.get(0).selectedIndex = number;
    }
}