var settings = {
	login: "PL3"
}

var net = require('net');
var snakeEngine = require("./snakeEngine");
//var util = require('util');

var client = new net.Socket();
client.connect(9977, 'localhost', function() {
	console.log('Connected');
});

var waitForPlayerId = false;
var playerId;

var buffer = '';
client.on('data', function(data) {
	//console.log('Received: ' + data);
	if (data.toString().indexOf("\r\n") === -1){
	//	console.log("partial data retrieved")

		buffer = buffer + data;
		return;
	}

	if (buffer) {
	//	console.log("completing buffer")
		data = buffer + data;
		buffer = '';
	}
	else {
//		console.log("full line received")
	}
	
	if (data.toString().indexOf('ID') > -1)
	{
		waitForPlayerId = true;
		sendCommand(settings.login);
	}
	else if (waitForPlayerId)
	{
		console.log('Saveing playerId: ' + data);
		playerId = data.toString();
		waitForPlayerId = false;
	} 
	else
	{
		try {
			var gameBoardState = JSON.parse(data);

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