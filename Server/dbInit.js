exports.imageFile = function(db){
    db.collection('imageFile', function(err, collection){
        collection.remove();
        collection.insert([
            {
                type      :'tileset',
                name      :'plaines.png',
                width     :'32',
                height    :'32'
            },
            {
                type      :'tileset',
                name      :'plaines_objets.png',
                width     :'32',
                height    :'32'
            },
            {
                type      :'tileset',
                name      :'murs.png',
                width     :'32',
                height    :'32'
            },
            {
                type      :'tileset',
                name      :'mobilier.png',
                width     :'32',
                height    :'32'
            },
            {
                type      :'sprite', //0 -> 4
                name      :'player.png',
                width     :'32',
                height    :'32'
            },
            {
                type      :'sprite', //1 -> 5
                name      :'paneau.png',
                width     :'32',
                height    :'32'
            },
            {
                type      :'itemset',
                name      :'IconSet2.png',
                width     :'32',
                height    :'32'
            },
            {
                type      :'itemset',
                name      :'IconSet.png',
                width     :'24',
                height    :'24'
            }
      ]);
    });
};

exports.pnj = function(db){
    db.collection('imageFile', function(err, collection){
        collection.find({},{_id:1}).toArray(function(err, items){
            db.collection('pnj', function(err, collection){
            collection.remove();
            collection.insert([
                {
                    animation:null,
                    map:{author:"u0000001", title:"ForestHouse"},
                    coords:{x:6,y:8},
                    block:false,
                    onWalk:"var NEWfONCTION = function(parameters){PLAYER.changeMap('u0000001','Maison',{x:11,y:12});}",
                    onAct:"var NEWfONCTION = function(parameters){this.speak(\"What a great door !\");}",
                    onInit:"var NEWfONCTION = function(parameters){}",
                    onClose:"var NEWfONCTION = function(parameters){}"
                },
                {
                    animation:null,
                    map:{author:"u0000001", title:"Maison"},
                    coords:{x:11,y:12},
                    block:false,
                    onWalk:"var NEWfONCTION = function(parameters){PLAYER.changeMap('u0000001','ForestHouse',{x:6,y:8});}",
                    onAct:"var NEWfONCTION = function(parameters){this.speak(\"What a great door !\");}",
                    onInit:"var NEWfONCTION = function(parameters){}",
                    onClose:"var NEWfONCTION = function(parameters){}"
                },
                {
                    animation : {sprite:items[5]._id,direction:2,action:2},
                    map:{author:"u0000001", title:"ForestHouse"},
                    coords:{x:7,y:9},
                    block:true,
                    onWalk:"var NEWfONCTION = function(parameters){}",
                    onAct:"var NEWfONCTION = function(parameters){this.speak(\"Thierry's House.\");}",
                    onInit:"var NEWfONCTION = function(parameters){}",
                    onClose:"var NEWfONCTION = function(parameters){}"
                },
                {
                    animation : {sprite:items[4]._id,direction:2,action:2},
                    map:{author:"u0000001", title:"Maison"},
                    coords:{x:9,y:7},
                    block:true,
                    onWalk:"var NEWfONCTION = function(parameters){}",
                    onAct:"var NEWfONCTION = function(parameters){this.speak(\"Hello, I'm Thierry.\");}",
                    onInit:"var NEWfONCTION = function(parameters){}",
                    onClose:"var NEWfONCTION = function(parameters){}"
                }
            ]);
          });
        });
    });
};

