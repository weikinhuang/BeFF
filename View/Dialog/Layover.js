define([
  'jquery',
  '../Dialog'
], function($, View) {
  'use strict';

  var constructor = View.extend({
    dialogData: {
      dialogType: "layover",
      toolbar: true
    },

    show: function() {
      if (!this.$view) { return; }
      this.scrollTop = this.scrollTop || window.pageYOffset;
      $('html').addClass('overflow-hidden');
      return this._super();
    },

    hide: function() {
      if (!this.$view) { return; }
      $('html').removeClass('overflow-hidden');
      window.scrollTo(0, this.scrollTop);
      delete this.scrollTop;
      return this._super();
    }
  });

  return constructor;
});
