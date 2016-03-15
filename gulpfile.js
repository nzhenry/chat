var gulp = require('gulp');
var www = require('./lib/www');
var webdriver = require('gulp-webdriver');
var fs = require('fs');

gulp.task('start', function() {
	www();
});

gulp.task('test', function() {
	mkdir('./test_reports');
  return gulp.src('wdio.conf.js')
    .pipe(webdriver()).on('error', function() {
      process.exit(1);
    });
});

function mkdir(dir) {
	if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
	}
}
