// Events for scrolling past points in pages
define(['jquery'], function($) {
  'use strict';

  var percent = /(\d+)%/,
      $window = $(window),
      $document = $(document),
      registry = {};

  function isPercent(breakpoint) {
    return percent.test(breakpoint) || (breakpoint > 0 && breakpoint < 1);
  }

  function normalize(breakpoint) {

    if ( $.isNumeric(breakpoint) ) {
      return parseFloat(breakpoint);
    }

    var value = percent.exec(breakpoint);

    // Percentage breakpoint
    if (value) {
      return (value[1] / 100);
    }

    return parseInt(breakpoint, 10);
  }

  function elementHeight($context) {
    return $context.is($window) ?
           ($document.height() - (window.innerHeight || $window.height())) :
           $context.prop('scrollHeight');
  }

  function check(breakpoint, scrolled, $context) {
    return (scrolled >
            (isPercent(breakpoint) ?
             breakpoint * elementHeight($context) :
             parseInt(breakpoint, 10)
            )
           );
  }

  function scroll(context) {
    var $context = context === 'window' ? $window : $(context);

    return function () {
      var breakpoint, cb, cache,
      scrolled = $context.scrollTop();

      for (breakpoint in registry[context]) {
        cb = registry[context][breakpoint];
        cache = check(breakpoint, scrolled, $context);

        cb.cache = cb.cache || false;

        if (cb.cache !== cache) {
          cb.fire(cache);
          cb.cache = cache;
        }
      }
    };
  }

  function register(breakpoint, callback, context) {
    breakpoint = normalize(breakpoint);

    var cb = registry[context][breakpoint];

    if (!cb) {
      cb = registry[context][breakpoint] = new $.Callbacks();
    }

    cb.add(callback);
  }

  function unregister(breakpoint, callback, context) {
    context = context || 'window';

    var bp;

    if (callback) {
      if (breakpoint) {
        registry[context][breakpoint].remove(callback);
        return;
      }

      for (bp in registry[context]) {
        registry[context][bp].remove(callback);
      }
      return;
    }

    if (typeof breakpoint === 'string') {
      registry[context][breakpoint].empty();
      delete registry[context][breakpoint];
    }

    if (context) {
      delete registry[context];
    }
  }

  /**
   * @param breakpoint {Number|String} Number of pixels scrolled down
   * or percentage of context height e.g. '50%' or 0.5
   * @param callback {Function}
   * @param context {DOM|jQuery}
   */
  function scrollpoint(breakpoint, callback, context) {
    context = context || 'window';

    var $context = context === 'window' ? $window : $(context),
        point;

    if (!registry.hasOwnProperty(context)) {
      registry[context] = {};
      $context.on('scroll', scroll(context));
    }

    if (typeof breakpoint === 'object') {
      for (point in breakpoint) {
        register(point, breakpoint[point], context);
      }
      return;
    }

    return register(breakpoint, callback, context);
  }

  scrollpoint.on = scrollpoint;
  scrollpoint.off = unregister;

  return scrollpoint;
});
