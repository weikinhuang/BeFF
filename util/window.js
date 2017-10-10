define([
  '@behance/nbd/util/deparam'
], function(deparam) {
  'use strict';

  /**
   * Used for spying purposes within tests
   */
  return {
    /**
     * Gets the origin of the window (e.g. https://example.com:1234)
     *
     * @return {string}
     */
    getOrigin: function() {
      return window.location.protocol + '//' + window.location.host;
    },

    /**
     * Gets value out of window.location
     *
     * @param {string} key
     *
     * @return {string|Object}
     */
    getLocation: function(key) {
      if (!key) {
        return window.location;
      }

      return window.location[key];
    },

    /**
     * Calls window.open
     *
     * @return {Window}
     */
    open: function() {
      return window.open.apply(window, arguments);
    },

    /**
     * Is the current window an iframe
     *
     * @return {Boolean}
     */
    isIframe: function() {
      return window.top !== window;
    },

    /**
     * sets the window.location
     *
     * @param {string} location
     */
    setLocation: function(location) {
      window.location.assign(location);
    },

    /**
     * calls window.location
     *
     * @param {string} location
     */
    replaceLocation: function(location) {
      window.location.replace(location);
    },

    /** Reloads the current page */
    reloadLocation: function() {
      window.location.reload();
    },

    /** @return {String} */
    getProtocol: function() {
      return window.location.protocol;
    },

    /** @return {String} */
    getPath: function() {
      var loc = window.location;
      return loc.pathname + loc.search + loc.hash;
    },

    /**
     * Gets object representation of window.location.search
     *
     * @return {Object}
     */
    getSearchObject: function() {
      var search = this.getLocation('search');

      if (!search) {
        return {};
      }

      // Remove initial question mark
      search = search.substr(1);

      return deparam(search);
    }
  };
});
