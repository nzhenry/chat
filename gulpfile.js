var gulp = require('gulp');
var www = require('./lib/www');
var webdriver = require('gulp-webdriver');
var fs = require('fs');

gulp.task('start', function() {
	www();
});

gulp.task('unit-test', function() {
	mkTestDir('./test_reports');
	mkTestDir('./test_reports/unit');
  return gulp.src('wdio.unit.conf.js')
    .pipe(webdriver()).on('error', function() {
      process.exit(1);
    });
});

gulp.task('e2e-test', function() {
	mkTestDir('./test_reports');
	mkTestDir('./test_reports/e2e');
	mkTestDir('./test_reports/e2e/firefox');
  return gulp.src('wdio.conf.js')
    .pipe(webdriver()).on('error', function() {
      process.exit(1);
    });
});

gulp.task('test', ['unit-test', 'e2e-test']);

function mkTestDir(dir) {
	if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
	}
};
