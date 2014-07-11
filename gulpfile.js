var gulp = require('gulp');
var qunit = require('gulp-qunit');

gulp.task('default', function() {
    return gulp.src('./test.html')
        .pipe(qunit());
});