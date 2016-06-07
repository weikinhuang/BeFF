define([
  'jquery',
  '../Component',
  'intersection-observer-polyfill'
], function($, Component) {
  'use strict';

  return Component.extend({
    init: function($elem) {
      this._$elem = $elem;
    },

    bind: function() {
      this.createObserver();
    },

    createObserver: function() {
      this._observer = new window.IntersectionObserver(this.changeHandler.bind(this));
      var self = this;

      this._$elem.each(function() {
        self._observer.observe(this);
      });
    },

    changeHandler: function(changes) {
      var self = this;

      changes.forEach(function(change) {
        var $img = $(change.target);

        self._replaceAttr($img, 'srcset');
        self._replaceAttr($img, 'src');

        self.trigger('load', $img);

        self._observer.unobserve(change.target);
      });
    },

    _replaceAttr: function($img, attrToReplace) {
      if ($img.attr('data-' + attrToReplace)) {
        $img.attr(attrToReplace, $img.data(attrToReplace))
        .removeAttr('data-' + attrToReplace);
      }
    },

    unbind: function() {
      this._observer.disconnect();
    }
  });
});
