define([
  'jquery',
  '../Component',
  'jquery-lazyload'
], function($, Component) {
  'use strict';

  function swapAttr($elem, attr) {
    var property = 'data-' + attr;

    if ($elem.attr(property)) {
      $elem
      .attr(attr, $elem.data(attr))
      .removeAttr(property);
    }
  }

  return Component.extend({
    init: function($elem, options) {
      this._$elem = $elem;
      this._options = options;
    },

    bind: function() {
      var self = this;

      // Appear event is triggered by $.fn.lazyload
      this._$elem.on('appear', function createPictureElementFromElement() {
        var $elem = $(this);
        var $img = $elem.is('img') ? $elem : $elem.find('img');
        var $sources = $elem.find('source');

        $img.one('load', function() {
          $img.addClass('image-loaded');

          if (!self._options || self._options.removeAttributes !== false) {
            $img
            .removeAttr('height')
            .removeAttr('width')
            .removeAttr('style');
          }
        });

        swapAttr($img, 'srcset');
        swapAttr($img, 'src');
        swapAttr($img, 'sizes');

        $sources.each(function(_, source) {
          var $source = $(source);

          swapAttr($source, 'srcset');
          swapAttr($source, 'media');
        });
      });

      this._$elem.lazyload(this._options);
    },

    unbind: function() {
      this._$elem.off('appear');
    }
  });
});
