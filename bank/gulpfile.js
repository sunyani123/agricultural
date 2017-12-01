var gulp = require('gulp');
var webserver = require('gulp-webserver');
var path = require("path");
var mock = require('mockjs');
var fs = require('fs');
var url = require('url');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var mincss = require('gulp-clean-css');
gulp.task('webserver',function(){
    gulp.src('./')
        .pipe(webserver({
            port:3000,
            host:'localhost',
            livereload:true,
            open:true,
            fallback:'index.html'
        }))
});
gulp.task('projectcss',function(){
    gulp.src('./css/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./css'))
});
gulp.task('watch',function(){
    gulp.watch('./css/*.scss',['projectcss'])
});
gulp.task('mincss',function(){
    gulp.src('./css/*.css')
        .pipe(mincss())
        .pipe(gulp.dest('./css/'))
})
gulp.task('twowebserver',function(){
    gulp.src('./')
        .pipe(webserver({
            port:8080,
            host:'localhost',
            middleware:function(request,response,next){
                 response.writeHead(200,{
                    'Content-type':'text/json;charset=utf-8',
                    'Access-Control-Allow-Origin':'*'
                })
                switch(request.url){
                    case '/logindata':
                    var data = mock.mock({
                        "id":"@id",
                        "email":"@email",
                        "content":"@csentence"
                    });
                    response.end(JSON.stringify(data));
                    break;
                    case '/datajson':
                   var filename = request.url.split("/")[1];
                    var dataFile = path.join(__dirname,filename+".json");
                    fs.exists(dataFile, function (exist) {
                        if (exist) {
                            fs.readFile(dataFile, function (err, data) {
                                if (err) return console.error(err);
                                response.end(data.toString());
                            });
                        } else {
                            var datajson = "can't find file: " + filename;
                            response.end(datajson);next()
                        }
                    });
                    break;
                    default:
                    var filename = request.url.split("/")[1];
                    var dataFile = path.join(__dirname,filename+".json");
                    fs.exists(dataFile, function (exist) {
                        if (exist) {
                            fs.readFile(dataFile, function (err, data) {
                                if (err) return console.error(err);
                                response.
                                
                                end(data.toString());
                            });
                        } else {
                            var datajson = "can't find file: " + filename;
                            response.end(datajson);next()
                        }
                    });
                    break;
                }
                ;
            }
        }))
});
gulp.task('default',['webserver','twowebserver','projectcss','watch','mincss'])