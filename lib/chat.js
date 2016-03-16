var socketio = require('socket.io');
var uuid = require('node-uuid');
var goby = require('goby');

module.exports = function (server) {

	// init name generator
	var gobyGen = goby.init();
	
	// init socket.io
	var io = socketio(server);
	
	// attach to the socket connection event
	io.on('connection', onConnect);
		
	function onConnect(socket) {
		// when a 'chatMessage' event is received,
		// relay the message to all clients
		socket.on('chatMessage', function(msg){
			socket.broadcast.emit('chatMessage', msg);
		});

		// when a 'newUser' event is received, create a new
		// user object and send it back to the client
		socket.on('newUser', function(){
			var user = { id: uuid.v4(), name: randomName() };
			socket.emit('welcome', user);
		});
	}

	function randomName() {
		return gobyGen.generate(['adj', 'pre', 'suf']);
	};

}