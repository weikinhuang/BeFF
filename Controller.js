define([
  'jquery',
  'nbd/util/extend',
  'nbd/trait/pubsub',
  'nbd/Controller/Entity',
  './View'
], function($, extend, pubsub, View, Entity) {
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
        this._view.trigger('postrender', $view);
      }
    },

    _initView: function() {
      this._super.apply(this, arguments);
      this.listenTo(this._view, 'postrender', this._renderNested);
    },

    _renderNested: function($view, map) {
      map = map || this._view.nests;
      if (!(map && this.nests)) { return; }

      Object.keys(map).forEach(function(key) {
        var selector = map[key],
        contained = this.nests[key],
        $context = $view.find(selector);

        return $context && contained && contained.render($context);
      }, this);
    }
  }, {
    VIEW_CLASS: View
  })
  .mixin(pubsub);
});
