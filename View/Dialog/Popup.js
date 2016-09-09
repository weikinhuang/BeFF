define([
  'jquery',
  'nbd/util/extend',
  '../Dialog',
  'jqueryui/position'
], function($, extend, View) {
  'use strict';

  var constructor = View.extend({
    _selector: '.popup',

    dialogData: {
      dialogType: 'popup',
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
      var zIndexes = $(this._selector).toArray()
      .map(function(el) {
        var elZIndex = Number($(el).css('zIndex'));

        if (isNaN(elZIndex)) {
          return 0;
        }

        return elZIndex + 2;
      });

      zIndexes.push(constructor.Z_INDEX);
      this._zIndex = Math.max.apply(Math, zIndexes);

      return this._super.apply(this, arguments);
    },

    rendered: function() {
      this.$block = this.$block || $('<div>', {
        class: 'blocking-div'
      })
      .on('click', function(e) {
        e.stopPropagation();

        this.hide();
      }.bind(this))
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
