define([
  'jquery',
  '../Dialog'
], function($, View) {
  'use strict';

  var constructor = View.extend({
    destroy: function() {
      this.hide();
      this._super();
    },

    dialogData: {
      dialogType: "layover",
      toolbar: true
    },

    rendered: function() {
      this.show();
    },

    show: function() {
      if (!this.$view) { return; }
      this.scrollTop = this.scrollTop || window.pageYOffset;
      $('html').addClass('overflow-hidden');
      this.$view.show();
      return this._super();
    },

    hide: function() {
      if (!this.$view) { return; }
      $('html').removeClass('overflow-hidden');
      window.scrollTo(0, this.scrollTop);
      delete this.scrollTop;
      this.$view.hide();
      return this._super();
    }
  });

  return constructor;
});
