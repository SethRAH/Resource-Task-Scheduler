Vue.config.devtools = true;

Vue.component('time-input', {
    template: `
        <span>
            <table>
                <tbody>
                    <tr>
                        <td class="text-center line-height-micro"><i class="material-icons md-8 md-dark clickable" v-on:click="incrementHour(1)">keyboard_arrow_up</i></td>
                        <td></td>
                        <td class="text-center line-height-micro"><i class="material-icons md-8 md-dark clickable" v-on:click="incrementMinute(1)">keyboard_arrow_up</i></td>
                        <td class="text-center line-height-micro"><i class="material-icons md-8 md-dark clickable" v-on:click="togglePM()">keyboard_arrow_up</i></td>
                    </tr>
                    <tr>
                        <td class="text-center line-height-mini">{{ hours | twoDigit }}</td>
                        <td>:</td>
                        <td class="text-center line-height-mini">{{ minutes | twoDigit }}</td>
                        <td class="text-center line-height-mini">{{ isPM ? "PM" : "AM" }}</td>
                    </tr>
                    <tr>
                        <td class="text-center line-height-micro"><i class="material-icons md-8 md-dark clickable" v-on:click="incrementHour(-1)">keyboard_arrow_down</i></td>
                        <td></td>
                        <td class="text-center line-height-micro"><i class="material-icons md-8 md-dark clickable" v-on:click="incrementMinute(-1)">keyboard_arrow_down</i></td>
                        <td class="text-center line-height-micro"><i class="material-icons md-8 md-dark clickable" v-on:click="togglePM()">keyboard_arrow_down</i></td>
                    </tr>
                </tbody>
            </table>
        </span>
    `,
    props: {
        value: {
            type: Number,
            default: 540
        }
    },
    data: function() {
        var defaults = {
            hours: 9,
            minutes: 00,
            isPM: false
        }

        if(this.value !== undefined){
            var isPM = this.value/720 > 0.99999999;
            var minutes = this.value % 60;
            var hours = Math.floor(this.value/60) % 12;
            if(hours === 0) { hours = 12; }

            return {hours: hours, minutes: minutes, isPM: isPM };
        }
        return defaults;
    },
    filters:{
        twoDigit: function (value){
            if(!value) return '00';
            var formatted = value.toString();
            if(formatted.length < 2){
                for(var i = 0; formatted.length < 2; i++){
                    formatted = '0' + formatted;
                }
            }
            return formatted;
        }
    },
    methods: {
        incrementMinute: function(incrementor){
            var newMinutes = this.minutes + incrementor;
            if(newMinutes > 59){
                this.incrementHour(1);
                newMinutes = newMinutes % 60;
            }
            else if(newMinutes < 0){
                var numMinutesUntilPositive = Math.abs(Math.floor(newMinutes/60));
                newMinutes += (numMinutesUntilPositive * 60);
                newMinutes = newMinutes % 60;

                this.incrementHour(-1);
                newMinutes = newMinutes % 60;
            }

            this.minutes = newMinutes;
            this.emitCurrentValue();
        },
        incrementHour: function(incrementor){
            var newHours = this.hours + incrementor;
            if(newHours > 12){
                newHours = (newHours % 12);
            }
            else if(newHours < 1){
                var numHoursUntilPositive = Math.abs(Math.floor(newHours/12));
                newHours += (numHoursUntilPositive * 12);
                newHours = newHours % 12;
                if(newHours === 0){ newHours = 12; }
            }
            //Need separate logic for AM/PM flip since our time system is messed up
            if(
                (incrementor > 0 && newHours === 12 ) 
            ||  (incrementor < 0 && newHours === 11) ){
                this.isPM = !this.isPM;
            }

            this.hours = newHours;
            this.emitCurrentValue();
        },
        togglePM: function(){
            this.isPM = !this.isPM;

            this.emitCurrentValue();
        },
        emitCurrentValue: function(){
            var hoursInMinutes = 0;
            var amPmInMinutes = 0;
            if(this.hours != 12){
                hoursInMinutes = this.hours * 60;
            }

            if(this.isPM){
                amPmInMinutes = 720;
            }

            var timeInMinutes = hoursInMinutes + this.minutes + amPmInMinutes;

            this.$emit('input', timeInMinutes);

        }
    }
});

