var gulp = require('gulp');
var www = require('./lib/www');
var webdriver = require('gulp-webdriver');
var fs = require('fs');

gulp.task('start', function() {
	www();
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
