var GameEngine = function()
{
    var canvasMap = $("#canvasMap").get(0);
    this.drawerMap = new Drawer2D(canvasMap);
    
    var canvasThings = $("#canvasThings").get(0);
    this.drawerThings = new Drawer2D(canvasThings);
    
    this.ecranJeu = $("#ecranJeu").get(0);
    
    this.map = new Map();
    this.thingManager = new ThingManager();
    this.questManager = new QuestManager();
    this.variableManager = new VariableManager();
    this.imageFileManager = new ImageFileManager();
    this.messageManager = new MessageManager();
    this.eventListener = new EventListener();
    this.graphicEngine = new GraphicEngine();
    
    this.loadGame = function()
    {
        new Server();
        var user = new User();
        user._id = $("#idJoueur").val();
        this.thingManager.user.hydrate(user);
        Server.loadGame();
    };
    
    this.doLoadGame = function(files, quests, variables)
    {
        var onLoad = function()
        {
            Server.enterGame();
        };
        this.variableManager.addVariables(variables);
        this.questManager.addQuests(quests);
        this.imageFileManager.load(files.sprites, files.tilesets, files.itemsets, onLoad);
    };
    
    this.changeMap = function(user, map, players, pnjs)
    {
        this.thingManager.reset();
        this.thingManager.user.hydrate(user);
        this.map.hydrate(map);
        this.thingManager.addPlayers(players);
        this.thingManager.addPnjs(pnjs);
        
        this.graphicEngine.drawMap();
        this.graphicEngine.start();
    };
    
    this.move = function(direction)
    {
        this.thingManager.user.move(direction);
    };
    
    this.action = function()
    {
        this.thingManager.user.act();
    };
};

var GameEngineInstance = null;