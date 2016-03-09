define([
  'util/cookie'
], function(cookie) {
  'use strict';

  /**
   * Ensures there are no cookies to interfere with tests
   */
  function resetCookies() {
    var cookies = document.cookie.split(';');

    cookies.forEach(function(cookie) {
      cookie = cookie.trim();

      var parts = cookie.split('='),
          key = parts[0];

      document.cookie = key + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    });
  }

  describe('util/cookie', function() {
    beforeEach(function() {
      resetCookies();
    });

    afterEach(function() {
      resetCookies();
    });

    describe('#set', function() {
      it('sets the value', function() {
        var value = 'mine=1';

        expect(document.cookie).not.toContain(value);
        cookie.set('mine', 1);
        expect(document.cookie).toContain(value);
      });

      it('removes the value', function(done) {
        cookie.set('mine', 3);
        cookie.set('mine', null, { expires: 0 });
        setTimeout(function() {
          expect(document.cookie).not.toContain('mine=');
          done();
        }, 1);
      });
    });

    describe('#get', function() {
      it('gets the value', function() {
        cookie.set('mine', 2);
        expect(cookie.get('mine')).toEqual('2');
      });

      it('returns null if undefined is requested', function() {
        expect(cookie.get()).toBeNull();
      });
    });
  });
});
