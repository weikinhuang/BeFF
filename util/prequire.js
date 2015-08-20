/* global requirejs */
define(['nbd/Promise'], function(Promise) {
  'use strict';

  /**
   * Promise wrapped require() call
   *
   * @param paths Module paths to load
   *
   * @return {Promise} The resolved module or an array of modules
   */

  return function req() {
    var paths = Array.prototype.slice.call(arguments);

    return new Promise(function(resolve, reject) {
      requirejs(paths, function() {
        var retval = arguments.length > 1 ? Array.prototype.slice.call(arguments) : arguments[0];
        return resolve(retval);
      }, reject);
    });
  };
});
