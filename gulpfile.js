var gulp = require('gulp');
var browserify = require('gulp-browserify');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

gulp.task('app', function (done) {
    gulp.src('./src/popup.js')
        .pipe(browserify())
        .pipe(uglify())
        .pipe(gulp.dest('./luoo_plugin', {overwrite: true}));
    return done();
});

gulp.task('watch', function (done) {
    gulp.watch('./src/popup.js', gulp.series('app'));

    return done();
});

gulp.task('default', function () {
    return gulp.series('app')
});
