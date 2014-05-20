define([
  'nbd/util/async',
  'nbd/util/extend',
  '../View',
  '../ux/keyboard',
  'hgn!../template/dialog'
], function(async, extend, View, keyboard, dialogTemplate) {
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

    _bindButtons: function($view) {
      $view
      .on('click', '.js-confirm', this.trigger.bind(this, 'confirm'))
      .on('click', '.js-close', this.hide.bind(this))
      .on('click', '.js-disabled', false);
    },

    dialogTemplate: dialogTemplate,

    template: function(data) {
      return this.dialogTemplate(extend({
        content: this._super(data)
      }, this.dialogData, data));
    },

    position: function() {},

    show: function() {
      keyboard.on({
        escape: this.hide.bind(this)
      });
      return this.trigger('show', this.$view);
    },

    hide: function() {
      keyboard.off();
      return this.trigger('hide', this.$view);
    },

    toggle: function() {
      var state = this.$view.is(':visible');
      return this[state ? 'hide': 'show']();
    }
  });

  return constructor;
});
