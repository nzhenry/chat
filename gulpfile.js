var gulp = require('gulp');
var Server = require('./lib/server');
var App = require('./lib/app');
var Chat = require('./lib/chat');
var webdriver = require('gulp-webdriver');
var fs = require('fs');

gulp.task('start', function() {
	var app = App();
	var server = Server(app);
	Chat(server);
});

gulp.task('e2e', function() {
	mkTestDir('./artifacts');
	mkTestDir('./artifacts/test');
  return gulp.src('wdio.conf.js')
    .pipe(webdriver()).on('error', function() {
      process.exit(1);
    });
});

function mkTestDir(dir) {
	if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
	}
};
