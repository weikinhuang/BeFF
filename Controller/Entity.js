define([
  'jquery',
  'nbd/util/extend',
  'nbd/Controller/Entity'
], function($, extend, Entity) {
  'use strict';

  return Entity.extend({
    init: function(data) {
      var el, $view;

      if (typeof data === 'string') {
        $view = $(data);
        el = $view[0];
      }

      if (data instanceof $) {
        $view = data;
        el = $view[0];
      }

      if (data instanceof window.Element) {
        el = data;
        $view = $(el);
      }

      if ($view) {
        // We want the HTML5 dataset
        data = extend({}, el.dataset || $view.data());
      }

      this._super(data);
      this._view.$view = $view;

      if (this._view.$view && this._view.rendered) {
        this._view.rendered();
      }
    }
  });
});
