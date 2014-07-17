var gulp = require('gulp');
var jsmin = require('gulp-jsmin');
var rename = require('gulp-rename');
var jasminePhantomJs = require('gulp-jasmine2-phantomjs');

gulp.task('default', function() {
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

gulp.task('test', function() {
	return gulp.src('./SpecRunner.html')
			.pipe(jasminePhantomJs())
			.on("error", function (err) {
				console.log(arguments);
				this.emit('end');
			});
});
