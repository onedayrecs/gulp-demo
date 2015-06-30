var gulp = require("gulp"),
    //sass = require("gulp-sass"),
    compass = require('gulp-compass'),
    hologram = require('gulp-hologram'),
    autoprefixer = require("gulp-autoprefixer"),
    uglify = require("gulp-uglify"),
    browser = require("browser-sync"),
    plumber = require("gulp-plumber"),
    ejs = require("gulp-ejs"),
    cssmin = require('gulp-cssmin'),
    //csslint = require('gulp-csslint'),
    rename = require('gulp-rename'),
    spritesmith = require('gulp.spritesmith'),
    bower = require('main-bower-files'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    csscomb = require('gulp-csscomb'),
    please = require('gulp-pleeease'),
    cache = require('gulp-cached'),
    scsslint = require('gulp-scss-lint');

//ejs
gulp.task("ejs", function() {
    gulp.src(
        ["app/dev/ejs/**/*.ejs",'!'+"app/dev/ejs/**/_*.ejs"]
    )
        .pipe(plumber())
        .pipe(ejs())
        .pipe(gulp.dest("app/public"))
        .pipe(browser.reload({stream:true}));
});
//HTML文法チェック
var htmlhint = require("gulp-htmlhint");

gulp.task('html', function() {
    gulp.src('app/public/*.html')
        .pipe(plumber())
        .pipe(htmlhint())
        .pipe(htmlhint.reporter())
});
//compass
gulp.task('compass', function(){
    gulp.src('app/dev/sass/**/*scss')
        .pipe(cache('sass'))
        .pipe(plumber({
          //エラーがあったときに、デスクトップで通知を出す
          errorHandler: notify.onError("Error: <%= error %>")
        }))
        .pipe(scsslint({
            'config': 'scsslint.yml',
        }))
        .pipe(compass({
            comments: true,
            css: 'app/public/css/',
            sass: 'app/dev/sass/'
        }))
        .pipe(autoprefixer())
        .pipe(browser.reload({stream:true}));
});

// CSS　整頓 => 圧縮 => リネームして吐き出し
gulp.task('css', function() {
    gulp.src('app/public/css/common.css')
        .pipe(cache('css'))
        .pipe(plumber({
          //エラーがあったときに、デスクトップで通知を出す
          errorHandler: notify.onError("Error: <%= error %>")
        }))
        .pipe(csscomb())
        .pipe(please({
            autoprefixer: {browsers: ["last 2 versions", "ie >= 8"]},//ベンダープレフィックス
            minifier: true //圧縮の有無 true/false
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('app/public/css/'))
        .pipe(browser.reload({stream:true}));
});

//スタイルガイド生成
gulp.task('hologram', function() {
  var configGlob = 'hologram/hologram_config.yml';
  gulp.src(configGlob)
    .pipe(hologram());
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
    gulp.watch("app/dev/ejs/**/*.ejs",["ejs","html"]);
    gulp.watch(["app/dev/js/**/*.js",'!'+"app/dev/js/min/**/*.js"],["js"]);
    gulp.watch("app/dev/sass/**/*.scss",['compass','css','hologram']);
    gulp.watch("app/dev/sass/base/sprite/images/*.png",["sprite"]);
});
