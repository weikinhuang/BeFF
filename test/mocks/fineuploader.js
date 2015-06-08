define([
  'jquery',
  'nbd/Promise',
  '../dom/FileReader',
  'fixtures/dom/FileReader'
], function($, Promise, FileReader, image) {
  'use strict';

  function FineUploaderBasic(options) {
    this._options = options;

    // Overriden since FileReader.readAsDataUrl results in broken image data during testing
    FileReader.prototype._read = jasmine.createSpy().and.callFake(function(file) {
      this.reader.readAsText(file);
    });

    // Our fake/pre-uploaded image
    var blob = new Blob([image.result], {type: image.mime});
    blob.name = image.name;
    this._blob = blob;

    this._buttons = [{
      getInput: function() {
        return $('<input type="file"></input>').html();
      }
    }];
  }

  FineUploaderBasic.prototype = {
    getFile: function() {
      return this._blob;
    },

    cancelAll: function() {},

    getUploads: function() {
      return this._blob ? [this._blob] : [];
    },

    setParams: function(params) {
      this._params = params;
    },

    reset: function() {
      this._blob = null;
    },

    getFakeImageData: function() {
      return image.result;
    },

    getFakeImageName: function() {
      return this._blob.name;
    },

    /**
     * Fakes a submit
     *
     * @return {Promise}
     */
    fakeSubmit: function() {
      return this._options.callbacks.onSubmit(0, this._blob.name);
    },

    /**
     * Fakes progress
     *
     * @return {Promise}
     */
    fakeProgress: function() {
      var promise = new Promise();

      this.fakeSubmit().then(function() {
        this._options.callbacks.onProgress(0, this._blob.name, 10, 100);
        promise.resolve();
      }.bind(this));

      return promise;
    },

    /**
     * Fakes a complete. Response may be supplied with an error code to simulate a server-invalid upload
     *
     * @param  {Object} response server response
     * @return {Promise}
     */
    fakeComplete: function(response) {
      var promise = new Promise();

      response = response || {};
      this.fakeSubmit().then(function() {
        this._options.callbacks.onComplete(0, this._blob.name, response);
        promise.resolve();
      }.bind(this));

      return promise;
    },

    /**
     * Fakes a complete. Response may be supplied with an error code to simulate a server-invalid upload
     *
     * @param  {Object} response server response
     * @return {Promise}
     */
    fakeAllComplete: function() {
      this._options.callbacks.onAllComplete();
    },

    /**
     * Fakes a cancel
     *
     * @return {Promise}
     */
    fakeCancel: function() {
      var promise = new Promise();

      this.fakeSubmit().then(function() {
        this._options.callbacks.onCancel();
        promise.resolve();
      }.bind(this));

      return promise;
    },

    /**
     * Fakes an error
     *
     * @param  {String} [error]
     * @param  {Object} [xhr]
     * @return {Promise}
     */
    fakeError: function(error, xhr) {
      var promise = new Promise();

      this.fakeSubmit().then(function() {
        this._options.callbacks.onError(0, this._blob.name, error, xhr);
        promise.resolve();
      }.bind(this));

      return promise;
    }
  };

  return {
    s3: {
      FineUploaderBasic: FineUploaderBasic
    }
  };
});
