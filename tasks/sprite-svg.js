'use strict';

const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();
const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

module.exports = function (options) {
  return function () {
    return gulp.src(options.src)
      .pipe(plugins.if(!isDevelopment, plugins.imagemin([
        plugins.imagemin.svgo()
      ])))
      .pipe(plugins.svgstore({
        inlineSvg: true
      }))
      .pipe(plugins.rename(options.spriteName))
      .pipe(gulp.dest(plugins.if(!isDevelopment, options.build + '/img/svg', options.dev + '/img/svg')));
  };
};
