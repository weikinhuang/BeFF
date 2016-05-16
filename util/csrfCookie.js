/**
 * Module wrapper around usage of the CSRF token stored in the cookie store
 */
define([
  './cookie'
], function(cookie) {
  'use strict';

  /**
   * Generate a random integer between 0 and 1000000.
   * Used as the value of the CSRF token
   *
   * @return {Number}
   */
  function genRandom() {
    return Math.floor(Math.random() * 1000000);
  }

  /**
   * Sets the CSRF cookie to a random value. Calling multiple times will
   * set the cookie to a new value
   */
  function genCookie() {
    cookie.set('bcp', genRandom(), { path: '/', expires: 1 });
    return cookie.get('bcp');
  }

  /**
   * Expire the CSRF cookie to remove it from the browser's cookie store
   *
   * NOTE: Added for completeness, as there is currently nowhere that
   *       needs to manually expire the token.
   */
  function expireCookie() {
    cookie.set('bcp', null);
  }

  /**
   * Returns the current value of the CSRF token stored in the browser's cookie
   * store.
   *
   * @return {String}
   */
  function getCookie() {
    return cookie.get('bcp') || genCookie();
  }

  return {
    get: getCookie,
    expire: expireCookie
  };
});
