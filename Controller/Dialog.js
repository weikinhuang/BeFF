define([
  'jquery',
  '../Controller'
], function($, Controller) {
  'use strict';

  var constructor = Controller.extend({
    setContext: function($context) {
      if (this.$context) {
        this.$context.off('click.dialog');
      }

      this.$context = $context
      .on('click.dialog', function(e) {
        if (e.isDefaultPrevented() ||
            e.originalEvent._view === this._view) { return; }
        this.toggle(e.delegateTarget);
      }.bind(this));
    },

    render: function($context) {
      var attachment = $($context).closest(this._view.attachment);
      return this._super(attachment.length ? attachment : document.body)
      .then(this._view.position.bind(this._view));
    },

    toggle: function($context) {
      if (this._view.$view && this._view.$view.length) {
        this._view.toggle();
        this._view.position($context);
      }
      else {
        this.render($context || this.$context)
        .then(this._view.show.bind(this._view));
      }
    }
  });

  return constructor;
});
