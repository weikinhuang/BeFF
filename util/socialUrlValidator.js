define(function() {
  'use strict';

  return {
    /**
     * Check if a url's hostname is valid compared to a regex for the service
     *
     * @param {RegExp} pattern The hostname pattern to validate against
     * @param {String} url The full url to validate
     * @return {Boolean} Whether the url's hostname matches the pattern or not
     */
    isValid: function(pattern, url) {
      var parser = document.createElement('a');
      parser.href = url;
      return pattern.test(parser.hostname);
    },

    /**
     * Normalize a url to include a protocol.
     * This is helpful because with no protocol, hostname is assumed to be the current pages domain
     *
     * @param {String} url A url to check for protocol
     * @return {String} The url as is, or if necessary, with http:// prepended
     */
    normalize: function(url) {
      if (!/^https?:\/\//i.test(url)) {
        url = 'http://' + url;
      }

      return url;
    }
  };
});
