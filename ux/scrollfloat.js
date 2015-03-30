// Events for scrolling past floating regions
define([
  'jquery'
], function($) {
  'use strict';

  var $window = $(window),
      $document = $(document),
      scrollCache = {},
      registry = {};

  function callIt(fn) { fn(); }

  // Check if the user's viewport has scrolled based a defined breakpoint
  function scrolled($context) {
    var elementHeight, scrollBottom;

    if ($context.is($window)) {
      elementHeight = (window.innerHeight || $window.height());
      scrollBottom = $document.height() - elementHeight - $window.scrollTop();
    }
    else {
      elementHeight = $context.prop('clientHeight');
      scrollBottom = $context.prop('scrollHeight') - elementHeight - $context.scrollTop();
    }

    return (scrollBottom / elementHeight);
  }

  function scroll(context) {
    var $context = context === 'window' ? $window : $(context);

    return function() {
      var breakpoint, s = scrolled($context);

      for (breakpoint in registry[context]) {
        if (s <= Number(breakpoint)) {
          registry[context][breakpoint].wrapped.forEach(callIt);
        }
      }
    };
  }

  /**
   * @param breakpoint {Number|String} Percentage of viewport height from bottom of context. e.g. '50%' or 0.5
   * @param callback {Function} Potential promise generator
   * @param context {DOM|jQuery}
   */
  function scrollfloat(breakpoint, callback, context) {
    if (typeof breakpoint === "function") {
      context = callback;
      callback = breakpoint;
      breakpoint = 1;
    }
    context = context || 'window';
    breakpoint = Number(breakpoint).toString();

    var cb, $context = context === 'window' ? $window : $(context);

    if (!registry[context]) {
      registry[context] = {};
      scrollCache[context] = scroll(context);

      $context.on('scroll', scrollCache[context]);
    }

    cb = registry[context][breakpoint];

    if (!cb) {
      cb = registry[context][breakpoint] = {
        wrapped: [],
        original: []
      };
    }

    function onHit() {
      if (onHit.blocking) { return; }
      onHit.blocking = true;

      var retval = callback.apply(null, arguments);

      if (retval && typeof retval.then === 'function') {
        retval.then(function() {
          onHit.blocking = false;
          scrollCache[context]();
        });
      }
      else {
        onHit.blocking = false;
      }
    }

    // store both the original and wrapped so it can be removed
    cb.original.push(callback);
    cb.wrapped.push(onHit);

    // First check
    scrollCache[context]();
  }

  scrollfloat.on = scrollfloat;
  scrollfloat.off = function(fn, context) {
    context = context || 'window';

    var breakpoint, cb, i,
        $context = context === 'window' ? $window : $(context);

    for (breakpoint in registry[context]) {
      cb = registry[context][breakpoint];
      // search for the original function
      i = cb.original.indexOf(fn);
      if (~i) {
        cb.original.splice(i, 1);
        cb.wrapped.splice(i, 1);
        if (!cb.original.length) {
          delete registry[context][breakpoint];
        }
      }
    }

    if (!Object.keys(registry[context]).length) {
      $context.off('scroll', scrollCache[context]);
      delete registry[context];
    }
  };

  scrollfloat.check = function(context) {
    context = context || 'window';

    scrollCache[context]();
  };

  return scrollfloat;
});