Vue.component('duration-input', {
    template: `
        <span>
            <table>
                <tbody>
                    <tr>
                        <td class="text-center line-height-micro"><i class="material-icons md-8 md-dark clickable" v-on:click="incrementHour(1)">keyboard_arrow_up</i></td>
                        <td></td>
                        <td class="text-center line-height-micro"><i class="material-icons md-8 md-dark clickable" v-on:click="incrementMinute(1)">keyboard_arrow_up</i></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td class="text-center line-height-mini">{{ hours | twoDigit }}</td>
                        <td class="">&nbsp;Hours&nbsp;</td>
                        <td class="text-center line-height-mini">{{ minutes | twoDigit }}</td>
                        <td class="">&nbsp;Minutes&nbsp;</td>
                    </tr>
                    <tr>
                        <td class="text-center line-height-micro"><i class="material-icons md-8 md-dark clickable" v-on:click="incrementHour(-1)">keyboard_arrow_down</i></td>
                        <td></td>
                        <td class="text-center line-height-micro"><i class="material-icons md-8 md-dark clickable" v-on:click="incrementMinute(-1)">keyboard_arrow_down</i></td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        </span>
    `,
    props: {
        value: {
            type: Number,
            default: 120
        }
    },
    data: function() {
        var defaults = {
            hours: 2,
            minutes: 0
        }

        if(this.value !== undefined){
            var minutes = this.value % 60;
            var hours = Math.floor(this.value/60);

            return {hours: hours, minutes: minutes };
        }
        return defaults;
    },
    filters:{
        twoDigit: function (value){
            if(!value) return '00';
            var formatted = value.toString();
            if(formatted.length < 2){
                for(var i = 0; formatted.length < 2; i++){
                    formatted = '0' + formatted;
                }
            }
            return formatted;
        }
    },
    methods: {
        incrementMinute: function(incrementor){
            var newMinutes = this.minutes + incrementor;
            if(newMinutes > 59){
                this.incrementHour(1);
                newMinutes = newMinutes % 60;
            }
            else if(newMinutes < 0){
                var numMinutesUntilPositive = Math.abs(Math.floor(newMinutes/60));
                newMinutes += (numMinutesUntilPositive * 60);
                newMinutes = newMinutes % 60;

                this.incrementHour(-1);
                newMinutes = newMinutes % 60;
            }

            this.minutes = newMinutes;
            this.emitCurrentValue();
        },
        incrementHour: function(incrementor){
            var newHours = this.hours + incrementor;
            if(newHours < 1){
                newHours = 0;
            }

            this.hours = newHours;
            this.emitCurrentValue();
        },
        emitCurrentValue: function(){
            var hoursInMinutes = this.hours * 60;
            var timeInMinutes = hoursInMinutes + this.minutes;

            this.$emit('input', timeInMinutes);

        }
    }
});

