define([
  'jquery',
  'nbd/util/extend',
  '../Dialog',
  'jqueryui/jquery.ui.position'
], function($, extend, View) {
  'use strict';

  var constructor = View.extend({
    dialogData: {
      dialogType: "popup",
      toolbar: true
    },

    destroy: function() {
      this._super.apply(this, arguments);
      if (this.$block) {
        this.$block.remove();
        this.$block = null;
      }
    },

    render: function() {
      constructor.Z_INDEX += 2;
      this._zIndex = constructor.Z_INDEX;
      return this._super.apply(this, arguments);
    },

    rendered: function() {
      this.$block = this.$block || $('<div>', {
        class: "blocking-div"
      })
      .insertAfter(this.$view);
    },

    position: function() {
      if (!this.$view) { return; }
      this.$view.position({ of: window });
      this.$view.css('zIndex', this._zIndex);
      this.$block.css('zIndex', this._zIndex - 1);
    },

    show: function() {
      if (!this.$view) { return; }
      if (!this.$view.parent().is(document.body)) {
        this.$view
        .appendTo(document.body)
        .after(this.$block);
      }
      return this._super();
    },

    hide: function() {
      if (!this.$view) { return; }
      this.$view.add(this.$block).detach();
      return this._super();
    },

    toggle: function() {
      var state = this.$view.parent().is(document.body);
      return this[state ? 'hide' : 'show']();
    }
  }, {
    Z_INDEX: 250
  });

  return constructor;
});
