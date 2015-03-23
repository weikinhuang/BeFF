define(['util/xhr', 'nbd/Promise'], function(xhr, Promise) {
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
    });

    it('makes correct AJAX call', function() {
      xhr(meta);
      var request = jasmine.Ajax.requests.mostRecent();
      expect(request.url).toBe('foo/bar');
      expect(request.method).toBe('POST');
      expect(request.data()).toEqual({foo: ['bar']});
    });

    it('fullfills promise on xhr success', function(done) {
      var success = jasmine.createSpy('ajaxSuccess'),
      error = jasmine.createSpy('ajaxFailure'),
      response = xhr(meta),
      request = jasmine.Ajax.requests.mostRecent(),
      text = 'you are awesome';

      request.response({
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

      request.response({
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
  });
});