exports.map = function(db){
    db.collection('imageFile', function(err, collection){
        collection.find({},{_id:1}).toArray(function(err, items){
            //ForestHouse
            var ForestHouse = {
                title       : 'ForestHouse',
                author      : 'u0000001',
                width       : 20,
                height      : 15,
                tileSets    : [items[0]._id,items[0]._id,items[1]._id],
                tiles       : [[50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,90,90,90,90,90,90,50,50,50,50,50,50,50,50,50,50,50,50,50,50,90,90,90,90,90,90,50,50,50,50,50,50,50,50,50,50,50,50,50,50,90,90,90,90,90,90,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,61,62,73,66,66,81,62,63,0,0,0,0,0,0,0,0,0,0,0,0,71,0,0,0,0,0,0,71,0,0,0,0,0,0,0,0,0,0,0,0,71,0,47,48,48,49,0,71,0,0,0,0,0,0,0,0,0,0,0,0,71,0,57,58,58,59,0,71,0,0,0,0,0,0,0,0,0,0,0,0,71,0,67,68,68,69,0,71,0,0,0,0,0,0,0,0,0,0,0,0,71,0,77,78,78,79,0,71,0,0,0,0,0,0,0,0,0,0,0,0,71,0,71,0,0,71,0,71,0,0,0,0,0,0,0,0,0,0,0,0,81,62,73,0,0,81,62,73,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[23,24,23,24,22,67,67,21,23,24,23,24,23,24,23,24,23,24,23,24,33,34,32,31,32,79,80,31,32,31,32,31,32,31,32,31,32,31,32,31,23,32,0,21,22,89,90,21,22,0,27,37,38,39,37,29,0,0,0,0,33,22,0,31,32,67,67,31,32,0,40,0,0,0,0,0,0,0,0,0,23,32,0,0,0,0,0,0,0,0,53,55,55,55,55,55,0,0,0,0,33,22,0,0,0,0,0,0,0,0,63,65,65,65,65,65,0,0,0,0,23,32,0,46,0,78,77,0,46,0,64,64,64,54,54,54,67,0,0,0,33,22,0,56,0,88,0,0,56,0,0,0,0,0,0,0,0,0,0,0,23,32,0,66,0,0,0,0,66,0,0,0,0,0,0,0,0,0,0,0,33,22,0,67,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,23,32,0,67,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,33,22,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,23,32,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,33,22,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,23,32,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,33]],
                obstacles   : [true,true,true,true,true,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,0,0,0,0,true,true,true,true,true,false,false,true,true,true,true,0,0,0,0,0,0,0,0,0,true,true,true,0,true,true,true,true,0,true,true,0,0,0,0,0,0,0,0,0,true,true,true,0,true,true,true,true,0,true,true,0,0,0,0,0,0,0,0,0,true,true,true,0,true,true,true,true,0,true,0,0,0,0,0,0,0,0,0,0,true,true,true,0,true,0,true,true,0,true,0,0,0,0,0,0,0,0,0,0,true,true,true,true,true,0,0,true,true,true,0,0,0,0,0,0,0,0,0,0,true,true,true,true,true,0,0,true,true,true,0,0,0,0,0,0,0,0,0,0,true,true,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,true,true,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,true,true,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,true,true,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,true,true,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
            };
            
            //Maison
            var Maison = {
                title       : 'Maison',
                author      : 'u0000001',
                width       : 20,
                height      : 15,
                tileSets    : [items[2]._id,items[0]._id,items[3]._id],
                tiles       : [[53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,41,2,2,2,2,2,2,2,42,53,53,53,53,53,53,53,53,53,53,53,1,11,12,12,12,12,12,13,3,53,53,53,53,53,53,53,53,53,53,53,1,21,22,22,22,22,22,23,3,53,53,53,53,53,53,53,53,53,53,53,1,53,53,53,53,53,53,53,3,53,53,53,53,53,53,53,53,53,53,53,1,53,53,53,53,53,53,53,3,53,53,53,53,53,53,53,53,53,53,53,1,53,53,53,53,53,53,53,3,53,53,53,53,53,53,53,53,53,53,53,1,53,53,53,53,53,53,53,3,53,53,53,53,53,53,53,53,53,53,53,1,53,53,53,53,53,53,53,3,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53,53],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,15,15,15,15,15,15,15,0,0,0,0,0,0,0,0,0,0,0,0,0,15,15,15,15,15,15,15,0,0,0,0,0,0,0,0,0,0,0,0,0,15,15,15,15,15,15,15,0,0,0,0,0,0,0,0,0,0,0,0,0,15,15,15,15,15,15,15,0,0,0,0,0,0,0,0,0,0,0,0,0,15,15,15,15,15,15,15,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,15,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,51,37,38,0,51,0,0,0,0,0,0,0,0,0,0,0,0,0,0,23,61,2,4,3,61,5,0,0,0,0,0,0,0,0,0,0,0,0,0,33,0,12,14,13,0,15,0,0,0,0,0,0,0,0,0,0,0,0,0,43,0,0,0,0,0,102,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,113,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]],
                obstacles   : [true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,0,true,true,true,0,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,0,0,0,0,0,true,true,true,true,true,true,true,true,true,true,true,true,true,true,0,0,0,0,0,0,0,true,true,true,true,true,true,true,true,true,true,true,true,true,0,0,0,0,0,0,0,true,true,true,true,true,true,true,true,true,true,true,true,true,true,0,0,0,0,0,0,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true]
            };
            
            db.collection('map', function(err, collection){
                collection.remove();
                collection.insert([ForestHouse,Maison]);
            });
        });
    });
};

exports.item = function(db){
    db.collection('imageFile', function(err, collection){
        collection.find({},{_id:1}).toArray(function(err,items){
            //Epee
            var Epee = {
                itemSet     : items[6]._id,
                setNumber   : 1,
                name        : 'Épee'
            };
            db.collection('item', function(err,collection){
                collection.remove();
                collection.insert([Epee]);
            });
        });
    });
};