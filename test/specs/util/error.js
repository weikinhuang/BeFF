define(['util/error', 'nbd/Promise'], function(error, Promise) {
  'use strict';

  describe('util/error', function() {
    describe('.handlers', function() {
      it('is an array', function() {
        expect(error.handlers).toEqual(jasmine.any(Array));
      });
    });

    it('calls handlers', function(done) {
      var spy = jasmine.createSpy(),
      p = new Promise();

      error.handlers.push(spy);

      p.catch(error)
      .finally(function() {
        expect(spy).toHaveBeenCalledWith('foo');
      })
      .finally(done);

      p.reject('foo');
    });
  });
});
