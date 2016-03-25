var assert = require('assert');
var webdriverio = require('webdriverio');
var options = {
	desiredCapabilities: { browserName: 'firefox' },
	host: 'chat-selenium-firefox',
	baseUrl: 'http://chat-tmp:3000'
};
var client;

describe('Page Title', function() {

	before(function() {
		this.timeout(9999);
		client = webdriverio.remote(options);
		return client.init();
	});
	
  it('has the correct page title', function() {
  	return client.url('/').getTitle().then(function(title){
  		assert.equal(title, 'chat');
  	});
  });
  
  after(function() {
  	return client.end();
  });
});
