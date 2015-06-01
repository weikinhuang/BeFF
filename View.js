define([
  'jquery',
  'nbd/View',
  'nbd/trait/log',
  './trait/eventMappable'
], function($, View, log, eventMappable) {
  'use strict';

  return View.extend({
    init: function() {
      this._super.apply(this, arguments);
      this.on('postrender', this._mapEvents);
    },

    template: function(templateData) {
      return this.mustache && this.mustache(templateData, this.partials);
    },

    destroy: function() {
      this._undelegateEvents();
      this._super();
    }
  }, {
    domify: $
  })
  .mixin(log)
  .mixin(eventMappable);
});
