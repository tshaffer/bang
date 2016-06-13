/**
 * Created by tedshaffer on 6/13/16.
 */
var gulp  = require('gulp');
// var gutil = require('gulp-util');
// var webpack = require('webpack-stream');

// webApp
gulp.task('bangwappScripts', function() {
    gulp.src('scripts/bangwapp/*.js').pipe(gulp.dest('scripts/platform'));
})

gulp.task('bangwappBuild', function() {
    gulp.src('bangwappBuild/*').pipe(gulp.dest('./'));
})

gulp.task('bangwapp', ['bangwappScripts','bangwappBuild']);

// electron
gulp.task('bangatronScripts', function() {
    gulp.src('scripts/bangatron/*.js').pipe(gulp.dest('scripts/platform'));
})

gulp.task('bangatronBuild', function() {
    gulp.src('bangatronBuild/*').pipe(gulp.dest('./'));
})

gulp.task('bangatron', ['bangatronScripts','bangatronBuild']);


// the following didn't work.
// gulp.task('btron', function() {
//     return gulp.src('./scripts/index.js')
//         .pipe(webpack( require('./webpack.config.js') ))
//         .pipe(gulp.dest('./dist/'));
// })

