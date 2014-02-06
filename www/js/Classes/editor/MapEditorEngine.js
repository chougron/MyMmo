var MapEditorEngine = EditorEngine.extend(
{
    init : function()
    {
        this._super();
        this.loadAMap_dialog = $("#loadAMap");
        this.editorBlock = $("#editorBlock");
        this.canvasMap = $("#canvasMap").get(0);
        this.drawerMap = new Drawer2D(this.canvasMap);
        this.canvasTileset = $("#canvasTileset").get(0);
        this.selectTileset = $("#selectTileset").get(0);
        this.drawerTileset = new Drawer2D(this.canvasTileset);
        
        this.map = new Map();
        
        this.options = {
            title       : $("#options_title").get(0),
            author      : $("#options_author").get(0),
            width       : $("#options_width").get(0),
            height      : $("#options_height").get(0),
            tilesize    : $("#options_tilesize").get(0),
        };

        $(".refreshValues").each(function(index,element){
            $(element).click(function(){
                GameEngineInstance.refreshValues();
            });
        });
        
        this.defaults = {
            title       :   "New Map",
            width       :   20,
            height      :   15,
            tileSize    :   32
        };
    },
    launch : function(id)
    {
        this._super(id);
        EditorServer.launchMapEditor();
        this._cleanInputs();
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
        
        $(this.options.title).val(this.map.title);
        $(this.options.author).val(this.map.author);
        $(this.options.width).val(this.map.width);
        $(this.options.height).val(this.map.height);
        $(this.options.tilesize).val(this.map.tileSize);
        
        this.canvasMap.width = this.map.width * this.map.tileSize;
        this.canvasMap.height = this.map.height * this.map.tileSize;
        $(this.editorBlock).show();
        this.map.draw(this.drawerMap);
    },
    refreshValues : function()
    {
        this.map.title = $(this.options.title).val();
        this.map.author = $(this.options.author).val();
        this.map.width = $(this.options.width).val(); //TODO: When changing, reordering the map ?
        this.map.height = $(this.options.height).val();
        this.map.tileSize = $(this.options.tilesize).val(); //TODO: When changing, deleting the tilesets used ? Or in the draw func, don't display if not same size ?
        
        this.canvasMap.width = this.map.width * this.map.tileSize;
        this.canvasMap.height = this.map.height * this.map.tileSize;
        
        this._refreshTilesetsSelect(this.imageFileManager.getTilesetFromSize(this.map.tileSize));
        
        this.map.draw(this.drawerMap);
    },
    newMap : function()
    {
        $(this.options.title).val(this.defaults.title);
        $(this.options.author).val(this.user_id);
        $(this.options.width).val(this.defaults.width);
        $(this.options.height).val(this.defaults.height);
        $(this.options.tilesize).val(this.defaults.tileSize);
        
        this.map = new Map();
        this.refreshValues();
        
        $(this.editorBlock).show();
    },
    save : function()
    {
        alert("save");
    },
    _cleanInputs : function()
    {
        $(this.options.title).val("");
        $(this.options.author).val("");
        $(this.options.width).val("");
        $(this.options.height).val("");
        $(this.options.tilesize).val("");
    },
    /**
     * @param {Array<_id : name>} tilesets The tilesets we can choose
     */
    _refreshTilesetsSelect : function(tilesets)
    {
        $(this.selectTileset).empty();
        for(var i in tilesets)
        {
            $(this.selectTileset).append('<option value="'+i+'">'+tilesets[i]+'</option>');
        }
        //Draw the first one
    }
});