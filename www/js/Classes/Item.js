var Item = function(){
    Thing.call(this);
    
    this.onMap; //Is the item displayed on map ?
    this.itemSetName = ''; //The itemset name it is in
    this.itemSet = ''; //The itemset nb it is in
    this.setNumber; //The number of the item in the itemset
    this.ID = 0; //The item ID (DB ID)
    this.name = '';
    
    this.save = function(){
        if(this.ID == 0)
            return;
        
        var object = {
            itemSetName :   this.itemSetName,
            setNumber   :   this.setNumber,
            name        :   this.name
        };
        var message = {act:''};
    };
};