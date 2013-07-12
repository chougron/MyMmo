var newPNJ = function(){
    this.sprite = null;
    this.onWalk = function(parameters){
            PLAYER.changeMap(
                parameters.map.author, 
                parameters.map.name, 
                parameters.zone, 
                parameters.coords);
        };
    this.onAct = function(parameters){alert("Quelle belle porte !"); _object.sprite = 'test';};
    this.onInit = function(parameters){};
    this.onClose = function(parameters){};
}