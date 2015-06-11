var gulp = require("gulp");
var sass = require("gulp-sass");
var autoprefixer = require("gulp-autoprefixer");
var frontnote = require("gulp-frontnote");
var uglify = require("gulp-uglify");
var browser = require("browser-sync");
var plumber = require("gulp-plumber");
var ejs = require("gulp-ejs");
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');

//ejs
gulp.task("ejs", function() {
    gulp.src(
        ["app/dev/ejs/**/*.ejs",'!'+"app/dev/ejs/**/_*.ejs"]
    )
        .pipe(ejs())
        .pipe(gulp.dest("app/public"))
        .pipe(browser.reload({stream:true}));
});

//style
gulp.task("sass", function() {
    gulp.src("app/dev/sass/**/*scss")
        .pipe(plumber())
        .pipe(frontnote({
            css: 'app/public/css/common.css'
        }))
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(gulp.dest("app/public/css/"))
        .pipe(browser.reload({stream:true}));
});
// css-min
gulp.task('cssmin', function () {
  gulp.src('app/public/css/common.css')
  .pipe(cssmin())
  .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest('app/public/css/cssmin'));
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
    gulp.watch("app/dev/sass/**/*.scss",["sass"]);
    gulp.watch("app/dev/sass/**/*.scss",["cssmin"]);
});
