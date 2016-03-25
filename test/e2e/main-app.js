var assert = require('assert');
var client = require('../webdriver');

describe('Main App', function() {

	before(function() {
		this.timeout(9999);
		return client.init();
	});
	
  it('should have the correct page title', function() {
  	return client.url('/').getTitle().then(function(title){
  		assert.equal(title, 'chat');
  	});
  });
	
  it('should have a send button');
  
  after(function() {
  	return client.end();
  });
});
