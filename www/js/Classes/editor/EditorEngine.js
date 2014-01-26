var EditorEngine = Class.extend(
{
    init : function(){
        this.user_id;
        this.thingManager = new EditorThingManager();
        this.questManager = new EditorQuestManager();
        this.imageFileManager = new ImageFileManager();
        this.messageManger = new MessageManager();
        this.eventListener = new EditorEventListener();
        new EditorServer();
    },
            
    launch : function(id)
    {
        this.user_id = id;
    },
            
    doLaunch : function(files,onLoad)
    {
        this.imageFileManager.load(files.sprites, files.tilesets, files.itemsets, onLoad);
    }
});

var GameEngineInstance = null;

$(document).ready(function()
{
    $(".dialog").each(function(index, dialog)
    {
        var close = $("<div class='dialog_close' />").click(function(element){
            $(element.target.parentElement).hide();
        });
        $(dialog).append(close);
    });
});