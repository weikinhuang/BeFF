// Events for scrolling past floating regions
define([
  'jquery'
], function($) {
  'use strict';

  var $window = $(window),
      $document = $(document),
      scrollCache = {},
      registry = {};

  function getContext(context) {
    return context === 'window' ? $window : $(context);
  }

  function getContextId(context, contentContext) {
    return contentContext ? context + '|' + contentContext : context;
  }

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

  function onScroll(context) {
    var $context = getContext(context);
    var contextId = getContextId(context);
    var scrollEls = 'window' === context ? $('html,body') : $context;

    return function() {
      var canScroll = scrollEls.toArray().every(function(el) {
        return $(el).css('overflowY') !== 'hidden';
      });

      var breakpoint, s = scrolled($context);

      for (breakpoint in registry[contextId]) {
        if (s <= Number(breakpoint) && canScroll) {
          registry[contextId][breakpoint].wrapped.forEach(function(fn) {
            fn();
          });
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
    if (typeof breakpoint === 'function') {
      context = callback;
      callback = breakpoint;
      breakpoint = 1;
    }
    context = context || 'window';
    breakpoint = Number(breakpoint).toString();

    var $context = getContext(context);
    var contextId = getContextId(context);

    if (!registry[contextId]) {
      registry[contextId] = {};
      scrollCache[contextId] = onScroll(context);

      $context.on('scroll', scrollCache[contextId]);
    }

    var cb = registry[contextId][breakpoint];

    if (!cb) {
      cb = registry[contextId][breakpoint] = {
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
          scrollCache[contextId]();
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
    scrollCache[contextId]();
  }

  scrollfloat.on = scrollfloat;
  scrollfloat.off = function(fn, context) {
    context = context || 'window';

    var breakpoint;
    var cb;
    var i;
    var $context = getContext(context);
    var contextId = getContextId(context);

    for (breakpoint in registry[contextId]) {
      cb = registry[contextId][breakpoint];
      // search for the original function
      i = cb.original.indexOf(fn);
      if (~i) {
        cb.original.splice(i, 1);
        cb.wrapped.splice(i, 1);
        if (!cb.original.length) {
          delete registry[contextId][breakpoint];
        }
      }
    }

    if (!Object.keys(registry[contextId]).length) {
      $context.off('scroll', scrollCache[contextId]);
      delete registry[contextId];
    }
  };

  scrollfloat.check = function(context) {
    var contextId = getContextId(context || 'window');

    scrollCache[contextId]();
  };

  return scrollfloat;
});
