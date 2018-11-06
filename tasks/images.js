'use strict';

const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();
const imageminJpegRecompress = require('imagemin-jpeg-recompress');
const pngquant = require('imagemin-pngquant');
const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

module.exports = function (options) {
  return function () {
    return gulp.src(options.src, {base: options.srcFolder})
      .pipe(plugins.if(!isDevelopment, plugins.imagemin([
        plugins.imagemin.gifsicle({interlaced: true}),
        plugins.imagemin.jpegtran({progressive: true}),
        imageminJpegRecompress({
          loops: 5,
          min: 60,
          max: 70,
          quality:'medium'
        }),
        plugins.imagemin.optipng({optimizationLevel: 3}),
        pngquant({quality: '60-70', speed: 5}),
        plugins.imagemin.svgo()
      ],{
        verbose: false
      })))
      .pipe(gulp.dest(plugins.if(!isDevelopment, options.build, options.dev)));
  };
};
