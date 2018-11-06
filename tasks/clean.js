'use strict';

const del = require('del');
const plugins = require('gulp-load-plugins')();
const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

module.exports = function (options) {
  return function () {
    return del(plugins.if(isDevelopment, options.dev, options.build));
  };
};
