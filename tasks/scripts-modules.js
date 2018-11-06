'use strict';

const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();
const combine = require('stream-combiner2').obj;
const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

module.exports = function (options) {
  return function (callback) {
    if (options.src) {
      return gulp.src(options.src)
        .pipe(plugins.if(isDevelopment, plugins.sourcemaps.init()))
        .pipe(plugins.concat(options.jsName + '.js'))
        .pipe(plugins.if(isDevelopment, plugins.sourcemaps.write()))
        .pipe(gulp.dest(plugins.if(!isDevelopment, options.build + '/js', options.dev + '/js')))
        .pipe(plugins.if(!isDevelopment, combine(plugins.uglify(), plugins.rename({suffix: '.min'}), gulp.dest(options.build + '/js'))));
    } else {
      console.log('¯\\_(ツ)_/¯ The file with js modules doesn\'t exist (!)');
      callback();
    }
  };
};
