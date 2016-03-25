var gulp = require('gulp');

gulp.task('start', function() {
	require('./lib/chat')(
		require('./lib/server')(
			require('./lib/app')()
		)
	);
});

gulp.task('test', ['unit'], function() {
	return gulp.src('test/e2e/*.js', {read: false})
			.pipe(require('gulp-mocha')({
					reporter: 'mocha-multi',
					reporterOptions: mochaReporterOptions('e2e')
				}));
});

gulp.task('unit', ['instrument'], function(done) {
	var istanbul = require('gulp-istanbul');
	return gulp.src('test/unit/*.js', {read: false})
			.pipe(require('gulp-mocha')({
					reporter: 'mocha-multi',
					reporterOptions: mochaReporterOptions('Unit')
				}))
			.pipe(istanbul.writeReports({dir: './artifacts/coverage'}));
});

gulp.task('instrument', function () {
	var istanbul = require('gulp-istanbul');
  return gulp.src(['lib/**/*.js'])
    .pipe(istanbul())
    .pipe(istanbul.hookRequire());
});

function mochaReporterOptions(name) {
	return {
		xunit: 'artifacts/xunit/'+name+'_test_report.xml',
		mochawesome: {
			stdout: '-',
			options: {
				reporterOptions: {
					reportDir: 'artifacts/mochawesome',
					reportName: name,
					reportTitle: name + ' Test Report',
					inlineAssets: true
				}
			}
		}
	};
}
