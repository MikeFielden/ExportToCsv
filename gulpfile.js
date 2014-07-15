var gulp = require('gulp');
var jasmine = require('gulp-jasmine');
var jsmin = require('gulp-jsmin');
var rename = require('gulp-rename');

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
    return gulp.src('./spec/exportToCsvSpec.js')
        .pipe(jasmine());
});
