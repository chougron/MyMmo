var ItemsEditor = function(){
    ItemsEditor.items = {};
    ItemsEditor.itemSet;
    ItemsEditor.canvas = {};
    
    ItemsEditor.currentItem;
    
    /**
     * Function to launch the Item Editor
     * @returns {void}
     */
    ItemsEditor.launch = function(){
        ItemsEditor.canvas = $("#itemset_canvas").get(0);
        ItemsEditor.canvas.context = ItemsEditor.canvas.getContext('2d');
        
        FilesManager();
        FilesManager.getFromDB();
        Drawer();
        
        $(ItemsEditor.canvas).mousedown(function(e){
            var PO = $(this).parent().offset(); //Parent Offset
            var coordsDown = new Coords().pxToTile(getRealCoords(e.pageX - PO.left,e.pageY - PO.top,ItemsEditor.canvas), FilesManager.itemsets[ItemsEditor.itemSet].width);
            console.log(coordsDown);
            var mapWidth = FilesManager.itemsets[ItemsEditor.itemSet].img.width / FilesManager.itemsets[ItemsEditor.itemSet].width; //In tiles
            var index = coordsDown.toIndex(mapWidth ,true);
            
            var item = ItemsEditor.items[ItemsEditor.currentItem];
            item.itemSet = ItemsEditor.itemSet;
            item.setNumber = index;
            
            $("#itemset").css('display','none');
            ItemsEditor.changeItem(ItemsEditor.currentItem);
            
            delete item;
        });
    };
    
    /**
     * Function launched when the files are loaded
     * @returns {void}
     */
    ItemsEditor.ready = function(){
        ItemsEditor.setItemSet(FilesManager.itemsets[Object.keys(FilesManager.itemsets)[0]]._id);
        
        var message = {act : 'getAllItems'};
        var toSend = JSON.stringify(message);
        Socket.connection.send(toSend);
        
        //Initialize the select object for the icon selector
        var select = $("#itemset_select");
        for(var id in FilesManager.itemsets){
            var tempOption = document.createElement('option');
            $(tempOption).attr('value', id);
            $(tempOption).html(FilesManager.itemsets[id].name);
            select.append(tempOption);
        }
        select.change(function(){
            ItemsEditor.setItemSet(select.val());
        });
    };
    
    /**
     * Get all the items from the DB
     * @param {Array} items
     * @returns {void}
     */
    ItemsEditor.doGetAllItems = function(items){
        var itemList = $("#item_list");
        
        itemList.empty();
        
        for(var i=0; i<items.length; i++){
            var item = items[i];
            var tempItem = new Item();
            tempItem.hydrate(item);
            ItemsEditor.items[item._id] = tempItem;
            
            var tempLi = document.createElement('li');
            $(tempLi).attr('id',item._id);
            $(tempLi).attr('class','item');
            $(tempLi).click(function(){
                ItemsEditor.changeItem(this.id);
            });
            
            ItemsEditor.setBackground($(tempLi), tempItem);
            
            delete tempItem;
            
            itemList.append(tempLi);
        }
        
        //Add our plus element
        var plus = document.createElement('li');
        $(plus).attr('id','add_item');
        $(plus).attr('class','item');
        $(plus).html("+");
        $(plus).click(function(){
        var item = new Item();
            item.name = 'Nom';
            item.itemSet = FilesManager.itemsets[Object.keys(FilesManager.itemsets)[0]]._id;
            item.setNumber = 0;
            ItemsEditor.items['new'] = item;
            ItemsEditor.changeItem('new');
        });
        itemList.append(plus);
    };
    
    /**
     * Set an item icon background to an element
     * @param {jQuery DOM Element} element The element to put the background to
     * @param {Item} item The item to display
     * @returns {void}
     */
    ItemsEditor.setBackground = function(element,item){
        var width = FilesManager.itemsets[item.itemSet].width;
        var height = FilesManager.itemsets[item.itemSet].height;
        element.css('width',width);
        element.css('height',height);

        var pxCoords = item.getCoordsInTile();
        var src = FilesManager.itemsets[item.itemSet].img.src;
        var backgroundAttr = 'url('+src+') -'+pxCoords.x+'px -'+pxCoords.y+'px';
        element.css('background',backgroundAttr);
    };
    
    /**
     * Change the itemset for the editor
     * @param {String} id The ID of the itemset
     * @returns {void}
     */
    ItemsEditor.setItemSet = function(id){
        ItemsEditor.itemSet = id;
        
        var canvasObject = ItemsEditor.canvas;
        canvasObject.width = FilesManager.itemsets[ItemsEditor.itemSet].img.width;
        canvasObject.height = FilesManager.itemsets[ItemsEditor.itemSet].img.height;
        
        Drawer.setItemSet(id);
        Drawer.drawTileSet(ItemsEditor.canvas);
        Drawer.drawGrid(ItemsEditor.canvas);
    };
    
    /**
     * Change the current item and display the item window to edit it
     * @param {String} id The ID of the item
     * @returns {void}
     */
    ItemsEditor.changeItem = function(id){
        ItemsEditor.currentItem = id;
        var item = ItemsEditor.items[id];
        
        //Put the good icon
        var item_icon = $("#item_icon");
        ItemsEditor.setBackground(item_icon,item);
        item_icon.click(function(){
            $("#itemset").css('display','block');
        });
        
        //Put the good name
        $("#item_name").val(item.name);
        
        //Put the good itemset
        $("#item_itemset").val(FilesManager.itemsets[item.itemSet].name);
        
        //Put the good setNumber
        $("#item_setnumber").val(item.setNumber);
        
        //Display the item window
        $("#item").css('display','block');
    };
};

$(document).ready(function(){
    Socket();
    ItemsEditor();
    ItemsEditor.launch();
    
    $("#item_form").submit(function(){
        var item = ItemsEditor.items[ItemsEditor.currentItem];
        item.name = $("#item_name").val();
        
        item.save();
        
        $("#item").css('display','none');
        return false;
    });
    
    $("#add_item").click(function(){
        var item = new Item();
        item.name = 'Nom';
        item.itemSet = FilesManager.itemsets[Object.keys(FilesManager.itemsets)[0]]._id;
        item.setNumber = 0;
        ItemsEditor.items['new'] = item;
        ItemsEditor.changeItem('new');
    });
});