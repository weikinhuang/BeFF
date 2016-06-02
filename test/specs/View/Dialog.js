define([
  'View/Dialog',
  'nbd/Promise',
  'nbd/util/async'
], function(View, Promise, async) {
  'use strict';

  describe('View/Dialog', function() {
    it('does not throw when destroyed before a transition completes', function(done) {
      var view = new View();
      view.render();
      view.show();

      spyOn(view, '_transitionEnd').and.callFake(function() {
        return new Promise(function(resolve) {
          async(resolve);
        });
      });

      view.hide();
      view.destroy();
      view._hiding.then(done);
    });

    it('fires the show event when ready to be shown', function(done) {
      var context = affix('body');
      var view = new View();
      view.render(context);
      view.on('show', done);
      view.show();
    });

    it('fires the visible event when actually shown', function(done) {
      var context = affix('body');
      var view = new View();
      view.render(context);
      view.on('visible', function() {
        expect(view.$view.is(':visible')).toBe(true);
        done();
      });
      view.show();
    });

    it('fires the hidden event when closed', function(done) {
      var context = affix('body');
      var view = new View();
      view.render(context);
      view.on('hidden', function() {
        expect(view.$view.is(':visible')).toBe(false);
        done();
      });
      view.show();

      view.hide();
    });
  });
});
