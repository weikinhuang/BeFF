define([
  'jquery',
  '../Component'
], function($, Component) {
  'use strict';

  var CountableElement = Component.extend({
    init: function(options) {
      this._$context = options.$context;
      this._label = options.label;

      this._lengths = this._extractLengths(this._$context.data('validate') || '');

      this._$charLengthResultsText = $('<div class="js-char-limiter character-counter counter-normal">');
      this._$charLengthResultsText.insertAfter(this._$context);

      this._setCountRemainingText(this._lengths.max);
      this._$context.attr('maxlength', this._lengths.max);

      if (options.canBeNegative) {
        this._$context.removeAttr('maxlength');
      }

      // Run in case field already has value
      this._checkLimit();
    },

    bind: function() {
      this._$context.on('input.beff-char-counter', this._checkLimit.bind(this));
    },

    unbind: function() {
      this._$context.off('input.beff-char-counter');
    },

    _setCountRemainingText: function(remainingCount) {
      this._$charLengthResultsText.html('<span class="letters-remaining">' + this._label + '</span> ' + remainingCount);
    },

    /**
     * Lengths are of the form length[0]
     * @param  {String} validation
     * @return {Object}
     */
    _extractLengths: function(validation) {
      var matches = validation.match(/length\[(\d+)(,(\d+))?\]/),
          lengths = {
            min: 0,
            max: 0
          };

      if (matches && matches.length) {
        if (matches[3]) {
          lengths.min = matches[1] ? parseInt(matches[1], 10) : 0;
          lengths.max = matches[3] ? parseInt(matches[3], 10) : 0;
        }
        else {
          lengths.max = matches[1] ? parseInt(matches[1], 10) : 0;
        }
      }

      return lengths;
    },

    _checkLimit: function() {
      var charRemaining = this._lengths.max - this._$context.val().length,
          charLeftMin = this._lengths.min,
          charWarning = 0.1 * (this._lengths.max + this._lengths.min);

      this._setCountRemainingText(charRemaining);

      if (charRemaining > charLeftMin) {
        this._$charLengthResultsText.addClass('counter-normal');
      }

      if (charRemaining < charLeftMin || charRemaining === 0) {
        this._$charLengthResultsText.removeClass('counter-normal').addClass('counter-max');
      }
      else {
        this._$charLengthResultsText.removeClass('counter-max');
      }

      if (charRemaining < charWarning && charRemaining > charLeftMin)  {
        this._$charLengthResultsText.addClass('counter-warn').removeClass('counter-normal');
      }
      else {
        this._$charLengthResultsText.removeClass('counter-warn');
      }
    }
  });

  return Component.extend({
    /**
     * @param {Object} options
     * @param {$} options.$context
     * @param {Boolean} options.canBeNegative
     * @param {String} options.label
     */
    init: function(options) {
      var $elements = options.$context.find('.js-characters-limited'),
          label = typeof options.label === 'undefined' ? 'Characters left:' : options.label;

      this._countableElements = $elements.toArray().map(function(el) {
        return CountableElement.init({
          $context: $(el),
          label: label,
          canBeNegative: options.canBeNegative
        });
      });
    },

    unbind: function() {
      this._countableElements.forEach(function(elem) {
        elem.destroy();
      });
    }
  });
});
