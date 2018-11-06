'use strict';

const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();

module.exports = function (options) {
  return function () {
    return gulp.src(options.src, {base: options.srcFolder})
      .pipe(plugins.ttf2woff2())
      .pipe(gulp.dest(options.srcFolder));
  };
};
