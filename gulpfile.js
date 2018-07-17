var gulp = require('gulp');

var server = require('gulp-webserver');

var sass = require('gulp-sass');

var autoprefixer = require('gulp-autoprefixer');

var url = require('url');

var path = require('path');

var fs = require('fs');

//开发环境  起服务
gulp.task('devServer', ['devSass'], function() {
    gulp.src('src')
        .pipe(server({
            port: 9090,
            middleware: function(req, res, next) {
                var pathname = url.parse(req.url).pathname;

                if (pathname === '/favicon.ico') {
                    return false
                }

                if (pathname === '/api/index') {

                } else {
                    pathname = pathname === '/' ? '/index.html' : pathname;
                    res.end(fs.readFileSync(path.join(__dirname, 'src', pathname)))
                }
            }
        }))
})


//开发环境 编译sass

gulp.task('devSass', function() {
    return gulp.src('./src/scss/*.scss')
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(gulp.dest('./src/css'))
})

//监听scss

gulp.task('watch', function() {
    gulp.watch('./src/scss/*.scss', ['devSass'])
})

gulp.task('dev', ['devServer', 'watch'])