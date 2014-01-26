var mongo = require('mongodb'),
        Server = mongo.Server,
        Db = mongo.Db;

var communication;
var game;

var ObjectID = require('mongodb').ObjectID;

var dbServer = new Server('localhost', 27017, {auto_reconnect : true});
var db = new Db('test', dbServer, {safe : false});


var dbInit = require('./dbInit');

var newPlayer = {
    name        :   "camille",
    isMoving    :   false,
    coords      :   {x:6,y:11}
};

db.open(function(err, db)
{
    if(!err)
    {
        db.authenticate('root', 'root', function(){
            //Initialize the DB with objects for testing
//            dbInit.imageFile(db);
            console.log((new Date()) + " DB connected.");
            
            db.collection('pnj', function(e,collection)
            {
                collection.find().toArray(function(e,pnjs)
                {
                    db.collection('map', function(e,collection)
                    {
                        collection.find().toArray(function(e,maps)
                        {
                            game.launch(pnjs,maps);
                            
                            
                            db.collection('imageFile', function(err, collection)
                            {
                                collection.find({},{_id:1}).toArray(function(err, items)
                                {
                                    newPlayer.animation = {sprite:items[4]._id,direction:2,action:2};
                                    newPlayer.map = maps[0]._id;
                                });
                            });
                        });
                    });
                });
            });
        });
    }
    else
    {
        console.log("DB opening error :");
        console.log(err);
    }
});

module.exports = function(_communication, _game)
{
    communication = _communication;
    game = _game;
    return module.exports;
};

module.exports.loadGame = function(user_id, index)
{
    db.collection('imageFile', function(e,collection)
    {
        collection.find({}).toArray(function(e, imageFiles)
        {
            var files = {
                sprites: new Array(),
                tilesets: new Array(),
                itemsets: new Array()
            };
            var file = imageFiles.shift();
            while(file)
            {
                files[file.type+"s"].push(file);
                file = imageFiles.shift();
            }
            db.collection('quest', function(e,collection)
            {
                collection.find({active:true}).toArray(function(e,quests)
                {
                    db.collection('variable', function(e,collection)
                    {
                        collection.find({user: user_id}).toArray(function(e,variables)
                        {
                            communication.loadGame(files,quests,variables,index);
                        });
                    });
                });
            });
        });
    });
};

module.exports.enterGame = function(user_id, index)
{
    db.collection('player', function(e,collection)
    {
        collection.findOne({_id : user_id}, function(e, res)
        {
            if(res == null)
            {
                var insert = newPlayer;
                newPlayer._id = user_id;
                collection.update(
                    {},
                    insert,
                    {upsert: true},
                    function(e,doc)
                    {
                        game.enterGame(insert,index);
                    }
                );
            }
            else 
            {
                game.enterGame(res, index);
            }
        });
        
//        collection.findAndModify(
//           { _id: user_id },
//           [['_id','asc']],
//           {$setOnInsert: insert},
//            {new: true,   // return the modified (or upserted) doc, not the original.
//            upsert: true} // insert the document if it does not exist
//        , function(e, user)
//        {
//            console.log(user + ", " + user_id);
//            game.enterGame(user,index);
//        });
    });
};

module.exports.save = function(table, item)
{
    db.collection(table, function(e,collection)
    {
        collection.update(
                {_id : ObjectID(item._id)},
                {$set:item},
                {upsert:true}
        );
    });
};

module.exports.savePlayer = function(player)
{
    db.collection('player', function(e,collection)
    {
        collection.update(
                {_id : player._id},
                player,
                {upsert:true}
        );
    });
};

module.exports.saveVariable = function(variable,user)
{
    db.collection('variable', function(e,collection)
    {
        variable.user = user;
        collection.update(
                {name : variable.name, user: user},
                variable,
                {upsert:true}
        );
    });
};

module.exports.loadMapEditor = function(index)
{
    db.collection('imageFile', function(e,collection)
    {
        collection.find({}).toArray(function(e, imageFiles)
        {
            var files = {
                sprites: new Array(),
                tilesets: new Array(),
                itemsets: new Array()
            };
            var file = imageFiles.shift();
            while(file)
            {
                files[file.type+"s"].push(file);
                file = imageFiles.shift();
            }
            db.collection('map', function(e,collection)
            {
                collection.find({},{_id:1,title:1}).toArray(function(e,maps)
                {
                    communication.loadMapEditor(files,maps,index);
                });
            });
        });
    });
};

module.exports.loadById = function(table, id, index)
{
    db.collection(table, function(e,collection)
    {
        collection.findOne({_id:ObjectID(id)}, function(e,element)
        {
            communication.loadById(table,element,index)
        });
    });
};