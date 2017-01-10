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
    if (!contentContext) {
      return context;
    }

    if (typeof contentContext !== 'string' || typeof context !== 'string') {
      throw new Error('context and contentContext must both be strings if contentContext is provided.');
    }

    return context + '|' + contentContext;
  }

  function getScrollHeight($context, $contentContext) {
    var contextOffsetTop;

    if ($contentContext.is($window)) {
      return $document.height();
    }

    if ($contentContext !== $context) {
      contextOffsetTop = $context.is($window) ? 0 : $context.offset().top;
      return $contentContext.height() + $contentContext.offset().top - contextOffsetTop;
    }

    return $context.prop('scrollHeight');
  }

  function getScrollDistance($context, $contentContext) {
    var elementHeight = $context.is($window) ? window.innerHeight : $context.prop('clientHeight');
    var scrollHeight = getScrollHeight($context, $contentContext);
    var scrollBottom = scrollHeight - elementHeight - $context.scrollTop();

    return (scrollBottom / elementHeight);
  }

  function onScroll(context, contentContext) {
    var $context = getContext(context);
    var $contentContext = contentContext ? $(contentContext) : $context;
    var contextId = getContextId(context, contentContext);
    var scrollEls = 'window' === context ? $('html,body') : $context;

    return function() {
      var canScroll = scrollEls.toArray().every(function(el) {
        return $(el).css('overflowY') !== 'hidden';
      });

      var scrollDistance = getScrollDistance($context, $contentContext);

      for (var breakpoint in registry[contextId]) {
        if (scrollDistance <= Number(breakpoint) && canScroll) {
          registry[contextId][breakpoint].wrapped.forEach(function(fn) {
            fn();
          });
        }
      }
    };
  }

  /**
   * @param breakpoint {Number} Percentage of viewport height from bottom of context as a decimal. e.g. 0.5 is 50%
   * @param callback {Function} Potential promise generator
   * @param context {DOM|jQuery}
   * @param contentContext {?DOM|?jQuery}
   */
  function scrollfloat(breakpoint, callback, context, contentContext) {
    if (typeof breakpoint === 'function') {
      contentContext = context;
      context = callback;
      callback = breakpoint;
      breakpoint = 1;
    }
    context = context || 'window';
    breakpoint = Number(breakpoint).toString();

    var $context = getContext(context);
    var contextId = getContextId(context, contentContext);

    if (!registry[contextId]) {
      registry[contextId] = {};
      scrollCache[contextId] = onScroll(context, contentContext);

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
  scrollfloat.off = function(fn, context, contentContext) {
    context = context || 'window';

    var breakpoint;
    var cb;
    var i;
    var $context = getContext(context);
    var contextId = getContextId(context, contentContext);

    if (!registry[contextId]) {
      return;
    }

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

  scrollfloat.check = function(context, contentContext) {
    var contextId = getContextId(context || 'window', contentContext);

    scrollCache[contextId]();
  };

  return scrollfloat;
});
