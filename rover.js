let Command = require('./command.js');
let Message = require('./message.js');

class Rover {
   constructor(position){
     this.position = position;
     this.mode = 'NORMAL';
     this.generatorWatts = 110;
   }
  receiveMessage(message){
    let mode = this.mode;
    let position = this.position;
    let generatorWatts = this.generatorWatts;
    let results = [];

    for (let i = 0; i < (message.commands).length; i++){
      let command = message.commands[i];
      let type = command.commandType;
      let commandValue = command.value;

      if (type === 'MODE_CHANGE' && commandValue === 'LOW_POWER'){
        this.mode = 'LOW_POWER';
        mode = 'LOW_POWER';
         results.push({completed: true});
      } else if (type === 'MODE_CHANGE' && commandValue === 'NORMAL'){
          this.mode = 'NORMAL';
          mode = 'NORMAL';
      } else if (type === 'STATUS_CHECK' && commandValue === undefined){
           results.push({completed: true, roverStatus: {mode, generatorWatts, position}});
      } else if (type === 'MOVE' && mode === 'LOW_POWER'){
          results.push({completed:false});
      } else if (type === 'MOVE' && mode === 'NORMAL'){
          position = commandValue;
          results.push({completed: true});
      } else {
        results.push({completed:false});
        results.push({error:'Command unknown'});
      }
    } return {message: message.name, results: results}
  } 
}  
module.exports = Rover;

