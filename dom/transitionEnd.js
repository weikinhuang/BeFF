define([
  'nbd/Promise',
  'nbd/util/async',
  'nbd/util/diff'
], function(Promise, async, diff) {
  'use strict';

  // Thanks modernizr
  var eventName = (function transitionEvent() {
    var el = document.createElement('aside'),
        transEndEventNames = {
          WebkitTransition: 'webkitTransitionEnd',
          MozTransition: 'transitionend',
          OTransition: 'oTransitionEnd otransitionend',
          transition: 'transitionend'
        },
        name;

    for (name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return transEndEventNames[name];
      }
    }
  })(),

  requestAnimationFrame = window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame,

  // From https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animated_properties
  allowedTransitionProps = [
    'transform',
    'transform-origin',
    'perspective',
    'perspective-origin',
    'color',
    'opacity',
    'column-width',
    'column-count',
    'column-gap',
    'column-rule-color',
    'column-rule-width',
    'letter-spacing',
    'text-indent',
    'word-spacing',
    'text-decoration-color',
    'text-shadow',
    'flex-basis',
    'flex-grow',
    'flex-shrink',
    'order',
    'background-color',
    'background-position',
    'background-size',
    'border-top-color',
    'border-right-color',
    'border-bottom-color',
    'border-left-color',
    'border-top-width',
    'border-right-width',
    'border-bottom-width',
    'border-left-width',
    'border-top-left-radius',
    'border-top-right-radius',
    'border-bottom-right-radius',
    'border-bottom-left-radius',
    'box-shadow',
    'margin-top',
    'margin-right',
    'margin-bottom',
    'margin-left',
    'padding-top',
    'padding-right',
    'padding-bottom',
    'padding-left',
    'max-height',
    'min-height',
    'height',
    'max-width',
    'min-width',
    'width',
    'visibility',
    'vertical-align',
    'bottom',
    'left',
    'right',
    'top',
    'z-index',
    'font-weight',
    'font-stretch',
    'font-size',
    'font-size-adjust',
    'line-height',
    'outline-color',
    'outline-width',
    'outline-offset',
    'clip',
    'shape-outside',
    'shape-margin',
    'shape-image-threshold'
  ];

  function hasTransition($el) {
    var trans = $el.css('transition-duration');
    return (trans.split(',').map(parseFloat).some(Boolean) &&
            trans !== 'none');
  }

  function getTransitionProps($el) {
    var computedStyle = window.getComputedStyle($el[0]),
        transitionProperty = $el.css('transition-property');

    return (transitionProperty === 'all' ?
      allowedTransitionProps :
      transitionProperty.split(','))
    .reduce(function(o, prop) {
      prop = prop.trim();
      o[prop] = computedStyle.getPropertyValue(prop);
      return o;
    }, {});
  }

  return function transitionEnd($el, timeout) {
    var p = new Promise(), props, halt = false;

    timeout = timeout || 300;

    function boundPromise(key) {
      var p = new Promise();
      $el.one(eventName, function(event) {
        if (event.originalEvent.propertyName === key) {
          p.resolve();
        }
      });
      return p;
    }

    function checkTransitionProp() {
      requestAnimationFrame(function() {
        var changed = diff(props, getTransitionProps($el)),
            keys = Object.keys(changed);

        if (keys.length) {
          p.resolve(Promise.all.apply(Promise, keys.map(boundPromise)));
        }
        else if (!halt) {
          checkTransitionProp();
        }
        else {
          p.reject();
        }
      });
    }

    // Wait for transitionend
    if (eventName && hasTransition($el)) {
      props = getTransitionProps($el);
      checkTransitionProp();
      setTimeout(function() { halt = true; }, timeout);
    }
    // Immediately return
    else {
      p.reject();
    }
    return p;
  };
});
