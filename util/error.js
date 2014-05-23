define(['nbd/Promise'], function(Promise) {
  'use strict';

  var handlers = [],
  error = function errorHandler(value) {
    var promise = new Promise();
    promise.reject(value);
    return (this || handlers).reduce(function(chain, handler) {
      return chain.catch(handler);
    }, promise);
  };

  Object.defineProperty(error, 'handlers', {
    value: handlers
  });

  return error;
});
