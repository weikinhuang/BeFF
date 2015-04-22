define([
  'jquery',
  'nbd/util/extend',
  'nbd/trait/log',
  'nbd/trait/responsive',
  'nbd/Controller',
  './View'
], function($, extend, log, responsive, Controller, View) {
  'use strict';

  function isData(id, data) {
    return typeof data === 'undefined' || typeof id === 'object';
  }

  return Controller.extend({
    init: function(id, data) {
      var el, $view;

      if (isData(id, data)) {
        data = id;
        id = undefined;
      }

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

      this._super(id, data);
      this._view.$view = $view;

      if ($view) {
        this._view.trigger('postrender', $view);
      }
    }
  }, {
    VIEW_CLASS: View
  })
  .mixin(log)
  .mixin(responsive);
});
