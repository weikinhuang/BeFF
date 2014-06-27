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
      this.$block.show();
      return this._super();
    },

    hide: function() {
      if (!this.$view) { return; }
      this.$block.hide();
      return this._super();
    }
  }, {
    Z_INDEX: 250
  });

  return constructor;
});
