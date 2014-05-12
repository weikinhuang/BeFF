define(function() {
  'use strict';

  return function debounce(fn) {
    if (debounce._blocking) { return; }
    debounce._blocking = true;

    var retval = fn.apply(this, arguments);

    if (retval && typeof retval.then === 'function') {
      retval.then(function() {
        debounce._blocking = false;
      });
    }
    else {
      debounce._blocking = false;
    }

    return retval;
  };
});
