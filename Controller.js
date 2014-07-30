define([
  'jquery',
  'nbd/util/extend',
  'nbd/trait/log',
  'nbd/trait/pubsub',
  'nbd/Controller/Responsive',
  './View'
], function($, extend, log, pubsub, Entity, View) {
  'use strict';

  return Entity.extend({
    init: function(id, data) {
      var el, $view;

      if (typeof data === 'undefined') {
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

      Object.defineProperties(this, {
        id: {
          get: function() {
            return this._model.id();
          }
        },
        data: {
          get: function() {
            return this._model.data();
          }
        }
      });
    }
  }, {
    VIEW_CLASS: View
  })
  .mixin(log);
});
