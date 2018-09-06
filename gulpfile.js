'use strict';

var gulp = require('gulp');
var less = require('gulp-less');
var plumber = require("gulp-plumber");
var del = require('del');
var newer = require('gulp-newer');
var browserSync = require('browser-sync').create();
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");
var svgstore = require("gulp-svgstore");
var rename = require("gulp-rename");
var mincss = require("gulp-csso");
var imagemin = require("gulp-imagemin");
var imageminJpegRecompress = require('imagemin-jpeg-recompress');
var pngquant = require('imagemin-pngquant');
var cache = require('gulp-cache');
var webp = require("gulp-webp");
var gulpAutoprefixer = require('gulp-autoprefixer');
var jsfiles = require('./jsfiles.json');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var htmlmin = require("gulp-htmlmin");
var pump = require('pump');

gulp.task('jsDev', function () { // Склеивает js модули для разработки
  return gulp.src(jsfiles, {base: 'src/js/modules'})
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(concat('all.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dev/js'));
});

gulp.task('jsBuild', function () { // Склеивает и сжимает js модули для билда
  return gulp.src(jsfiles, {base: 'src/js/modules'})
    .pipe(concat('all.js'))
    .pipe(uglify())
    .pipe(gulp.dest('build/js'));
});

gulp.task('jsMinBuild', function (cb) { // Сжимает самостоятельные js файлы для билда
  pump([
        gulp.src('src/js/*.js'),
        uglify(),
        gulp.dest('build/js')
    ],
    cb
  );
});

gulp.task('imagesBuild', function() { // Оптимизирует растровую графику (только для билда)
  return gulp.src('src/img/**/*.{jpg,png}')
    .pipe(cache(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.jpegtran({progressive: true}),
      imageminJpegRecompress({
        loops: 5,
        min: 50,
        max: 60,
        quality:'medium'
      }),
      imagemin.optipng({optimizationLevel: 3}),
      pngquant({quality: '50-60', speed: 5})
    ],{
      verbose: false
    })))
    .pipe(gulp.dest('build/img'));
});

gulp.task('clearCache', function (done) { // Чистит кэш
  return cache.clearAll(done);
});

gulp.task('webpDev', function() { // Копирует графику в webP формат для разработки
  return gulp.src('src/img/**/*.{jpg,png}', {since: gulp.lastRun('webpDev')})
    .pipe(newer('dev/img'))
    .pipe(webp({quality: 70}))
    .pipe(gulp.dest("dev/img"));
});

gulp.task('webpBuild', function() { // Копирует графику в webP формат для билда
  return gulp.src('src/img/**/*.{jpg,png}')
    .pipe(webp({quality: 70}))
    .pipe(gulp.dest("build/img"));
});

gulp.task('styleDev', function () { // Создает из стилей less style.css, расставляет префиксы (разработка)
  return gulp.src('src/less/style.less')
    .pipe(plumber())
    .pipe(less())
    .pipe(gulpAutoprefixer({
      browsers: ['last 2 versions'],
      cascade: false,
      grid: true
    }))
    .pipe(gulp.dest('dev/css'))
});

gulp.task('styleBuild', function () { // Создает из стилей less style.css, расставляет префиксы, минифицирует (билд)
  return gulp.src('src/less/style.less')
    .pipe(plumber())
    .pipe(less())
    .pipe(gulpAutoprefixer({
      browsers: ['last 2 versions'],
      cascade: false,
      grid: true
    }))
    .pipe(mincss())
    .pipe(gulp.dest('build/css'))
});

gulp.task('copyDev', function () { // копирует файлы для разработки
  return gulp.src('src/{fonts,js,img}/*.*', {since: gulp.lastRun('copyDev')})
  .pipe(newer('dev'))
  .pipe(gulp.dest('dev'))
});

gulp.task('copyBuild', function () { // копирует шрифты для билда
  return gulp.src('src/fonts/*.*')
  .pipe(gulp.dest('build/fonts'))
});

gulp.task('copyHTMLDev', function () { // копирует html для разработки
  return gulp.src('src/*.html', {since: gulp.lastRun('copyHTMLDev')})
  .pipe(newer('dev'))
  .pipe(posthtml([
    include()
  ]))
  .pipe(gulp.dest('dev'))
});

gulp.task('copyHTMLBuild', function () { // копирует и сжимает html для билда
  return gulp.src('src/*.html')
  .pipe(posthtml([
    include()
  ]))
  .pipe(htmlmin({collapseWhitespace: true}))
  .pipe(gulp.dest('build'))
});

gulp.task('cleanDev', function () { // удаляет папку "dev"
  return del('dev');
});

gulp.task('cleanBuild', function () { // удаляет папку "build"
  return del('build');
});

gulp.task('spriteDev', function() { // Оптимизирует SVG и создает спрайт для разработки
  return gulp.src("src/img/icon-*.svg")
    .pipe(imagemin([
      imagemin.svgo()
    ]))
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("dev/img"));
});

gulp.task('spriteBuild', function() { // Оптимизирует SVG и создает спрайт для билда
  return gulp.src("src/img/icon-*.svg")
    .pipe(imagemin([
      imagemin.svgo()
    ]))
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"));
});

gulp.task('serve', function () { // Запускает сервер, при изменениях перезагружается
  browserSync.init({
    server: 'dev',
    notify: false
  });

  browserSync.watch('dev/**/*.*').on('change', browserSync.reload);
});

gulp.task('watch', function () { // Настройки вотчера
  gulp.watch('src/**/*.less', gulp.series('styleDev'));
  gulp.watch('src/{fonts,img,js}/**/*.*', gulp.parallel('copyDev', 'jsDev', 'webpDev'));
  gulp.watch('src/*.html', gulp.series('copyHTMLDev'));
});

gulp.task('dev', gulp.series(gulp.parallel('styleDev', 'copyDev', 'webpDev', 'jsDev', gulp.series('spriteDev', 'copyHTMLDev')), gulp.parallel('clearCache', 'watch', 'serve')));

gulp.task('build', gulp.series('cleanBuild', gulp.parallel('styleBuild', 'imagesBuild', 'copyBuild', 'webpBuild', 'jsBuild', 'jsMinBuild', gulp.series('spriteBuild', 'copyHTMLBuild', 'clearCache'))));
