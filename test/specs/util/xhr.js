define(['util/xhr', '@behance/nbd/Promise', 'util/csrfCookie'], function(xhr, Promise, csrfCookie) {
  'use strict';

  describe('util/xhr', function() {
    var meta = {
      type: 'POST',
      url: 'foo/bar',
      data: {
        foo: 'bar'
      }
    };

    beforeEach(function() {
      jasmine.Ajax.install();
    });

    afterEach(function() {
      jasmine.Ajax.uninstall();
      csrfCookie.expire();
    });

    it('makes correct AJAX call', function() {
      xhr(meta);
      var request = jasmine.Ajax.requests.mostRecent();
      expect(request.url).toBe('foo/bar');
      expect(request.method).toBe('POST');
      expect(request.data()).toEqual({ foo: ['bar'] });
    });

    it('fullfills promise on xhr success', function(done) {
      var success = jasmine.createSpy('ajaxSuccess'),
          error = jasmine.createSpy('ajaxFailure'),
          response = xhr(meta),
          request = jasmine.Ajax.requests.mostRecent(),
          text = 'you are awesome';

      request.respondWith({
        status: 200,
        contentType: 'text/plain',
        responseText: text
      });

      response.then(success, error).then(function() {
        expect(success).toHaveBeenCalled();
        expect(success).toHaveBeenCalledWith(text);
        expect(error).not.toHaveBeenCalled();
      }).finally(done);
    });

    it('rejects promise on xhr failure', function(done) {
      var success = jasmine.createSpy('ajaxSuccess'),
          error = jasmine.createSpy('ajaxFailure'),
          response = xhr(meta),
          request = jasmine.Ajax.requests.mostRecent(),
          text = 'you are awesome';

      request.respondWith({
        status: 400,
        contentType: 'text/plain',
        responseText: text
      });

      response.then(success, error).then(function() {
        expect(success).not.toHaveBeenCalled();
        expect(error).toHaveBeenCalled();
        expect(error.calls.argsFor(0)[0].responseText).toEqual(text);
      }).finally(done);
    });

    describe('.abort', function() {
      it('is a function', function() {
        var response = xhr(meta);
        expect(response.abort).toEqual(jasmine.any(Function));
      });

      it('will not resolve promise after abort', function(done) {
        var success = jasmine.createSpy('ajaxSuccess'),
            error = jasmine.createSpy('ajaxFailure'),
            response = xhr(meta);

        response.abort();
        response.then(success, error).then(function() {
          expect(success).not.toHaveBeenCalled();
          expect(error).toHaveBeenCalled();
        }).finally(done);
      });
    });

    describe('CSRF', function() {
      it('adds header when string is provided', function() {
        var request;

        xhr('be/xhr');

        request = jasmine.Ajax.requests.mostRecent();
        expect(request.requestHeaders['X-BCP']).toBe(csrfCookie.get());
      });

      it('adds header when object is provided', function() {
        var request;

        xhr({ data: 'foostring' });

        request = jasmine.Ajax.requests.mostRecent();
        expect(request.requestHeaders['X-BCP']).toBe(csrfCookie.get());
      });

      it('preserves pre-flight modifications of the request', function() {
        var request;

        xhr({
          beforeSend: function(req) {
            req.setRequestHeader('X-FOO-HEADER', 'bar');
          }
        });

        request = jasmine.Ajax.requests.mostRecent();
        expect(request.requestHeaders['X-BCP']).toBe(csrfCookie.get());
        expect(request.requestHeaders['X-FOO-HEADER']).toBe('bar');
      });

      it('does not add CSRF header when `options.crossDomain` is true', function() {
        var request;

        xhr({ data: 'foostring', crossDomain: true });

        request = jasmine.Ajax.requests.mostRecent();
        expect(request.requestHeaders['X-BCP']).not.toExist();
      });
    });
  });
});
