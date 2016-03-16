'use strict';

var assert = require('assert');
var mockery = require('mockery');
var sinon = require('sinon');
var server = {foo:'bar'};
var msg = {foo2:'bar2'};
var name = 'foobar';
var uuid = 'uuid1';

beforeEach(function() {
	// hijack require(...)
	mockery.enable({
		warnOnUnregistered: false,
		warnOnReplace: false,
		useCleanCache: true
	});
});

afterEach(function() {
	// return require(...) to normal
	mockery.disable();
});

describe('the chat module', function () {
	var goby, io, socketio;
	
	beforeEach(function() {
		// create mocks
		goby = { init: sinon.spy() };
		io = { on: sinon.stub() };
		socketio = sinon.stub();
		socketio.withArgs(server).returns(io);

		// replace required modules with mocks
		mockery.registerMock('goby', goby);
		mockery.registerMock('socket.io', socketio);
	});

	it('should call goby.init()', function () {
		require('../../lib/chat')(server); // init
		assert(goby.init.calledOnce);
	});
	
	it('should pass the server object to the socket module', function () {
		require('../../lib/chat')(server); // init
		assert(socketio.called);
		assert(socketio.calledWith(server));
	});
	
	it("should attach a handler to socket module's 'connection' event", function () {
		require('../../lib/chat')(server); // init
		assert(io.on.calledOnce);
		assert(io.on.calledWith('connection'));
	});

	describe("the 'connection' event handler", function() {
		var socket;
	
		beforeEach(function() {
			socket = {
				on: sinon.stub(),
				broadcast: {
					emit: sinon.spy()
				},
				emit: sinon.spy()
			};
			io.on.withArgs('connection').callsArgWith(1, socket);
		
		});

		it("should attach a handler to the 'chatMessage' event", function () {
			require('../../lib/chat')(server); // init
			assert(socket.on.calledWith('chatMessage'));
		});

		it("should attach a handler to the 'newUser' event", function () {
			require('../../lib/chat')(server); // init
			assert(socket.on.calledWith('newUser'));
		});

		describe("the 'newUser' event handler", function() {
			var nodeuuid, gobyGen;
		
			beforeEach(function() {
				// create mocks
				nodeuuid = { v4: sinon.stub().returns(uuid) };

				gobyGen = { generate: sinon.stub().returns(name) };
				goby.init = sinon.stub().returns(gobyGen);

				// replace required modules with mocks
				mockery.registerMock('node-uuid', nodeuuid);
			
				socket.on.withArgs('newUser').callsArg(1);
			});
	
			it("should send a welcome message with a generated user object", function () {			
				require('../../lib/chat')(server); // init
				assert(socket.emit.calledOnce);
				assert(socket.emit.calledWith('welcome', { id: uuid, name: name }));
			});
		});

		describe("the 'chatMessage' event handler", function() {
	
			beforeEach(function() {
				socket.on.withArgs('chatMessage').callsArgWith(1, msg);
			});
		
			it("should broadcast the received message", function () {			
				require('../../lib/chat')(server); // init
				assert(socket.broadcast.emit.calledOnce);
				assert(socket.broadcast.emit.calledWith('chatMessage', msg));
			});
		});
	});
});
