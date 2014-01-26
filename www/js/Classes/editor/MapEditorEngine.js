var MapEditorEngine = EditorEngine.extend(
{
    init : function()
    {
        this._super();
        this.loadAMap_dialog = $("#loadAMap");
        this.editorBlock = $("#editorBlock");
        this.canvasMap = $("#canvasMap").get(0);
        this.drawerMap = new Drawer2D(this.canvasMap);
        
        this.map = new Map();
        
        this.options = {
            title       : $("#options_title").get(0),
            author      : $("#options_author").get(0),
            width       : $("#options_width").get(0),
            height      : $("#options_height").get(0),
            tilesize    : $("#options_tilesize").get(0),
        };
    },
    launch : function(id)
    {
        this._super(id);
        EditorServer.launchMapEditor();
    },
    doLaunch : function(files,maps)
    {
        var mapList = $(this.loadAMap_dialog).children('ul')[0];
        for(var i in maps)
        {
            var map = $("<li>"+maps[i]._id+" :<br/>"+maps[i].title+"</li>");
            (function(id){
                $(map).click(function(element){
                    GameEngineInstance.loadMap(id);
                });
            })(maps[i]._id);
            $(mapList).append(map);
        }
        var onLoad = function()
        {
            console.log('steady');
        };
        this._super(files,onLoad);
    },
    clickLoad : function()
    {
        $(this.loadAMap_dialog).show();
    },
    loadMap : function(id)
    {
        $(this.loadAMap_dialog).hide();
        EditorServer.loadMap(id);
    },
    doLoadMap : function(map)
    {
        this.map.hydrate(map);
        
        this.options.title.innerHTML = this.map.title;
        this.options.author.innerHTML = this.map.author;
        this.options.width.innerHTML = this.map.width;
        this.options.height.innerHTML = this.map.height;
        this.options.tilesize.innerHTML = this.map.tileSize;
        
        this.canvasMap.width = this.map.width * this.map.tileSize;
        this.canvasMap.height = this.map.height * this.map.tileSize;
        $(this.editorBlock).show();
        this.map.draw(this.drawerMap);
    }
});