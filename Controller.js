define([
  'jquery',
  'nbd/util/extend',
  'nbd/Controller/Entity',
  './View'
], function($, extend, Entity, View) {
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

      if ($view) {
        this._view
        .trigger('postrender', $view)
        .rendered($view);
      }
    }
  }, {
    VIEW_CLASS: View
  });
});
