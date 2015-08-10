define([
  'nbd/Promise',
  '../Component'
], function(Promise, Component) {
  'use strict';

  /**
   * Represents a wrapper of window.Image
   * Mainly used for mocking purposes
   *
   * @constructor
   * @module  be/Image
   * @fires module:be/Image#load
   * @fires module:be/Image#error
   *
   * @example
   *   (new Image())
   *   .on('load', function() {})
   *   .on('error', function() {})
   *   .src(Blob|File);
   */
  return Component.extend({
    /**
     * @type {HTMLImageElement}
     */
    image: null,

    /**
     * @param  {?HTMLImageElement} imageElement
     */
    init: function(imageElement) {
      var self = this;

      this.image = imageElement || new window.Image();

      this.image.onload = function() {
        self.trigger('load', this);
      };

      this.image.onerror = function() {
        self.trigger('error', arguments);
      };
    },

    /**
     * Returns true when an image has already loaded or error and has a sane src attribute.
     * This works around the fact that the dom will list an image with an empty src as "complete".
     *
     * @return {Boolean}
     */
    isComplete: function() {
      return this.image.complete && this.image.src;
    },

    /**
     * Returns the display width of the image, constrained by page layout
     *
     * @return {Number}
     */
    displayWidth: function() {
      return this.image.width;
    },

    /**
     * Returns the display height of the image, constrained by page layout
     *
     * @return {Number}
     */
    displayHeight: function() {
      return this.image.height;
    },

    /**
     * Returns the natural width of the image, not constrained by page layout
     *
     * @return {Number}
     */
    width: function() {
      return this.image.naturalWidth;
    },

    /**
     * Returns the natural height of the image, not constrained by page layout
     *
     * @return {Number}
     */
    height: function() {
      return this.image.naturalHeight;
    },

    /**
     * Set the image src
     * @param {String} imageData
     */
    src: function(imageData) {
      this.image.src = imageData;
    },

    /**
     * Returns whether the src property is a data-uri of a CMYK jpeg.
     *
     * @throws {Error} If the src attribute is not a data-uri.
     * @return {Boolean}
     */
    isCMYK: function() {
      if (this.image.src.indexOf('data:') !== 0) {
        throw new Error('src attribute is not a data-uri');
      }

      var base64 = this.image.src.split(',')[1],
          decoded = window.atob(base64);

      // JPEG's with less than 4 color channels can't be CMYK. More importantly,
      // this logic matches the image service logic that has been used in production
      // since at least 2012.
      return this._getChannelCount(decoded) > 3;
    },

    /**
     * Returns the channel count in a JPG, 0 for other image formats.
     *
     * @see  https://github.com/tommoor/fastimage/blob/master/Fastimage.php, which this implementation
     * was adapted from.
     *
     * @param {String} buffer
     * @throws {Error} If the src attribute is not a data-uri.
     * @return {Number}
     */
    _getChannelCount: function(buffer) {
      function getChars(count) {
        if (strPos + count > buffer.length) {
          return false;
        }

        var substr = buffer.substring(strPos, strPos + count);
        strPos += count;
        return substr;
      }

      function getByte() {
        return getChars(1);
      }

      function getInt16() {
        var bytes = getChars(2);
        return (bytes.charCodeAt(0) << 8) + bytes.charCodeAt(1);
      }

      function getStateFromByte(byte) {
        return byte === '\xFF' ? 'startOfFrame' : 'getNextByte';
      }

      function getStateFromStartOfFrame() {
        var byte = getByte(),
            validReadMarkers = [
              '\xC0',
              '\xC1',
              '\xC2',
              '\xC3',
              '\xC5',
              '\xC6',
              '\xC7',
              '\xC9',
              '\xCA',
              '\xCB',
              '\xCD',
              '\xCE',
              '\xCF'
            ];

        if (validReadMarkers.indexOf(byte) > -1) {
          return 'readInfo';
        }

        if (byte === '\xFF') {
          return 'startOfFrame';
        }

        return 'skipFrame';
      }

      var state = 'getNextByte',
          strPos = 0,
          byte,
          numCharactersToSkip,
          header = getChars(2);

      // Ensure the first two bytes are the jpeg header
      if (header !== '\xFF\xd8') {
        return 0;
      }

      while (strPos < buffer.length) {
        switch (state) {
          case 'getNextByte':
            byte = getByte();
            if (byte === false) {
              return 0;
            }

            state = getStateFromByte(byte);
            break;

          case 'startOfFrame':
            state = getStateFromStartOfFrame();
            break;

          case 'skipFrame':
            numCharactersToSkip = getInt16() - 2;
            getChars(numCharactersToSkip);
            state = 'getNextByte';
            break;

          case 'readInfo':
            // the info frame contains a 5 byte header, followed by 1 byte for height, width, and channel respectively.
            return getChars(8).charCodeAt(7);
        }
      }
    }
  }, {
    /**
     * Returns a promise resolved with dimensions of the image representing the url
     *
     * @param  {String} url
     * @return {Promise}
     */
    getDimensions: function(url) {
      var Image = this;

      return new Promise(function(resolve, reject) {
        var img = new Image();

        img.on('load', function() {
          resolve({
            displayWidth: img.displayWidth(),
            displayHeight: img.displayHeight(),
            width: img.width(),
            height: img.height()
          });
        })
        .on('error', function() {
          reject(arguments);
        })
        .src(url);
      });
    },

    /**
     * Returns a promise that is resolved when the image tag is complete (i.e. loaded or error and has valid src attribute).
     *
     * @param  {HTMLImageElement} imageElement
     * @return {Promise}
     */
    whenComplete: function(imgElement) {
      var Image = this;

      return new Promise(function(resolve, reject) {
        var img = new Image(imgElement);

        if (img.isComplete()) {
          resolve();
        }
        else {
          img.on('load error', resolve);
        }
      });
    }
  });
});
