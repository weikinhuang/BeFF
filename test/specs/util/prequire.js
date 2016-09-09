define(['util/prequire'], function(prequire) {
  'use strict';

  describe('util/prequire', function() {
    beforeEach(function() {
      window.requirejs = jasmine.createSpy('requirejs');
      jasmine.Ajax.install();
    });

    afterEach(function() {
      jasmine.Ajax.uninstall();
    });

    it('returns a promise', function() {
      expect(prequire('foo').then).toBeDefined();
    });

    it('calls require.js\'s require function', function() {
      prequire('foo');
      expect(window.requirejs).toHaveBeenCalledWith(['foo'], jasmine.any(Function), jasmine.any(Function));
    });

    it('resolves with the requested modules required', function(done) {
      var module = jasmine.createSpy('module');
      window.requirejs.and.callFake(function(deps, success) {
        success(module);
      });

      prequire('foo')
      .then(function(foo) {
        expect(foo).toEqual(module);
        done();
      });
    });

    it('rejects if a module cannot be resolved', function(done) {
      var error = new Error();
      window.requirejs.and.callFake(function(deps, success, failure) {
        failure(error);
      });

      prequire('foo')
      .catch(function(err) {
        expect(err).toBe(error);
        done();
      });
    });
  });
});
