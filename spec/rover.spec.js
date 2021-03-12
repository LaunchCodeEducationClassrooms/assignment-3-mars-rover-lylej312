const Rover = require('../rover.js');
const Message = require('../message.js');
const Command = require('../command.js');

// // NOTE: If at any time, you want to focus on the output from a single test, feel free to comment out all the others.
// //       However, do NOT edit the grading tests for any reason and make sure to un-comment out your code to get the autograder to pass.


describe("Rover class", function() {

  it('constructor sets position and default values for mode and generatorWatts', function(){
    let rover = new Rover(98382);   
    expect(rover.position).toEqual(98382);
  });

  it('response returned by receiveMessage contains name of message', function(){
    let commands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('STATUS_CHECK')];
    let message = new Message('Test message with two commands', commands);
    let rover = new Rover(98382);    // Passes 98382 as the rover's position.
    let response = rover.receiveMessage(message);
    expect(response.message).toEqual(message.name);
  });

  it('response returned by receiveMessage includes two results if two commands are sent in the message', function(){
    let commands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('STATUS_CHECK')];
    let message = new Message('Test message with two commands', commands);
    let rover = new Rover(98382);   
    let response = rover.receiveMessage(message);
    let results = response.results;
    expect((results).length).toEqual(2);
  });

  it('responds correctly to status check command', function(){
    let commands = [new Command('STATUS_CHECK')];
    let message = new Message('Test message with two commands', commands);
    let rover = new Rover(98382);    // Passes 98382 as the rover's position.
    let response = rover.receiveMessage(message);
    let results = response.results;
    expect(results[0].roverStatus).toEqual({mode: 'NORMAL', generatorWatts: 110, position: 98382});
  });

  it('responds correctly to mode change command', function(){
    let commands = [new Command('MODE_CHANGE', 'LOW_POWER')];
    let message = new Message('Test message with one command', commands);
    let rover = new Rover(98382);   
    let response = rover.receiveMessage(message);
    let mode = rover.mode;
    let confirmation = response.results[0];
    expect(mode).toEqual('LOW_POWER');
    expect(confirmation).toEqual({completed: true});
  });

  it('responds with false completed value when attempting to move in LOW_POWER mode', function(){
    let rover = new Rover(98382);
    let newCommands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('MOVE', '87382097')];
    let newMessage = new Message('Test message with two commands', newCommands);
    let newResponse = rover.receiveMessage(newMessage);
    let newResults = newResponse.results;
    let result = newResults[1];
    expect(result).toEqual({completed: false});
  });

  it('responds with position for move command', function(){
    let rover = new Rover(98382);   
    let moveCommand = [new Command('MOVE', 97382097)];
    let message = new Message('Test message for move command', moveCommand);
    let response = rover.receiveMessage(message);
    let confirmation = response.results;
    expect(confirmation[0]).toEqual({completed:true});
  });

  // BONUS MISSION:

  // it('completed false and a message for an unknown command', function(){
  //   let rover = new Rover(98382);
  //   let falseCommand = [new Command('LAUNCH')];
  //   let message = new Message('Test message for false command', falseCommand);
  //   let response = rover.receiveMessage(message);
  //   let results = response.results;
  //   expect(results[0]).toEqual({completed:false});
  //   expect(results[1]).toEqual({error:'Command unknown'});
  // });

});
