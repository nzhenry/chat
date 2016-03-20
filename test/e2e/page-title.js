var assert = require('assert');

describe('Page Title', function() {
  it('has the correct page title', function() {
		assert.equal(browser.url('/').getTitle(), 'chat');
  });
});
