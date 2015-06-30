var gulp = require("gulp"),
    sass = require("gulp-sass"),
    compass = require('gulp-compass'),
    hologram = require('gulp-hologram'),
    autoprefixer = require("gulp-autoprefixer"),
    uglify = require("gulp-uglify"),
    browser = require("browser-sync"),
    plumber = require("gulp-plumber"),
    ejs = require("gulp-ejs"),
    cssmin = require('gulp-cssmin'),
    rename = require('gulp-rename'),
    spritesmith = require('gulp.spritesmith'),
    bower = require('main-bower-files'),
    concat = require('gulp-concat');

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

//スタイルガイド生成
gulp.task('hologram', function() {
  var configGlob = 'hologram/hologram_config.yml';
  gulp.src(configGlob)
    .pipe(hologram());
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
        .pipe(concat('all.min.js'))
        .pipe(gulp.dest("app/public/js/"))
        .pipe(browser.reload({stream:true}));
});

//js Library
gulp.task('jslib', function() {
    gulp.src(bower({debugging:true,checkExistence:true}))
        .pipe(uglify())
        .pipe(concat('lib.js'))
        .pipe(gulp.dest('app/public/js'));
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
    gulp.watch("app/dev/sass/**/*.scss",['compass','sass','hologram','cssmin']);
    gulp.watch("app/dev/sass/base/sprite/images/*.png",["sprite"]);
});
