define(['Component', '@behance/nbd/trait/pubsub'], function(Component, pubsub) {
  'use strict';

  describe('Component', function() {
    it('is a constructor', function() {
      expect(Component).toEqual(jasmine.any(Function));
    });

    it('has pubsub', function() {
      expect(Component.inherits(pubsub)).toBe(true);
    });

    describe('init()', function() {
      it('constructs an instance', function() {
        var instance = Component.init();
        expect(instance).toEqual(jasmine.any(Component));
      });

      it('calls #bind()', function() {
        spyOn(Component.prototype, 'bind').and.callThrough();
        var instance = Component.init();
        expect(instance.bind).toHaveBeenCalled();
      });

      it('constructs an instance even with an empty bind', function() {
        var Component2 = Component.extend({
              bind: function() {}
            }),
            instance = Component2.init();
        expect(instance).toEqual(jasmine.any(Component2));
      });
    });

    var instance;
    beforeEach(function() {
      instance = new Component();
    });

    describe('#bind()', function() {
      it('returns the instance', function() {
        expect(instance.bind()).toBe(instance);
      });
    });

    describe('#unbind()', function() {
      it('returns the instance', function() {
        expect(instance.unbind()).toBe(instance);
      });
    });

    describe('#destroy()', function() {
      it('unbinds', function() {
        spyOn(instance, 'unbind').and.callThrough();
        instance.destroy();
        expect(instance.unbind).toHaveBeenCalled();
      });

      it('detaches all event listeners', function() {
        var spy = jasmine.createSpy();
        instance.on('test', spy);
        instance.destroy();
        instance.trigger('test');

        expect(spy).not.toHaveBeenCalled();
      });
    });
  });
});
