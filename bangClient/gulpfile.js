/**
 * Created by tedshaffer on 6/13/16.
 */
var gulp  = require('gulp');

gulp.task('bangwapp', ['bangwappScripts']);
gulp.task('bangatron', ['bangatronScripts']);


gulp.task('bangwappScripts', function() {
    gulp.src('scripts/bangwapp/*.js').pipe(gulp.dest('scripts/platform'));
})

gulp.task('bangatronScripts', function() {
    gulp.src('scripts/bangatron/*.js').pipe(gulp.dest('scripts/platform'));
})
