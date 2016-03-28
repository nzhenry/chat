var assert = require('assert');
var webdriver = require('../webdriver');

var sendButton = '#sendButton';

describe('Main App', function() {

	before(function() {
		this.timeout(9999);
		return page = webdriver
										.init()
										.getViewportSize()
										.then(function(size){
											width = size.width;
											height = size.height;
										}).url('/');
	});
	
  it('should have the correct page title', function() {
  	return page.getTitle().then(function(title) {
  		assert.equal(title, 'chat');
  	});
  });
  
  describe('Send Button', function() {
		it('should have the text "Send"', function() {
			return page
							.getText(sendButton)
							.then(function(text) {
								assert.equal(text, 'Send');
							});
		});
		it('should be located in the bottom, right corner', function() {
			var btnSize;
			return page
							.getElementSize(sendButton)
							.then(function(size){
								btnSize = size
							})
							.getLocation(sendButton)
							.then(function(loc){
								var expectedPadding = 5;
								assert.equal(width - btnSize.width - expectedPadding, loc.x);
								assert.equal(height - btnSize.height - expectedPadding, loc.y);
							});
		});
  });
	
  it('should have a username input', function() {
  	return page.element('#usernameInput');
  });
  
  it('should have a messages area');
  it('should have a users area');
  
  after(function() {
  	return page.end();
  });
});
