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
        }
    }
});