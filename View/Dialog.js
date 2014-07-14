define([
  'nbd/util/async',
  'nbd/util/extend',
  '../View',
  '../ux/keyboard',
  '../dom/transitionEnd',
  'hgn!../template/dialog'
], function(async, extend, View, keyboard, transitionEnd, dialogTemplate) {
  'use strict';

  var constructor = View.extend({
    init: function(model) {
      this._super(model);
      this
      .on('postrender', this._bindButtons)
      .on('postrender', function() {
        async(this.position.bind(this));
      });
    },

    destroy: function() {
      this.hide();
      this._super.apply(this, arguments);
    },

    _bindButtons: function($view) {
      $view
      .on('click', '.js-confirm', this.trigger.bind(this, 'confirm'))
      .on('click', '.js-close', this.hide.bind(this))
      .on('click', '.js-disabled', false)
      // "annotate" the event
      .on('click touchend', function(e) {
        e.originalEvent._view = this;
      }.bind(this));
    },

    dialogTemplate: dialogTemplate,

    template: function(data) {
      return this.dialogTemplate(extend({
        content: this._super(data)
      }, this.dialogData, data));
    },

    position: function() {},

    _shown: false,
    _shownClass: 'shown',

    show: function() {
      if (this._shown) { return this; }
      this._shown = true;
      this.$view.show();
      async(function() {
        this.$view.toggleClass(this._shownClass, this._shown);
      }.bind(this));

      keyboard.on({
        escape: this.hide.bind(this)
      });
      return this.trigger('show', this.$view);
    },

    hide: function() {
      if (!this._shown) { return this; }
      this._shown = false;

      transitionEnd(this.$view).then(function() {
        this.$view.hide();
      }.bind(this));

      this.$view.toggleClass(this._shownClass, this._shown);

      keyboard.off();
      return this.trigger('hide', this.$view);
    },

    toggle: function() {
      return this[this._shown ? 'hide': 'show']();
    }
  });

  return constructor;
});
