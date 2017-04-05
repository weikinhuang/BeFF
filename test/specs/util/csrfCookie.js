define(['util/csrfCookie'], function(csrfCookie) {
  'use strict';

  describe('util/csrfCookie', function() {
    beforeEach(function() {
      document.cookie = 'bcp=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    });

    afterEach(function() {
      csrfCookie.expire();
    });

    describe('.get', function() {
      it('returns the value of the csrf cookie', function() {
        var value = '123';

        document.cookie = 'bcp=' + value;
        expect(csrfCookie.get()).toBe(value);
      });

      it('generates a UUIDv4', function() {
        var cookieVal = csrfCookie.get();
        var regEx = /[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$/g;
        expect(regEx.test(cookieVal)).toBeTruthy();
      });

      it('sets the csrf cookie when not there', function() {
        expect(document.cookie).not.toContain('bcp=');
        var value = csrfCookie.get();
        expect(value).toBeDefined();
        expect(document.cookie).toContain('bcp=');
      });
    });

    describe('.expire', function() {
      it('removes the csrf cookie', function() {
        document.cookie = 'bcp=123';
        expect(document.cookie).toContain('bcp=');
        csrfCookie.expire();
        expect(document.cookie).not.toContain('bcp=');
      });
    });
  });
});
