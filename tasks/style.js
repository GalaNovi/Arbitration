'use strict';

const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();
const combine = require('stream-combiner2').obj;
const autoprefixer = require('autoprefixer');
const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

module.exports = function (options) {
	return function () {
		return gulp.src(options.src)
  	  .pipe(plugins.plumber({
  	    errorHandler: plugins.notify.onError(function (err) {
  	      return {
  	        title: 'Styles',
  	        message: err.message
  	      };
  	    })
  	  }))
  	  .pipe(plugins.if(isDevelopment, plugins.sourcemaps.init()))
  	  .pipe(plugins.less())
  	  .pipe(plugins.postcss([
  	    autoprefixer()
  	]))
  	.pipe(plugins.if(!isDevelopment, combine(gulp.dest(options.build + '/css'), plugins.csso(), plugins.rename({suffix: '.min'}))))
  	.pipe(plugins.if(isDevelopment, plugins.sourcemaps.write()))
		.pipe(plugins.if(!isDevelopment, gulp.dest(options.build + '/css'), gulp.dest(options.dev + '/css')));
	};
};
