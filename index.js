var settings = {
    serverAddress:'localhost',
    serverPort: 9977,
    login: "PL3"
}

var net = require('net');
var snakeEngine = require("./snakeEngine");
var _ = require('lodash');
//var util = require('util');

var client = new net.Socket();
client.connect(settings.serverPort, settings.serverAddress, function() {
    console.log('Connected');
});

var waitForPlayerId = false;
var playerId;

var buffer = '';
client.on('data', function(data) {
    // console.log('Received: ' + data);
    
    // Processing chanks of data
    if (data.toString().indexOf("\r\n") === -1){
        buffer = buffer + data;
        return;
    }

    if (buffer) {
        data = buffer + data;
        buffer = '';
    }
    
    // Actuall communication with server
    if (data.toString().indexOf('ID') > -1)
    {
        waitForPlayerId = true;
        sendCommand(settings.login);
    }
    else if (waitForPlayerId)
    {
        console.log('Saveing playerId: ' + data);
        playerId = _.trim(data.toString());
        waitForPlayerId = false;
    } 
    else
    {
        try {
            var gameBoardState = JSON.parse(data);
            
            //console.log('Processing: ', gameBoardState);

            var engine = new snakeEngine(playerId);
            var nextMove = engine.getNextMove(gameBoardState);
            sendCommand(nextMove);
        }
        catch (err) {
            console.log("Error: ", err);
        }
    }
});

function sendCommand(command) {
    console.log('Sending: ' + command);
    client.write(command + '\r\n');
}

client.on('close', function() {
    console.log('Connection closed');
});