define([], function() {
  'use strict';

  /**
   * Calculates cookie expiration value
   * @param {Number|Date} option
   * @returns {String}
   */
  function getExpiration(option) {
    var date;

    if (option && (typeof option === 'number' || option.toUTCString)) {
      if (typeof option === 'number') {
        date = new Date();
        date.setTime(date.getTime() + (option * 24 * 60 * 60 * 1000));
      }
      else {
        date = option;
      }
      return '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
    }
    return '';
  }

  return {
    /**
     * Gets cookie with given name
     * @param {String} name
     * @returns {String|null}
     */
    get: function(name) {
      if (name && document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';'),
            i,
            currentCookie;

        for (i = 0; i < cookies.length; i++) {
          currentCookie = cookies[i].trim();
          // Does this cookie string begin with the name we want?
          if (currentCookie.substring(0, name.length + 1) === (name + '=')) {
            return decodeURIComponent(currentCookie.substring(name.length + 1));
          }
        }
      }
      return null;
    },

    /**
     * Sets cookie with given name, value, and options
     * @param {String} name
     * @param {Mixed} value
     * @param {Object} options
     * @returns {null}
     */
    set: function(name, value, options) {
      var expires, path, domain, secure;

      options = options || {};

      if (value === null) {
        value = '';
        options.expires = -1;
      }

      expires = getExpiration(options.expires);
      // CAUTION: Needed to parenthesize options.path and options.domain
      // in the following expressions, otherwise they evaluate to undefined
      // in the packed version for some reason...
      path = options.path ? '; path=' + (options.path) : '';
      domain = options.domain ? '; domain=' + (options.domain) : '';
      secure = options.secure ? '; secure' : '';
      document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    }
  };
});
