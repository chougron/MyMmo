<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title></title>
        <base href="/MyMmo/"/>
        <script src="Shared/js/jquery.js"></script>
        <script src="Client/js/init.js"></script>
        <script src="Shared/js/log.js"></script>
        <script src="Client/js/canvas.js"></script>
        <script src="Client/js/map.js"></script>
        <script src="Client/js/drawer.js"></script>
        <script src="Shared/js/spriteL.js"></script>
        <script src="Client/js/animation.js"></script>
        <script src="Client/js/motor.js"></script>
        <script src="Client/js/player.js"></script>
        <script src="Client/js/events.js"></script>
        <script src="http://localhost:8080/socket.io/socket.io.js"></script>
        <script src="Client/js/socket.js"></script>
        <script src="Client/js/pnj.js"></script>
    </head>
    <body>
        <center>
        <canvas id="canvas" style="border: 1px solid black;"></canvas><br>
        <input type="text" id="pseudo"></input>
        <a onclick="clickme();this.onclick='';">Rejoindre</a>
        </center>
        <script>
        $(document).ready(function() {
            var INIT = new Init();
            INIT.launch();
        });
        </script>
        <script>
            var clickme = function(){
                var ninit = new Init();
                var pseudo = $("#pseudo").val();
                ninit.rejoindre(pseudo);
            }
        </script>
    </body>
</html>
