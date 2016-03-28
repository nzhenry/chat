
// init socket
var socket = io();
var user;

function composerSubmit() {
	var input = $('#messageInput');
	if(input.val()) {
		sendMessage(input.val());
		input.val('');
	}
	input.focus();
}

function sendMessage(msg) {
	$('#messages').append($('<li>').text(user.name + ': ' + msg));
	socket.emit('chatMessage', {user: user, msg: msg});
}

$("#messageInput").keyup(function(args) {
	 // 13 is ENTER
	 if (args.which === 13) {
			composerSubmit();
	 }
}); 

// attach to form submit event
$('composer button').click(function(){
	composerSubmit();
});

// attach to socket 'chatMessage' event
socket.on('chatMessage', function(data){
	$('#messages').append($('<li>').text(data.user.name + ': ' + data.msg));
});

// attach to socket 'connect' event
socket.on('connect', function(){

	// get the user object from a cookie
	user = Cookies.getJSON('user');
	if(user) {
		$('#usernameInput').val(user.name);
	} else {
		socket.emit('newUser', user);
	}
});

// attach to socket 'welcome' event
socket.on('welcome', function(usr) {
	user = usr;
	$('#usernameInput').val(user.name);
	Cookies.set('user', user);
});