var gulp = require('gulp');

gulp.task('start', function() {
	require('./lib/chat')(
		require('./lib/server')(
			require('./lib/app')()
		)
	);
});

gulp.task('e2e', function() {
	mkTestDir('./artifacts');
	mkTestDir('./artifacts/xunit');
  return gulp.src('wdio.conf.js')
    .pipe(require('gulp-webdriver')()).on('error', function() {
      process.exit(1);
    });
});

gulp.task('instrument', function () {
	var istanbul = require('gulp-istanbul');
  return gulp.src(['lib/**/*.js'])
    .pipe(istanbul())
    .pipe(istanbul.hookRequire());
});

gulp.task('unit', ['instrument'], function(done) {
	var istanbul = require('gulp-istanbul');
	return gulp.src('test/unit/*.js', {read: false})
			.pipe(require('gulp-mocha')({
					reporter: 'mocha-multi',
					reporterOptions: mochaReporterOptions()
				}))
			.pipe(istanbul.writeReports({dir: './artifacts/coverage'}));
});

gulp.task('test', ['unit', 'e2e']);

function mkTestDir(dir) {
	var fs = require('fs');
	if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
	}
};

function mochaReporterOptions() {
	return {
		xunit: 'artifacts/xunit/unit_test_report.xml',
		mochawesome: {
			stdout: '-',
			options: {
				reporterOptions: {
					reportDir: 'artifacts/mochawesome',
					reportName: 'unit',
					reportTitle: 'Unit Test Report',
					inlineAssets: true
				}
			}
		}
	};
}
