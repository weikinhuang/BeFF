define([
  'jquery',
  'nbd/View/Entity',
  '../trait/eventMappable'
], function($, Entity, eventMappable) {
  'use strict';

  return Entity.extend({
    init: function(model) {
      this._super(model);
      this.on('postrender', this._mapEvents);
    },

    template: function(templateData) {
      return this.mustache && $(this.mustache(templateData, this.partials));
    },

    destroy: function() {
      this._undelegateEvents();
      this._super.apply(this, arguments);
    }
  })
  .mixin(eventMappable);
});
