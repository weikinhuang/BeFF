define([
  'jquery',
  'nbd/View/Entity',
  'nbd/util/async',
  './trait/eventMappable'
], function($, Entity, async, eventMappable) {
  'use strict';

  var shadow = document.createDocumentFragment(),
  renderMatching = function(key) {
    var selector = this.nests[key],
    contained = this._model.get(key),
    $context = this.$view.find(selector);

    if (!$context) { return; }
    return contained && contained.render ?
      contained.render($context) :
      $context.text(contained);
  };

  return Entity.extend({
    init: function(model) {
      this._super(model);
      this
      .on('prerender', this._undelegateEvents)
      .on('postrender', this._mapEvents)
      .on('postrender', this._renderNested)
      .listenTo(this._model, 'all', function(key, val, old) {
        if (key in this.nests) {
          renderMatching.call(this, key);
          return old && old.render && old.render(shadow);
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
  .mixin(eventMappable);
});
