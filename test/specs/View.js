define(['View', 'trait/eventMappable', 'jquery'], function(View, eventMappable, $) {
  'use strict';

  describe('View', function() {
    it('is eventMappable', function() {
      expect(View.inherits(eventMappable)).toBe(true);
    });

    it('maps events on render', function() {
      spyOn(View.prototype, '_mapEvents');
      var instance = new View();

      instance.render();
      expect(instance._mapEvents).toHaveBeenCalled();
    });

    describe('#destroy()', function() {
      it('unmaps events', function() {
        spyOn(View.prototype, '_undelegateEvents');
        var instance = new View();
        instance.destroy();
        expect(instance._undelegateEvents).toHaveBeenCalled();
      });
    });

    describe('#template()', function() {
      var instance;
      beforeEach(function() {
        instance = new View();
      });

      it('runs the mustache template', function() {
        instance.mustache = jasmine.createSpy();

        var foo = { foo: 'bar' };
        instance.template(foo);

        expect(instance.mustache).toHaveBeenCalledWith(foo, undefined);
      });

      it('runs mustache with partials', function() {
        var foo = { foo: 'bar' };
        instance.mustache = jasmine.createSpy();
        instance.partials = foo;

        instance.template();
        expect(instance.mustache).toHaveBeenCalledWith(undefined, foo);
      });
    });

    describe('.domify', function() {
      it('returns jQuery objects', function() {
        var html = "<span>foobar</span>";
        expect(View.domify(html)).toEqual(jasmine.any($));
      });
    });
  });
});
