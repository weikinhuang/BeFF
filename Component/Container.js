define([
  'jquery',
  'nbd/util/construct',
  '../Component',
  '../Controller',
  '../trait/eventMappable'
], function($, construct, Component, Controller, eventMappable) {
  'use strict';

  return Component.extend({
    init: function($view) {
      this.$view = $view;
    },

    bind: function() {
      this._mapEvents();
      this._nodes = this.$view.children().toArray()
      .map(this.decorate, this);
    },

    unbind: function() {
      this._undelegateEvents();
    },

    decorate: construct.bind(Controller),

    add: function(resultset) {
      var nodes = resultset.map(this.decorate, this).filter(Boolean);

      nodes.forEach(function(node) {
        return node.render && node.render(this.$view);
      }, this);
      this._nodes = this._nodes.concat(nodes);
      return nodes;
    },

    empty: function() {
      this._nodes.forEach(function(item) {
        return item && item.destroy && item.destroy();
      });
      this._nodes = [];
      return this.$view.empty();
    },

    isEmpty: function() {
      return !this._nodes.length;
    }
  })
  .mixin(eventMappable);
});
