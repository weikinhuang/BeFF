define([
  'jquery',
  'nbd/Promise',
  '../Component',
  '../dom/FileReader',
  'fineuploader/all.fine-uploader'
], function($, Promise, Component, BeFileReader, fineUploader) {
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
        retryFailTooManyItems: 'You have reached your upload limit. Please check back later to upload more images.',
        onLeave: 'The files are being uploaded, if you leave now the upload will be canceled.'
      },
      text: {
        defaultResponseError: ''
      }
    },

    init: function(options) {
      var config = {};

      // using $.extend for ability to do deep recursive extension
      $.extend(true, config, this._defaultOptions, options, {
        callbacks: {
          onSubmit: this._onSubmit.bind(this),
          onProgress: this._onProgress.bind(this),
          onComplete: this._onComplete.bind(this),
          onCancel: this._onCancel.bind(this),
          onError: this._onError.bind(this),
          onAllComplete: this._onAllComplete.bind(this)
        },
        chunking: {
          enabled: true,
          mandatory: true
        },
        signature: this._getSignatureConfig(),
        request: this._getRequestConfig()
      });

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

    reset: function() {
      this._uploader.reset();
    },

    /**
     * Specifies an element as a drop target for drag and drop files
     *
     * @param  {DOM Node} element
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
     * Opens the file chooser
     *
     * @param  {Number} [idx=0] - The index of the input field to get (if there are multiple)
     */
    choose: function(idx) {
      $(this._getInput(idx)).click();
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
     * Returns whether or not uploads are currently disabled. Serves as an extension point for implementation-specific override.
     *
     * @abstract
     * @return {Boolean}
     */
    _isDisabled: function() {
      throw new Error('Please override the _isDisabled function.');
    },

    /**
     * Returns an object that describes the `signature` property of the fineUploader options object.
     * The object at minimum must contain an `endpoint` property, which tells fineUploader where to retrieve a signed request
     * for AWS from.
     *
     * @example
     * { endpoint: '/sign_request' }
     *
     * @abstract
     * @return {Object}
     */
    _getSignatureConfig: function() {
      throw new Error('Please override the _getSignatureConfig function.');
    },

    /**
     * Returns an object that describes the `request` property of the fineUploader options object.
     * The object at minimum must contain an `endpoint` property and an `accessKey` property,
     * which tells fineUploader which AWS bucket to upload content to.
     *
     * @example
     * {
     *   endpoint: 'https://s3.amazonaws.com/name-of-bucket',
     *   accessKey: 'MYACCESSKEYHERE'
     * }
     *
     * @abstract
     * @return {Object}
     */
    _getRequestConfig: function() {
      throw new Error('Please override the _getRequestConfig function.');
    },

    /**
     * Extension point for custom validation of the submitted file. Return false or a rejected promise
     * to cancel the submission of the provided file.
     *
     * @param {File} file [description]
     * @return {Promise|Boolean}
     */
    _fileValidator: function(/*file*/) {
      return true;
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
     * @return {DOM Node}
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
     * Wrapper function for providing fileReaderData to the user extended _fileValidator function and
     * converting the result into a promise.
     *
     * @param  {File} file
     * @return {Promise}
     */
    _fileValidatorPromise: function(file) {
      return BeFileReader.promise(file).then(function(readerData) {
        file.readerData = readerData;
        var result = this._fileValidator(file);

        // convert false into a rejected Promise to stop submission when the validator returns false
        if (result === false) {
          return Promise.reject();
        }

        return result;
      }.bind(this));
    },

    /**
     * Returns the uploader's file with the given id
     * @param  {Number} id
     * @return {FineUploader File}
     */
    _getFile: function(id) {
      return this._uploader.getFile(id);
    },

    _onSubmit: function(id) {
      var file = this._getFile(id);

      file.id = file.id || id;

      return this._fileValidatorPromise(file).then(function() {
        this.trigger('submit', file);
      }.bind(this));
    },

    _onProgress: function(id, name, loaded, total) {
      this.trigger('progress', {
        id: id,
        name: name,
        loaded: loaded,
        total: total
      });
    },

    _onComplete: function(id, name, response) {
      this.trigger('complete', {
        response: response,
        id: id,
        file: this._getFile(id)
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
      this.trigger('error', {
        id: id,
        name: name,
        message: message,
        xhr: xhr
      });
    }
  });
});
