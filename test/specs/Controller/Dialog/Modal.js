define(['Controller/Dialog/Modal', 'nbd/Promise'], function(Modal, Promise) {
  'use strict';

  describe('Controller/Dialog/Modal', function() {
    describe('Modal.init', function() {
      var dialog;

      afterEach(function() {
        if (dialog) {
          dialog.destroy();
        }
      });

      it('creates a Modal', function() {
        dialog = Modal.init();
        expect(dialog).toEqual(jasmine.any(Modal));
      });

      it('creates a thenable', function() {
        dialog = Modal.init();
        expect(dialog.then).toEqual(jasmine.any(Function));
      });

      it('immediately renders', function() {
        spyOn(Modal.prototype, 'render');
        dialog = Modal.init();
        expect(dialog.render).toHaveBeenCalled();
      });

      it('passes data through', function() {
        dialog = Modal.init({ foo: 'bar' });
        expect(dialog.data.foo).toBe('bar');
      });

      it('uses promiseGenerator to wait', function(done) {
        var spy = jasmine.createSpy(),
        promise = new Promise();

        spy = spy.and.returnValue(promise);
        dialog = Modal.init(null, spy);

        dialog.confirm();
        expect(spy).toHaveBeenCalled();

        dialog.then(function(value) {
          expect(value).toBe('resolved value');
          dialog = null;
          done();
        });

        promise.resolve('resolved value');
      });

      it('throttles based on generated promise', function() {
        var spy = jasmine.createSpy(),
        promise = new Promise();

        spy = spy.and.returnValue(promise);
        dialog = Modal.init(null, spy);

        dialog.confirm();
        dialog.confirm();
        dialog.confirm();

        expect(spy.calls.count()).toBe(1);
      });
    });

    describe('#promiseGenerator', function() {
      it('is used as default promiseGenerator of Modal.init()', function(done) {
        var promise = Promise.resolve();

        var dialog = Modal.extend({
          promiseGenerator: jasmine.createSpy().and.returnValue(promise)
        }).init();

        dialog.confirm();

        expect(dialog.promiseGenerator).toHaveBeenCalled();

        dialog.then(done);
      });
    });
  });
});
