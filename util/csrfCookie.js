/**
 * Module wrapper around usage of the CSRF token stored in the cookie store
 */
define([
  './cookie',
  'uuid/v4'
], function(cookie, uuidV4) {
  'use strict';

  /**
   * Sets the CSRF cookie to a random value. Calling multiple times will
   * set the cookie to a new value
   */
  function genCookie() {
    cookie.set('bcp', uuidV4(), { path: '/', expires: 1 });
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
