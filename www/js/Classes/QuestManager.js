var QuestManager = Class.extend(
{
    init : function()
    {
        this.quests = {};
    },
    /**
     * Refresh all the quests in the array
     * @param {Array<Quest>} quests Quest Array
     * @returns {void}
     */
    refresh : function(quests)
    {
        for(var i in quests)
        {
            var id = quests[i]._id;
            if(this.quests[id])
                this.quests[id].activate();
        }
    },
    /**
     * Refresh all the quests in the array
     * @param {Array<_id>} quests _id Array
     * @returns {void}
     */
    refreshById : function(quests)
    {
        for(var i in quests)
        {
            var id = quests[i];
            if(this.quests[id])
                this.quests[id].activate();
        }
    },
    /**
     * Refresh all the quests
     * @return {void}
     */
    refreshAll : function()
    {
        for(var i in this.quests)
        {
            this.quests[i].activate();
        }
    },
    /**
     * Add quests in the mapQuests array and refresh them
     * @param {Array<Quest>} quests
     * @returns {void}
     */
    addQuests : function(quests){
        for(var i in quests){
            var tmpQuest = new Quest();
            tmpQuest.hydrate(quests[i]);
            this.quests[tmpQuest._id] = tmpQuest;
            delete tmpQuest;
        }
    }
});