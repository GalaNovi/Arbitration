'use strict';

const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();
const combine = require('stream-combiner2').obj;
const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

module.exports = function (options) {
  return function () {
    return gulp.src(options.src, {base: options.srcFolder})
      .pipe(plugins.if(isDevelopment, combine(plugins.cached('copying'), plugins.newer(options.dev))))
      .pipe(gulp.dest(plugins.if(!isDevelopment, options.build, options.dev)));
  };
};
