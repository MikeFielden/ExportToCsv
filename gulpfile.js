var gulp = require('gulp');
var jsmin = require('gulp-jsmin');
var rename = require('gulp-rename');
var jasminePhantomJs = require('gulp-jasmine2-phantomjs');
var watch = require('gulp-watch');
var clean = require('gulp-clean');

gulp.task('clean', function () {
	return gulp.src(['dist/*.*'], {read: false})
	.pipe(clean());
});

gulp.task('default', ['clean'], function() {
	return gulp.src('./index.js')
			.pipe(rename({
				basename: 'exportToCsv'
			}))
			.pipe(gulp.dest('dist'))
			.pipe(jsmin())
			.pipe(rename({
				basename: 'exportToCsv',
				suffix: '.min'
			}))
			.pipe(gulp.dest('dist'));
});

gulp.task('test', ['default'], function() {
	return gulp.src('./SpecRunner.html')
			.pipe(jasminePhantomJs())
			.on("error", function (err) {
				process.exit(1);
			});
});

gulp.task('watch', function () {
	return gulp.src(['./index.js', './spec/exportToCsvSpec.js'])
			.pipe(watch(function(files) {
				gulp.start('test');
			}));
});
