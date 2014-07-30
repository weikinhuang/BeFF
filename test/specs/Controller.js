define(['Controller', 'View', 'jquery'], function(Controller, View, $) {
  'use strict';

  describe('Controller', function() {
    var instance;

    afterEach(function() {
      if (instance) {
        instance.destroy();
        instance = null;
      }
    });

    it('accepts html', function() {
      instance = new Controller('<div></div>');

      expect(instance._model).toBeDefined();
      expect(instance._view).toBeDefined();
      expect(instance._view.$view).toBeDefined();
    });

    it('pulls out HTML5 dataset from html', function() {
      instance = new Controller('<div data-foo="bar"></div>');

      expect(instance._model.get('foo')).toBe('bar');
    });

    it('accepts jquery', function() {
      instance = new Controller($('<div>', { class: 'notfound' }));

      expect(instance._model).toBeDefined();
      expect(instance._view.$view.hasClass('notfound')).toBe(true);
    });

    it('pulls out HTML5 dataset from jquery', function() {
      instance = new Controller($('<div>', { 'data-foo': 'bar' }));

      expect(instance._model.get('foo')).toBe('bar');
    });

    it('accepts DOM', function() {
      instance = new Controller(document.createElement('div'));

      expect(instance._model).toBeDefined();
      expect(instance._view).toBeDefined();
      expect(instance._view.$view).toBeDefined();
    });

    it('pulls out HTML5 dataset from DOM', function() {
      var el = document.createElement('div');
      el.dataset.foo = 'bar';

      instance = new Controller(el);
      expect(instance._model.get('foo')).toBe('bar');
    });

    it('accepts data', function() {
      instance = new Controller({
        foo: 'bar'
      });

      expect(instance._model.get('foo')).toBe('bar');
    });

    it('accepts an id and data', function() {
      var id = Math.random();
      instance = new Controller(id, { foo: 'bar' });

      expect(instance._model.id()).toBe(id);
      expect(instance._model.get('foo')).toBe('bar');
    });

    it('has passthrough id property access', function() {
      var id = Math.random();
      instance = new Controller(id, { foo: 'bar' });

      expect(instance.id).toBe(id);
    });

    it('has passthrough data property access', function() {
      instance = new Controller({ foo: 'bar' });

      expect(instance.data.foo).toBe('bar');
    });

    it('automatically fires view postrender', function() {
      var spy = jasmine.createSpy();
      instance = new (Controller.extend({}, {
        VIEW_CLASS: View.extend({
          init: function() {
            this._super.apply(this, arguments);
            this.on('postrender', spy);
          }
        })
      }))(document.createElement('div'));

      expect(spy).toHaveBeenCalledWith(instance._view.$view);
    });

    it('automatically calls view rendered', function() {
      var spy = jasmine.createSpy();
      instance = new (Controller.extend({}, {
        VIEW_CLASS: View.extend({
          rendered: spy
        })
      }))(document.createElement('div'));

      expect(spy).toHaveBeenCalledWith(instance._view.$view);
    });
  });
});
