var QuestsManager = function(){
    QuestsManager.allQuests = {};
    QuestsManager.mapQuests = {};
    
    /**
     * Refresh all the quests in the array
     * @param {Array} quests Quest Array
     * @returns {void}
     */
    QuestsManager.refresh = function(quests){
            for(var i in quests){
                var id = quests[i]._id;
                if(QuestsManager.allQuests[id])
                    QuestsManager.allQuests[id].activate();
                if(QuestsManager.mapQuests[id])
                    QuestsManager.mapQuests[id].activate();
            }
    };
    
    /**
     * Add quests in the mapQuests array and refresh them
     * @param {Array} quests
     * @returns {void}
     */
    QuestsManager.addMapQuests = function(quests){
        for(var i in quests){
            var tmpQuest = new Quest();
            tmpQuest.hydrate(quests[i]);
            QuestsManager.mapQuests[tmpQuest._id] = tmpQuest;
            delete tmpQuest;
        }
        QuestsManager.refresh(QuestsManager.mapQuests);
    };
    
    /**
     * Add quests in the allQuests array
     * @param {Array} quests
     * @returns {void}
     */
    QuestsManager.addAllQuests = function(quests){
        for(var i in quests){
            var tmpQuest = new Quest();
            tmpQuest.hydrate(quests[i]);
            QuestsManager.allQuests[tmpQuest._id] = tmpQuest;
            delete tmpQuest;
        }
    };
};