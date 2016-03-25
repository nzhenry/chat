var options = {
	desiredCapabilities: { browserName: 'firefox' },
	host: 'chat-selenium-firefox',
	baseUrl: 'http://chat-tmp:3000'
};
module.exports = exports = require('webdriverio').remote(options);