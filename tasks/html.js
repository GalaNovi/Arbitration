'use strict';

const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();
const combine = require('stream-combiner2').obj;
const include = require("posthtml-include");
const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

module.exports = function (options) {
  return function () {
    return gulp.src(options.src)
      .pipe(plugins.if(!isDevelopment, combine(plugins.replace(options.cssName + '.css', options.cssName + '.min.css'), plugins.replace(options.dev + '/img/' + options.spriteName, options.build + '/img/' + options.spriteName), plugins.replace(options.jsName + '.js', options.jsName + '.min.js'))))
      .pipe(plugins.htmlhint())
      .pipe(plugins.htmlhint.reporter())
      .pipe(plugins.posthtml([
        include()
      ]))
      .pipe(plugins.if(!isDevelopment, plugins.htmlmin({collapseWhitespace: true})))
      .pipe(gulp.dest(plugins.if(!isDevelopment, options.build, options.dev)));
  };
};
