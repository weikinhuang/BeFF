define([
  'jquery',
  '../Controller',
  'nbd/util/async'
], function($, Controller, async) {
  'use strict';

  var constructor = Controller.extend({
    $context: null,

    setContext: function($context) {
      if (this.$context) {
        this.$context.off('click.dialog');
      }

      this.$context = $context
      .on('click.dialog', function(e) {
        if (e.isDefaultPrevented() ||
            e.originalEvent.view === this._view) { return; }
        this.toggle(e.delegateTarget);
      }.bind(this));
    },

    render: function($context) {
      var attachment = $($context).closest(this._view.attachment),
      retval = this._view.render(attachment.length ? attachment : document.body);
      this._view.position($context);
      return retval;
    },

    toggle: function($context) {
      if (this._view.$view && this._view.$view.length) {
        this._view.toggle();
        this._view.position($context);
      }
      else {
        this.render($context || this.$context);
        async(this._view.show.bind(this._view));
      }
    }
  });

  return constructor;
});
