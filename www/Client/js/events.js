//GESTION DU CLAVIER
window.onkeydown = function(event) {
    var e = event || window.event;
    var key = e.which || e.keyCode;
    if(PLAYER != null){
    switch(key) {
	case 38 : case 122 : case 119 : case 90 : case 87 : // Flèche haut, z, w, Z, W
		PLAYER.move('UP');
		break;
	case 40 : case 115 : case 83 : // Flèche bas, s, S
		PLAYER.move('DOWN');
		break;
	case 37 : case 113 : case 97 : case 81 : case 65 : // Flèche gauche, q, a, Q, A
		PLAYER.move('LEFT');
		break;
	case 39 : case 100 : case 68 : // Flèche droite, d, D
		PLAYER.move('RIGHT');
		break;
        case 13 : //Touche Entrée
                PLAYER.act();
	default : 
		//alert(key);
		// Si la touche ne nous sert pas, nous n'avons aucune raison de bloquer son comportement normal.
		return true;
    }
    }
}