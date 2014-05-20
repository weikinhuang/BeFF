define([
  'nbd/trait/promise',
  '../Dialog',
  '../../View/Dialog/Popup',
  '../../util/throttle'
], function(promise, Dialog, Popup, throttle) {
  'use strict';

  var Modal = Dialog.extend({
    switchView: function() {
      this._super.apply(this, arguments);
      this._view
      .on('confirm', function() {
        this.confirm.apply(this, arguments);
      }, this)
      .on('hide', function() {
        this.cancel.apply(this, arguments);
      }, this);
    },

    confirm: function() {
      this.resolve();
    },

    cancel: function() {
      this.reject();
    }
  }, {
    VIEW_CLASS: Popup,

    init: function(options, promiseGenerator) {
      var dialog = new this(options),
      destroy = dialog.destroy.bind(dialog);

      function resolveGenerator() {
        var retval = promiseGenerator();
        if (retval && typeof retval.then === 'function') {
          retval.then(dialog.resolve.bind(dialog));
        }
        else {
          dialog.resolve(retval);
        }
        return retval;
      }

      if (typeof promiseGenerator === 'function') {
        dialog.confirm = function() {
          throttle(resolveGenerator);
        };
      }

      dialog.render(document.body);
      dialog.then(destroy, destroy);
      return dialog;
    }
  })
  .mixin(promise);

  return Modal;
});
