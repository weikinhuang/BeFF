define([
  'jquery',
  '@behance/nbd/Promise',
  '@behance/nbd/trait/pubsub',
  '@behance/nbd/util/extend',
  '../Component',
  './CloudUploader/facades/promise',
  './CloudUploader/facades/promises',
  '@behance/fine-uploader'
], function($, Promise, pubsub, extend, Component, promiseFacade, promisesFacade, fineUploader) {
  'use strict';

  /**
   * Wrapper around FineUploader that provides sane defaults,
   * filereader support, and pubsub events for upload lifecycle.
   *
   * @example
   *   Uploader
   *   .init(myOptionOverrides)
   *   .on('submit', callback)
   *   .on('complete', callback);
   *
   * @module  Component/CloudUploader
   * @constructor
   *
   * @fires module:Component/CloudUploader#complete
   * @fires module:Component/CloudUploader#error
   * @fires module:Component/CloudUploader#cancel
   * @fires module:Component/CloudUploader#submit
   * @fires module:Component/CloudUploader#progress
   */
  return Component.extend({
    /**
     * Uploader configuration defaults
     * @type {Object}
     */
    _defaultOptions: {
      multiple: false,
      disabled: false,
      messages: {
        typeError: 'Please upload a file with these extensions: {extensions}.',
        sizeError: '{file} is too large, the maximum file size is {sizeLimit}.',
        minSizeError: '{file} is too small, please choose an image that is at least {minSizeLimit} pixels.',
        emptyError: '{file} is empty, please select another image.',
        noFilesError: 'You did not select any files to upload',
        tooManyItemsError: 'You have uploaded ({netItems}) images. Please upload {itemLimit} image(s) at a time.',
        maxHeightImageError: 'Please choose an image that is less than {maxHeight} pixels tall.',
        maxWidthImageError: 'Please choose an image that is less than {maxWidth} pixels wide.',
        minHeightImageError: 'Please choose an image that is at least {minHeight} pixels tall.',
        minWidthImageError: 'Please choose an image that is at least {minWidth} pixels wide.',
        uploadError: '{file} failed to upload. Please try again.',
        retryFailTooManyItems: 'You have reached your upload limit. Please check back later to upload more images.',
        onLeave: 'The files are being uploaded, if you leave now the upload will be canceled.'
      },
      text: {
        defaultResponseError: ''
      }
    },

    /**
     * Intiliazes the uploader with the provided options.
     *
     * @example
     *
     * CloudUploader.init({
     *   request: {
     *      endpoint: 'https://s3.amazonaws.com/bucketname',
     *      accessKey: '123456789'
     *    },
     *    signature: {
     *      endpoint: '/path/to/sign_request_url'
     *    }
     *  });
     *
     * @param  {Object} options
     * @param  {Object} options.request
     * @param  {Object} options.signature
     */
    init: function(options) {
      var config = {};

      this._verifyOptions(options);

      // using $.extend for ability to do deep recursive extension
      $.extend(true, config, this._defaultOptions, options, {
        callbacks: {
          onSubmit: this._onSubmit.bind(this),
          onProgress: this._onProgress.bind(this),
          onComplete: this._onComplete.bind(this),
          onCancel: this._onCancel.bind(this),
          onError: this._onError.bind(this),
          onAllComplete: this._onAllComplete.bind(this),
          onValidateBatch: this._onValidateBatch.bind(this)
        },
        chunking: {
          enabled: true,
          mandatory: true
        }
      });

      // move the drift option to a location that a hacked version of fineuploader can find it
      config.signature.params = config.signature.params || {};
      config.signature.params.drift = options.drift;

      if (!config.button) {
        config.button = $('<div>').css({
          position: 'absolute',
          left: -999999,
          top: -999999
        }).appendTo(document.body)[0];
        this._buttonCreated = true;
      }

      this._uploader = new fineUploader.s3.FineUploaderBasic(config);
      this._config = config;
    },

    bind: function() {
      $(this._config.button).on('click.cloud-uploader', 'input', function() {
        if (this._isDisabled()) {
          return false;
        }

        if (!this._isBrowserSupported()) {
          this.trigger('unsupportedBrowser');
          return false;
        }
      }.bind(this));
    },

    unbind: function() {
      $(this._config.button).off('.cloud-uploader');
      if (this._buttonCreated) {
        $(this._config.button).remove();
      }
    },

    addFiles: function(files) {
      this._uploader.addFiles(files);
    },

    reset: function() {
      this._uploader.reset();
    },

    /**
     * Specifies an element as a drop target for drag and drop files
     *
     * @param  {DOMNode} element
     * @return {Component/CloudUploader}
     */
    setDropElement: function(element) {
      var uploader = this._uploader;

      this._dropZone = new fineUploader.DragAndDrop({
        dropZoneElements: [element],
        callbacks: {
          processingDroppedFiles: function() {
            // TODO: fire an event on the uploader so that, e.g., a spinner can be shown
          },
          processingDroppedFilesComplete: function(files) {
            // TODO: fire an event on the uploader so that, e.g., a spinner can be hidden
            uploader.addFiles(files);
          }
        }
      });

      return this;
    },

    /**
     * Returns the AWS bucket url that files are being uploaded to.
     *
     * @return {String}
     */
    getUploadEndpoint: function() {
      return this._config.request.endpoint;
    },

    /**
     * Returns the AWS key of the uploaded file.
     *
     * @param  {Number} id
     * @return {String}
     */
    getUploadPath: function(id) {
      return this._uploader.getKey(id);
    },

    /**
     * Opens the file chooser
     *
     * @param  {Number} [idx=0] - The index of the input field to get (if there are multiple)
     */
    choose: function(idx) {
      $(this._getInput(idx))
      .one('click.cloud-uploader', function(e) {
        // fine uploader requires the configured button be clicked to trigger the "choose" OS
        // picker. This guard is to block the programmatic triggering of the click event from
        // bubbling out of the DOM managed by CloudUploader.
        if (!e.originalEvent) {
          e.stopPropagation();
        }
      })
      .trigger('click.cloud-uploader');
    },

    /**
     * Cancels all in progress uploads.
     */
    cancelAll: function() {
      this._uploader.cancelAll();
    },

    /**
     * Returns a human readable size given bytes
     *
     * @param  {Number} sizeInBytes
     * @return {String}
     */
    formatSize: function(sizeInBytes) {
      return this._uploader._formatSize(sizeInBytes);
    },

    /**
     * Sets whether to accept multiple or individual files
     *
     * @param {Boolean} multiple
     * @param  {Number} [idx=0] - The index of the input field to get (if there are multiple)
     * @return {Component/CloudUploader} for chaining
     */
    setMultiple: function(multiple, idx) {
      this._getButton(idx).setMultiple(multiple);

      return this;
    },

    /**
     * Verifies that the passed in options contain the minimum required config
     *
     * @throws {Error} If configuration is invalid
     */
    _verifyOptions: function(options) {
      if (!options.request || !options.request.endpoint || !options.request.accessKey) {
        throw new Error('Please provide a proper `request` configuration property');
      }

      if (!options.signature || !options.signature.endpoint) {
        throw new Error('Please provide a proper `signature` configuration property');
      }

      if (!('drift' in options)) {
        throw new Error('Please provide a proper `drift` configuration property');
      }
    },

    /**
     * Returns whether or not uploads are currently disabled. Serves as an extension point for implementation-specific override.
     *
     * @return {Boolean}
     */
    _isDisabled: function() {
      return this._config.disabled;
    },

    /**
     * Executes the provided validator, or returns true if no validator was provided
     *
     * @param {File} file [description]
     * @return {Promise|Boolean}
     */
    _validator: function(file) {
      var result = this._config.validator ? this._config.validator(file) : true;

      // convert false into a rejected Promise to stop submission when the validator returns false
      if (result === false) {
        return Promise.reject();
      }

      return result;
    },

    /**
     * Whether or not the current browser has client-side rendering support
     *
     * @return {Boolean}
     */
    _isBrowserSupported: function() {
      return !!window.FileReader;
    },

    /**
     * Wrapper around a fineUploader hack to get access to the generated input field
     *
     * @param  {Number} [idx=0] - The index of the input field to get (if there are multiple)
     * @return {DOMNode}
     */
    _getInput: function(idx) {
      return this._getButton(idx).getInput();
    },

    /**
     * Gets the button associated with this uploader
     *
     * @param  {Number} [idx=0] - The index of the input field to get (if there are multiple)
     * @return {Button}
     */
    _getButton: function(idx) {
      return this._uploader._buttons[idx || 0];
    },

    /**
     * Returns the uploader's file with the given id
     * @param  {Number} id
     * @return {FineUploader#File}
     */
    _getFile: function(id) {
      return this._uploader.getFile(id);
    },

    _onSubmit: function(id, name) {
      var file = this._getFile(id);

      file.id = file.id || id;

      return new Promise(function(resolve) {
        resolve(this._validator(file));
      }.bind(this))
      .then(function() {
        this.trigger('submit', {
          file: file,
          id: id,
          name: name
        });
      }.bind(this), function(reason) {
        // ensures any rejections from _validator are propagated as errors
        // while still ending in a rejected promise so that fineuploader prevents submission
        this._onError(id, name, reason);
        throw reason;
      }.bind(this));
    },

    _onValidateBatch: function(files) {
      this.trigger('validateBatch', {
        files: files
      });
    },

    _onProgress: function(id, name, loaded, total) {
      this.trigger('progress', {
        id: id,
        file: this._getFile(id),
        name: name,
        loaded: loaded,
        total: total
      });
    },

    _onComplete: function(id, name, response) {
      this.trigger('complete', {
        response: response,
        id: id,
        name: name,
        file: this._getFile(id),
        uploadEndpoint: this.getUploadEndpoint(),
        uploadPath: this.getUploadPath(id)
      });
    },

    _onCancel: function(id, name) {
      this.trigger('cancel', {
        id: id,
        name: name
      });
    },

    _onAllComplete: function() {
      this.trigger('allComplete');
    },

    _onError: function(id, name, message, xhr) {
      if (xhr) {
        message = this._config.messages.uploadError.replace('{file}', name);
      }

      this.trigger('error', {
        id: id,
        name: name,
        message: message,
        xhr: xhr
      });
    }
  }, {
    promises: function(options, files) {
      return promisesFacade(this, options, files);
    },

    promise: function(options, files) {
      return promiseFacade(this, options, files);
    },

    setDropElement: function(element, cb) {
      return new fineUploader.DragAndDrop({
        dropZoneElements: [element],
        callbacks: {
          processingDroppedFilesComplete: cb
        }
      });
    }
  });
});
