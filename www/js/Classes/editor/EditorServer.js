var EditorServer = function()
{
    EditorServer.connection = io.connect('http://localhost:8080/editor');
    EditorServer.connection.on('connect', function(){
        console.log("Server connection established");
    });
    
    EditorServer.connection.on('error', function(error)
    {
        var data = JSON.parse(error);
        console.log(data.message);
    });
    
    EditorServer.launchMapEditor = function()
    {
        var message = {};
        EditorServer.connection.emit('loadMapEditor', message);
    };
    
    EditorServer.connection.on('loadMapEditor', function(message)
    {
        var data = JSON.parse(message);
        GameEngineInstance.doLaunch(data.files, data.maps);
    });
    
    EditorServer.loadMap = function(id)
    {
        var message = {id:id};
        EditorServer.connection.emit('loadMap', message);
    };
    
    EditorServer.connection.on('load_map', function(message)
    {
        var data = JSON.parse(message);
        GameEngineInstance.doLoadMap(data.map);
    });
};