var scheduler = new Vue({

    // The parent DOM node
    el: '#main-content',

    //Model
    data: {
        resources: [],
        tasks: []
    },
    computed: {
        schedules: function(){
            if(this.resources === undefined || this.resources.length === 0 
                || this.tasks === undefined || this.tasks.length === 0 ){
                return [];
            }
            else{
                //-------------------
                //Raw Permute options
                //-------------------
                var count = Math.pow(this.resources.length, this.tasks.length) - 1;
                // Initialize the array of possible schedules
                var results = [];
                // Initialize the index counter and the temp array
                var tempArray = [];
                var curIndexArray = [];
                for(var i = 0; i<this.tasks.length; i++){
                    curIndexArray.push(0);
                    tempArray.push({task: this.tasks[i], resource: this.resources[0]});
                }
                // Push the first temp array into results;
                results.push(tempArray);
                // Loop through the rest of the permutations and add to the array
                for(var i = 0; i < count; i++){
                    // Increment counter array
                    var highestIncrementableIndex = curIndexArray.length - 1;
                    var highestIncrementableIndexFound = false;
                    for(var j = highestIncrementableIndex; j >= 0 && !highestIncrementableIndexFound; j--){
                        if(curIndexArray[j] < this.resources.length-1){
                            highestIncrementableIndexFound = true;
                            highestIncrementableIndex = j;
                            curIndexArray[j]++;
                        }
                    }

                    //Reset all the higher indexes to 0
                    for(var j = highestIncrementableIndex + 1; j < curIndexArray.length; j++){
                        curIndexArray[j] = 0;
                    }

                    //build out temp array and push to results
                    tempArray = [];
                    for(var j = 0; j < this.tasks.length; j++){
                        tempArray.push({task: this.tasks[j], resource: this.resources[curIndexArray[j]]});
                    }

                    results.push(tempArray);
                }

                //-------------------------
                //Filter By Qualifiers
                //-------------------------

                results = results.filter(function(schedule){
                    var invalidScheduleTasks =  schedule.filter(function(scheduleTask){
                        var scheduleTaskValid = true;
                        //for each qualifier that is true, check to see if the corresponding qualifier is true for the resource
                        for(var i = 0; i < scheduleTask.task.qualifiers.length; i++){
                            if(scheduleTask.task.qualifiers[i].isActive && !scheduleTask.resource.qualifiers[i].isActive){
                                scheduleTaskValid = false;
                            }
                        }
                        return !scheduleTaskValid;
                    });

                    return invalidScheduleTasks === undefined || invalidScheduleTasks.length < 1
                });

                //-------------------------
                //Filter By Availability
                //-------------------------
                var tempResources = this.resources
                results = results.filter(function(schedule){
                    var resourceDoubleBooked = false;
                    for(var i = 0; i < tempResources.length && !resourceDoubleBooked; i++){
                        var resourceAllocationTimespans = [];
                        for(var j = 0; j < schedule.length && !resourceDoubleBooked; j++){
                            if(schedule[j].resource === tempResources[i]){
                                //this task/resource on the schedule is valid for the resource we are looking at
                                // go ahead and check overlap. If overlap, flag as double booked, otherwise add timespan to allocation
                                var tempStart = schedule[j].task.startTime;
                                var tempEnd = tempStart + schedule[j].task.duration;

                                for(var k = 0; k < resourceAllocationTimespans.length && !resourceDoubleBooked; k++){
                                    // if overlap
                                    if(tempStart < resourceAllocationTimespans[k].endTime && tempEnd >= resourceAllocationTimespans[k].startTime){
                                        resourceDoubleBooked = true;
                                    }
                                }

                                resourceAllocationTimespans.push({startTime: tempStart, endTime: tempEnd});
                            }
                        }
                    }
                    return !resourceDoubleBooked;
                });

                //-----------------------------
                //Remove Equivalent schedules
                //-----------------------------
                var distilledResults = [];

                results = results.map(function(itm){
                    for(var i = 0; i < results; i++){
                        //Will be used to translate resources into their equivalence alias
                        var resourceDictionary = [];
                        //Will be used to quickly figure out newer equivalence aliases
                        var equivalentIncrementor = [];

                        


                    }
                });
                


                //-------------------------------------------------
                //Add Stats for Summary and for Scoring/Filtering
                //-------------------------------------------------
                //  Assumes that overlapping time allocations have
                //  already been filtered out
                //-------------------------------------------------
                results = results.map(function(itm){
                    //Grab Resource Stats
                    var resourceStats = {
                        totalWorkTime: 0,
                        totalDownTime: 0,
                        avgWorkTime: 0,
                        avgDownTime: 0
                    };

                    var resources = [];
                    for(var i = 0; i < tempResources.length; i++){
                        resources.push({
                                rID: tempResources[i].id,
                                name: tempResources[i].name,
                                allocationTimespans: [],
                                earliestStart: 0,
                                latestEnd: 0,
                                totalWorkTime: 0,
                                totalDownTime: 0 
                            })
                    }

                    for(var i = 0; i < itm.length; i++){
                        //for each assigned task, get the resource index for the assigned resource
                        var resourceIndex = resources.indexOfConditional(function(el){
                            return el.rID === itm[i].resource.id;
                        });

                        //add allocation to resource
                        var tempStart = itm[i].task.startTime;
                        var tempEnd = tempStart + itm[i].task.duration;

                        resources[resourceIndex].allocationTimespans.push({startTime: tempStart, endTime:tempEnd});
                    }

                    resources = resources.map(function(resource){
                        var sortedAllocation = resource.allocationTimespans.sort(function(a,b){return a.startTime - b.startTime});
                        var earliest = 0;
                        var latest = 0;
                        var totalWork = 0;
                        var totalDown = 0;
                        if(sortedAllocation.length > 0){
                            earliest = sortedAllocation[0].startTime;
                            latest = sortedAllocation[sortedAllocation.length - 1].endTime;
                            for(var i = 0; i< sortedAllocation.length; i++){
                                totalWork += (sortedAllocation[i].endTime - sortedAllocation[i].startTime);
                                if(i > 0){
                                    totalDown += (sortedAllocation[i].startTime - sortedAllocation[i-1].endTime);
                                }
                            }

                        }
                        
                        return {
                            rID: resource.rID,
                            name: resource.name,
                            allocationTimespans: sortedAllocation,
                            earliestStart: earliest,
                            latestEnd: latest,
                            totalWorkTime: totalWork,
                            totalDownTime: totalDown
                        };
                    });

                    for(var i =0; i < resources.length; i++){
                        resourceStats.totalWorkTime += resources[i].totalWorkTime;
                        resourceStats.totalDownTime += resources[i].totalDownTime;
                    }

                    resourceStats.avgWorkTime = resourceStats.totalWorkTime / resources.length;
                    resourceStats.avgDownTime = resourceStats.totalDownTime / resources.length;

                    return { resourceStats: resourceStats, schedule: itm, resources: resources };
                });

                return results;
            }
        }
    },
    filters:{
        minutesToTime: function (value){
            if(!value) return 'N/A';
            //Get Hours String
            var nbrHours = Math.floor(value/60) % 12;
            var stringHours = nbrHours.toString();
            if(nbrHours == 0){stringHours = '12'}
            if(stringHours.length < 2){
                for(var i = 0; stringHours.length < 2; i++){
                    stringHours = '0' + stringHours;
                }
            }

            //Get Minutes String
            var nbrMinutes = value % 60;
            var stringMinutes = nbrMinutes.toString();
            if(stringMinutes.length < 2){
                for(var i = 0; stringMinutes.length < 2; i++){
                    stringMinutes = '0' + stringMinutes;
                }
            }

            //Get AM/PM
            var boolIsPM = value/720 > 0.99999999;
            var stringAmPm = 'AM';
            if(boolIsPM){ stringAmPm = 'PM'; }

            return stringHours + ':' + stringMinutes + ' '+stringAmPm;

        },
        minutesToDuration: function (value){
            if(!value) return 'N/A';
            //Get Hours String
            var nbrHours = Math.floor(value/60);
            var stringHours = nbrHours.toString();
            if(stringHours.length < 2){
                for(var i = 0; stringHours.length < 2; i++){
                    stringHours = '0' + stringHours;
                }
            }

            //Get Minutes String
            var nbrMinutes = value % 60;
            var stringMinutes = nbrMinutes.toString();
            if(stringMinutes.length < 2){
                for(var i = 0; stringMinutes.length < 2; i++){
                    stringMinutes = '0' + stringMinutes;
                }
            }

            return stringHours + ' hours ' + stringMinutes + ' minutes';

        }
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

            //Increment to get new ID
            var newID = oldID + 1;

            //Add new resource with new ID and defaults
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
        },
        addTask: function(){
          var oldID = 0;
          //Get current max hidden id
          for(var i = 0; i < this.tasks.length; i++){
              if(this.tasks[i].hiddenID > oldID){
                  var oldID = this.tasks[i].hiddenID;
              }
          } 

          //Increment to get new ID
          var newID = oldID + 1;

          //Add new task with new ID and defaults
          this.tasks.push({
              hiddenID: newID,
              name: "Task"+newID,
              startTime: 540,
              duration: 120,
              
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
        removeTask: function(id){
            //find first instance in array with id
            var found = false;
            var foundIndex = -1;
            for(var i = 0; i < this.tasks.length && !found; i++){
                if(this.tasks[i].hiddenID === id){
                    found = true;
                    foundIndex = i;
                }
            }

            //If task was found, remove it
            if(foundIndex > -1){
                this.tasks.splice(foundIndex, 1);
            }
        },
        toTwoDigitNumberFormat: function(value){
            if(!value) return '00';
            var formatted = value.toString();
            if(formatted.length < 2){
                for(var i = 0; formatted.length < 2; i++){
                    formatted = '0' + formatted;
                }
            }
            return formatted;
        },
        recursiveScheduleBuilder: function(scheduleOptions, currentTasks, currentResourceAllocations){
            var nextIndex = currentTasks.indexOfConditional(function(itm){ return itm.resource === undefined});
            
            //if all tasks are allocated, add to ScheduleOptions and return
            if(nextIndex < 0){
                var scheduleOption = {
                    tasks: currentTasks,
                    resourceAllocation: currentResourceAllocations
                };
                scheduleOptions.push(scheduleOption);
                return scheduleOptions;
            }
            //otherwise, for the next open task, call recursive for each valid possible resource choice, then return scheduleOptions
            else{
                var resourceOptions = [];
                //limit valid resources by qualifier
                resourceOptions = this.resources.filter(function(resource){
                    var valid = true;
                    for(var i = 0; i < resource.qualifiers.length && valid; i++){
                        if(this.currentTasks[nextIndex].qualifiers[i].isActive && !resource.qualifiers[i].isActive ){
                            valid = false;
                        }
                    }
                    return valid;
                });
                //limit valid resources by Availability
                resourceOptions = resourceOptions.filter(function(resource){
                    var valid = true;
                    
                    var tempStart = this.currentTasks[nextIndex].startTime;
                    var tempEnd = tempStart + this.currentTasks[nextIndex].duration;
                    var resourceIndex = currentResourceAllocations.indexOfConditional(function(itm){
                        return itm.rID === resource.id;
                    });
                    var resourceAllocationTimespans = currentResourceAllocations[resourceIndex];

                    for(var k = 0; k < resourceAllocationTimespans.length && valid; k++){
                        // if overlap
                        if(tempStart < resourceAllocationTimespans[k].endTime && tempEnd >= resourceAllocationTimespans[k].startTime){
                            valid = false;
                        }
                    }

                    return valid;
                });
                //if no resources, return scheduleOptions  (Dead End)

                //otherwise, iterate through resource options and call recursive. Update scheduleOptions prior to each call.
            }
        }
    }
});