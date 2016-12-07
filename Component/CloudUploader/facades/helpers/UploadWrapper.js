define([
  'nbd/Promise',
  'nbd/Class',
], function(Promise, Class) {
  return Class.extend({
    init: function(blobData) {
      this.blobData = blobData;
      this.upload = new Promise(function(resolve) {
        this._resolveUpload = resolve;
      }.bind(this));
    },

    submit: function(data) {
      this._resolveUpload({
        file: data.file,
        observable: this._getObservable()
      });
    },

    validationError: function(validationError) {
      this._validationError = validationError;
      this.submit({ file: null });
    },

    progress: function(progress) {
      this._progress = progress;
    },

    complete: function(complete) {
      this._complete = complete;
    },

    error: function(error) {
      this._error = error;
    },

    _getObservable: function() {
      return {
        forEach: function(next) {
          this.progress = next;

          if (this._progress) {
            next(this._progress);
          }

          if (this._error || this._validationError) {
            return Promise.reject(this._error || this._validationError);
          }
          else if (this._complete) {
            return Promise.resolve(this._complete);
          }

          return new Promise(function(resolve, reject) {
            this.complete = resolve;
            this.error = reject;
          }.bind(this));
        }.bind(this)
      };
    }
  });
});
