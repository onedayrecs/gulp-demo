var gulp = require("gulp");
var sass = require("gulp-sass");
var compass = require('gulp-compass');
var autoprefixer = require("gulp-autoprefixer");
//var frontnote = require("gulp-frontnote");
var styledocco = require("gulp-styledocco");
var uglify = require("gulp-uglify");
var browser = require("browser-sync");
var plumber = require("gulp-plumber");
var ejs = require("gulp-ejs");
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');
var spritesmith = require('gulp.spritesmith');

//ejs
gulp.task("ejs", function() {
    gulp.src(
        ["app/dev/ejs/**/*.ejs",'!'+"app/dev/ejs/**/_*.ejs"]
    )
        .pipe(ejs())
        .pipe(gulp.dest("app/public"))
        .pipe(browser.reload({stream:true}));
});


//compass
gulp.task('compass', function(){
    gulp.src('app/dev/sass/**/*scss')
        .pipe(plumber())
        .pipe(compass({
            comments: true,
            css: 'app/public/css/',
            sass: 'app/dev/sass/'
        }))
        .pipe(autoprefixer())
        .pipe(browser.reload({stream:true}));
});
//sass
 gulp.task("sass", function() {
     gulp.src("app/dev/sass/**/*scss")
         .pipe(plumber())
         .pipe(sass({ style: 'expanded'}))
         .pipe(autoprefixer())
         .pipe(gulp.dest("app/public/css/guide"))
         .pipe(browser.reload({stream:true}));
 });
//styledocco
gulp.task('styledocco', function () {
  gulp.src('app/public/css/guide/common.css')
    .pipe(styledocco({
      out: 'docs',
      name: 'Style Guide',
      'no-minify': true
    }));
});
// css-min
gulp.task('cssmin', function () {
  gulp.src('app/public/css/common.css')
  .pipe(cssmin())
  .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest('app/public/css/cssmin'));
});

//Sprite
gulp.task('sprite', function () {
  var spriteData = gulp.src('app/dev/sass/base/sprite/images/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: '_sprite.scss',
    imgPath: 'img/sprite.png'
  }));
  spriteData.img.pipe(gulp.dest('app/public/css/img'));
  return spriteData.pipe(gulp.dest('app/dev/sass/base/sprite/'));
});

//js
gulp.task("js", function() {
    gulp.src(["app/dev/js/**/*.js",'!'+"app/dev/js/min/**/*.js"])
        .pipe(plumber())
        .pipe(uglify())
        .pipe(gulp.dest("app/public/js/min"))
        .pipe(browser.reload({stream:true}));
});

//browser sync
gulp.task("server", function() {
    browser({
        server: {
            baseDir: "app/public"
        }
    });
});

//watch
gulp.task("default",['server'],function() {
	gulp.watch("app/dev/ejs/**/*.ejs",["ejs"]);
    gulp.watch(["app/dev/js/**/*.js",'!'+"app/dev/js/min/**/*.js"],["js"]);
    gulp.watch("app/dev/sass/**/*.scss",["compass","sass"]);
    gulp.watch("app/dev/sass/**/*.scss",["cssmin"]);
    gulp.watch("app/public/css/guide/common.css",["styledocco"]);
    gulp.watch("app/dev/sass/base/sprite/images/*.png",["sprite"]);
});
