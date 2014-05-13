define([
  'jquery',
  'nbd/util/construct',
  'nbd/View/Element',
  '../Controller/Entity',
  '../trait/eventMappable'
], function($, construct, Element, Entity, eventMappable) {
  'use strict';

  return Element.extend({
    init: function($view) {
      this.$view = $view;
      this.bind();
      this._el = $view.children().toArray().map(this.decorate, this);
      // Important to not call _super
    },

    destroy: function() {
      this.unbind();
      this._super();
    },

    bind: function() {
      this._mapEvents();
    },
    unbind: function() {
      this._undelegateEvents();
    },
    decorate: construct.bind(Entity),

    render: function(resultset) {
      var nodes = resultset.map(this.decorate, this).filter(Boolean);

      nodes.forEach(function(node) {
        return node.render && node.render(this.$view);
      }, this);
      this._el = this._el.concat(nodes);

      return this.$view;
    },

    clear: function() {
      this._el.forEach(function(item) {
        return item && item.destroy && item.destroy();
      });
      this._el = [];
      return this.$view.empty();
    },

    isEmpty: function() {
      return !this._el.length;
    }
  })
  .mixin(eventMappable);
});
