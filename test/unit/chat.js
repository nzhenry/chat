var assert = require('assert');
var mockery = require('mockery');
var sinon = require('sinon');

var server = {foo:'bar'};
var msg = {foo2:'bar2'};
var name = 'foobar';
var uuid = 'uuid1';

var nodeuuid = { v4: sinon.stub().returns(uuid) };

var gobyGen = { generate: sinon.stub().returns(name) };
var goby = { init: sinon.stub().returns(gobyGen) };

var io = { on: sinon.spy() };
var socketio = sinon.stub().returns(io);
var socket = {
	on: sinon.spy(),
	broadcast: {
		emit: sinon.spy()
	},
	emit: sinon.spy()
};

before(function() {
	mockery.enable({
		useCleanCache: true,
		warnOnUnregistered: false
	});
	mockery.registerMock('socket.io', socketio);
	mockery.registerMock('goby', goby);
	mockery.registerMock('node-uuid', nodeuuid);
});

after(function() {
	mockery.disable();
});

describe('chat', function() {
	before(function() {
		require('../../lib/chat')(server); // init
		io.on.args[0][1](socket) // socket connect;
		socket.on.args[0][1](msg); // chat message
		socket.on.args[1][1](); // new user
	});

  describe('when init() is called', function () {
    it('should call goby.init()', function () {
	  	assert(goby.init.calledOnce);
    });
    
    it('should pass the server object to the socket.io module', function () {
    	assert(socketio.calledOnce);
    	assert(socketio.calledWith(server));
    });
    
    it('should attach to the socket connection event', function () {
	  	assert(io.on.calledOnce);
	  	assert(io.on.calledWith('connection'));
    });
  });
  
	describe("when a 'connection' event is received", function() {
    it("should attach to the 'chatMessage' event", function () {
	  	assert(socket.on.calledWith('chatMessage'));
    });
    
    it("should attach to the 'newUser' event", function () {
	  	assert(socket.on.calledWith('newUser'));
    });
	});
	
	describe("when a 'newUser' event is received", function() {
    it("should send a welcome message", function () {
	  	assert(socket.emit.calledOnce);
	  	assert(socket.emit.calledWith('welcome', { id: uuid, name: name }));
    });
	});
	
	describe("when a 'chatMessage' event is received", function() {
    it("should broadcast the message", function () {
	  	assert(socket.broadcast.emit.calledOnce);
	  	assert(socket.broadcast.emit.calledWith('chatMessage', msg));
    });
	});
});