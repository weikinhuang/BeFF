define([
  '@behance/nbd/util/extend',
  'ui/trait/draggable'
], function(extend, draggable) {
  'use strict';

  describe('ui/trait/draggable', function() {
    beforeEach(function() {
      this._$view = affix('div');
      this._$view.affix('.js-drag-handle');

      this.view = extend({
        $view: this._$view
      }, draggable);
    });

    it('sets the default options', function() {
      this.view.makeDraggable();

      expect(this.view.$view.draggable('option', 'handle')).toEqual('.js-drag-handle');
      expect(this.view.$view.draggable('option', 'containment')).toEqual('window');
      expect(this.view.$view.draggable('option', 'cancel')).toEqual('input,textarea,button,select,option, .js-drag-cancel');
    });

    it('sets the specified options', function() {
      var $altView = affix('div');

      this.view.makeDraggable($altView, '.test-handle', '.test-containment', '.test-cancel');

      expect($altView.draggable('option', 'handle')).toEqual('.test-handle');
      expect($altView.draggable('option', 'containment')).toEqual('.test-containment');
      expect($altView.draggable('option', 'cancel')).toEqual('input,textarea,button,select,option, .test-cancel');
    });

    it('allows a user to nullify the handle option', function() {
      this.view.makeDraggable(this._$view, '');

      expect(this.view.$view.draggable('option', 'handle')).toEqual('');
    });

    it('unsets inline height after dragging', function(done) {
      this.view.makeDraggable();

      this.view.$view.on('dragstop', function() {
        expect(this.view.$view[0].style.height).toEqual('');
        done();
      }.bind(this));

      this.view.$view
        .find('.js-drag-handle')
        .simulate('drag', {
          dx: 10,
          dy: 10,
        });
    });
  });
});
