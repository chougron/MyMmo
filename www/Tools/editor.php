<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title></title>
        <base href="/mymmo/www/"/>
        <link rel="stylesheet" type="text/css" href="Tools/style/editor.css" media="screen" />
        <script src="Shared/js/jquery.js"></script>
        <script src="Tools/js/editor.js"></script>
        <script src="Tools/js/init.js"></script>
        <script src="Tools/js/tileSet.js"></script>
        <script src="Tools/js/map.js"></script>
        <script src="Tools/js/drawer.js"></script>
        <script src="Tools/js/select.js"></script>
        <script src="Shared/js/log.js"></script>
        <script src="Shared/js/spriteL.js"></script>
    </head>
    <body>
        <div id="div_container">
            <h1>Map Editor :</h1>
            <div id="div_map">
                <canvas id="map"></canvas>
            </div>
            <div id="div_menu">
                TileSet : 
                <select id="select_tileset">
                    <!--<option value="tile.png">plaines.png</option>-->
                </select><br>
                <canvas id="tileSet"></canvas><br>
                Layer : 
                <img src="Tools/img/1_red.png" id="number_1" class="layer_number" alt="1" title="1" onclick="if(MAP)MAP.setCurrentLayer(0);">
                <img src="Tools/img/2_blue.png" id="number_2" class="layer_number" alt="2" title="2" onclick="if(MAP)MAP.setCurrentLayer(1);">
                <img src="Tools/img/3_blue.png" id="number_3" class="layer_number" alt="3" title="3" onclick="if(MAP)MAP.setCurrentLayer(2);">
                <img src="Tools/img/obs_blue.png" id="obstacles" class="layer_number" alt="obs" title="obs" onclick="if(MAP)MAP.setCurrentLayer(-1);">
                </br>
            </div>
            <div id="options">
                <input type="text" id="mapName" style="width:90px;"/><a onclick="MAP.save();">Save</a>
            </div>
        </div>
        <script>
        $(document).ready(function() {
            INIT = new Init();
            INIT.launch();
        });
        </script>
    </body>
</html>
