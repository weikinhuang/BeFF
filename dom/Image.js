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
