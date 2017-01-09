define([
  '../Component'
], function(Component) {
  'use strict';

  /**
   * A wrapper around HTML5 FileReader that provides additional information about the read image.
   *
   * @module  dom/FileReader
   * @constructor
   */
  return Component.extend({
    init: function() {
      this.reader = new FileReader();
    },

    /**
     * Reads the given file, encapsulated for mocking in tests
     *
     * @param  {File|Blob} file
     */
    _read: function(file) {
      this.reader.readAsDataURL(file);
    },

    /**
     * Reads the file and generates an image for getting additional information
     *
     * @param {File|Blob} file - the file from an input[type=file] to be read.
     * @returns {Promise} - Resolves with an object containing the loaded
     *                      blob's attributes and computed properties
     */
    load: function(file) {
      return new Promise(function(resolve, reject) {
        this.reader.onload = function(e) {
          var result = {
            size: file.size,
            name: e.target.name || file.name,
            mode: 'data',
            mime: e.target.type || file.type,
            result: e.target.result,
            // data without 'data:' and 'base64' prefixes
            // Necessary when feeding potential image data to a cropper
            source: e.target.result.split(',')[1]
          };

          result.isImage = !!result.mime.match('image');

          resolve(result);
        };

        this.reader.onerror = function() {
          reject(arguments);
        };

        this._read(file);
      }.bind(this));
    }
  }, {
    /**
     * Reads the file and generates an image for getting additional information
     *
     * @param {File|Blob} file - the file from an input[type=file] to be read.
     * @returns {Promise} - Resolves with an object containing the loaded
     *                      blob's attributes and computed properties
     */
    promise: function(file) {
      var self = new this();
      return self.load(file);
    }
  });
});
