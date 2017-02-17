var gulp = require('gulp');
var jasmine = require('gulp-jasmine');
var typescript = require('gulp-tsc');
var runSequence = require('run-sequence');

gulp.task('compile', function () {
    return gulp.src(['./src/**/*.ts'])
        .pipe(typescript())
        .pipe(gulp.dest('./bin/'));
});

gulp.task('test', function () {
    return gulp.src('tests/*.js')
        .pipe(jasmine());
});

gulp.task('default', function () {
    runSequence('compile', 'test');
});
