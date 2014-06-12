define([
  'jquery',
  'nbd/View/Entity',
  'nbd/util/async',
  'nbd/trait/log',
  './trait/eventMappable'
], function($, Entity, async, log, eventMappable) {
  'use strict';

  var shadow = document.createDocumentFragment(),
  renderMatching = function(key) {
    if (!this.$view) { return; }
    var selector = this.nests[key],
    contained = this._model.get(key),
    $context = selector ? this.$view.find(selector) : this.$view;

    if (!$context) { return; }
    return contained && contained.render ?
      contained.render($context) :
      $context.text(contained);
  };

  return Entity.extend({
    init: function(model) {
      this._super(model);
      this
      .on('postrender', this._mapEvents)
      .on('postrender', this._renderNested)
      .listenTo(this._model, 'all', function(key, val, old) {
        if (this.nests != null && key in this.nests) {
          if (old && old.render) { old.render(shadow); }
          renderMatching.call(this, key);
        }
      });
    },

    template: function(templateData) {
      return this.mustache && this.mustache(templateData, this.partials);
    },

    destroy: function() {
      this._undelegateEvents();
      this._super.apply(this, arguments);
    },

    _renderNested: function() {
      if (!this.nests) { return; }
      Object.keys(this.nests).forEach(renderMatching, this);
    }
  }, {
    domify: $
  })
  .mixin(log)
  .mixin(eventMappable);
});
