Vue.config.devtools = true
var scheduler = new Vue({

    // The parent DOM node
    el: '#main-content',

    //Model
    data: {
        resources: [],
        tasks: []
    },

    methods: {
        addResource: function(){
            var oldID = 0;
            if(this.resources.length > 0){
                //Get current max ID
                for(var i = 0; i < this.resources.length; i++){
                    if(this.resources[i].id > oldID){
                        var oldID = this.resources[i].id;
                    }
                }
            }

            var newID = oldID + 1;

            this.resources.push({
                id: newID,
                name: 'Resource'+newID,
                qualifiers:[{
                    icon: 'star',
                    isActive: false
                    },{
                    icon: 'favorite',
                    isActive: false
                    },{
                    icon: 'fiber_manual_record',
                    isActive: false
                    }]
            });
        },
        removeResource: function(id){
            //find first instance in array with id
            var found = false;
            var foundIndex = -1;
            for(var i = 0; i < this.resources.length && !found; i++){
                if(this.resources[i].id === id){
                    found = true;
                    foundIndex = i;
                }
            }
            
            //If resource was found, remove it
            if(foundIndex > -1){
                this.resources.splice(foundIndex, 1);
            }
        },
        toggleQualifier(qualifier){
            qualifier.isActive = !qualifier.isActive;
        }
    }
});