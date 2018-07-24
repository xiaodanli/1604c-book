var gulp = require('gulp');

var server = require('gulp-webserver');

var sass = require('gulp-sass');

var autoprefixer = require('gulp-autoprefixer');

var url = require('url');

var path = require('path');

var fs = require('fs');

var mock = require('./data');

var querystring = require('querystring');

var userList = [{
        username: 'lixd',
        pwd: 123
    },
    {
        username: 'zjb',
        pwd: 456
    },
    {
        username: 'lmf',
        pwd: 000
    }
];

//开发环境  起服务
gulp.task('devServer', ['devSass'], function() {
    gulp.src('src')
        .pipe(server({
            port: 9090,
            host: '169.254.204.130',
            middleware: function(req, res, next) {
                var pathname = url.parse(req.url).pathname;

                if (pathname === '/favicon.ico') {
                    return false
                }

                var unescapeUrl = querystring.unescape(req.url);
                console.log(unescapeUrl)

                if (pathname === '/api/login') {
                    var chunkArr = [];
                    req.on('data', function(chunk) {
                        chunkArr.push(chunk);
                    })

                    req.on('end', function() {
                        var params = querystring.parse(Buffer.concat(chunkArr).toString());

                        console.log(params);

                        var isHas = userList.some(function(item) {
                            return item.username == params.username && item.pwd == params.pwd
                        })

                        if (isHas) {
                            res.end(JSON.stringify({ code: 1, msg: '登录成功' }));
                        } else {
                            res.end(JSON.stringify({ code: 0, msg: '登录失败' }));
                        }

                    })
                } else if (/\/api/g.test(pathname)) {
                    res.end(JSON.stringify({ code: 1, data: mock(unescapeUrl) }))
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