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

gulp.task('test', function(done) {
	var reporterOptions = {
			xunit: 'artifacts/xunit/unit_test_report.xml',
			mochawesome: {
				stdout: '-',
				options: {reporterOptions: {
					reportDir: 'artifacts/mochawesome',
					reportName: 'report',
					reportTitle: 'Chat Unit Test Report',
					inlineAssets: true
				}}
			}
	};
	return gulp.src('test/unit/*.js', {read: false})
			.pipe(require('gulp-mocha')({
					reporter: 'mocha-multi',
					reporterOptions: reporterOptions
				}));
});

function mkTestDir(dir) {
	var fs = require('fs');
	if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
	}
};
