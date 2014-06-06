define(['util/error', 'nbd/Promise'], function(error, Promise) {
  'use strict';

  describe('util/error', function() {
    describe('.handlers', function() {
      it('is an array', function() {
        expect(error.handlers).toEqual(jasmine.any(Array));
      });
    });

     afterEach(function(){
      error.handlers.length = 0;
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


    it('chains errors through handlers', function(done) {
      var spy1 = jasmine.createSpy().and.throwError('pokemon'),
          spy2 = jasmine.createSpy().and.throwError('gengar'),
          spy3 = jasmine.createSpy(),
          p = new Promise();

      error.handlers.push(spy1, spy2, spy3);

      p.catch(error)
      .finally(function() {
        expect(spy1).toHaveBeenCalledWith('foo');
        expect(spy2).toHaveBeenCalled();
        expect(spy3).toHaveBeenCalled();
        })
      .finally(done);

      p.reject('foo');
    });

     it('escapes when error not thrown', function(done) {
      var spy1 = jasmine.createSpy().and.throwError('pokemon'),
          spy2 = jasmine.createSpy(),
          spy3 = jasmine.createSpy(),
          p = new Promise();

      error.handlers.push(spy1, spy2, spy3);

      p.catch(error)
      .finally(function() {
        expect(spy1).toHaveBeenCalledWith('foo');
        expect(spy2).toHaveBeenCalled();
        expect(spy3).not.toHaveBeenCalled();
        })
      .finally(done);

      p.reject('foo');
    });

  });
});
