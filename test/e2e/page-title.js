var assert = require('assert');

describe('Page Title', function() {
  it('has the correct page title', function() {
    return browser
      .url('/')
      .getTitle()
      .then(function(title) {
        assert.equal(title, 'chat');
      });
  });
});
