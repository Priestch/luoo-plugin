var gulp = require('gulp');
var browserify = require('gulp-browserify');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

gulp.task('app', function (done) {
    gulp.src('src/luoo.module.js')
        .pipe(browserify())
        // .pipe(uglify())
        .pipe(rename('popup.js'))
        .pipe(gulp.dest('./luoo_plugin', {overwrite: true}));
    return done();
});

gulp.task('watch', function (done) {
    gulp.watch(['src/**/*.js'], gulp.series('app'));

    return done();
});

gulp.task('default', function (done) {
    gulp.series('app');

    return done();
});
