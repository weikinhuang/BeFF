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
  });
});
