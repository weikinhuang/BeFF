define(['Component/Container', 'Controller', 'jquery', 'trait/eventMappable'], function(Container, Controller, $, eventMappable) {
  'use strict';

  describe('Container', function() {
    var spy, render, destroy;

    beforeEach(function() {
      spy = jasmine.createSpy();
      render = jasmine.createSpy();
      destroy = jasmine.createSpy();
      spy.prototype.render = render;
      spy.prototype.destroy = destroy;
    });

    describe('init()', function() {
      it('constructs an instance', function() {
        var $foo = $('<div></div>'),
        instance = Container.init($foo, spy);
        expect(instance).toEqual(jasmine.any(Container));
        expect(spy).not.toHaveBeenCalled();
      });
      it('is not rendered', function() {
        var $foo = $('<div><ul></ul></div>'),
        container = Container.init($foo, spy);
        expect(spy).toHaveBeenCalled();
        expect(spy.calls.count()).toEqual(1);
        expect(render).not.toHaveBeenCalled();
      });
    });

    describe('bind()', function() {
      it('is eventMappable', function() {
        expect(Container.inherits(eventMappable)).toBe(true);
      });
      it('maps events on bind', function() {
        spyOn(Container.prototype, '_mapEvents');
        var $foo = $('<div></div>'),
        instance = Container.init($foo, spy);
        instance.bind();
        expect(instance._mapEvents).toHaveBeenCalled();
      });
    });

    describe('unbind()', function() {
      it('unmaps events', function() {
        spyOn(Container.prototype, '_undelegateEvents');
        var $foo = $('<div></div>'),
        instance = Container.init($foo, spy);
        instance.unbind();
        expect(instance._undelegateEvents).toHaveBeenCalled();
      });
    });

    describe('.add', function() {
      it('is rendered', function() {
        var $foo = $('<div><ul></ul></div>'),
        container = Container.init($foo, spy),
        data = ['<li> foo </li>', '<li> bar </li>'];
        container.add(data);
        expect(spy).toHaveBeenCalled();
        expect(spy.calls.count()).toEqual(3);
        expect(render).toHaveBeenCalled();
        expect(render.calls.count()).toEqual(2);
      });
      it('will not break when adding nothing', function() {
        var instance = new Container();
        expect(function() {
          instance.add();
        }).not.toThrow();
      });
      it('will not break when adding null', function() {
        var instance = new Container();
        expect(function() {
          instance.add(null);
        }).not.toThrow();
      });
      it('will not break when adding a number', function() {
        var instance = new Container();
        expect(instance.isEmpty()).toBe(true);
        expect(function() {
          instance.add(2);
        }).not.toThrow();
        expect(instance.isEmpty()).toBe(true);
      });
    });

    describe('.decorate', function() {
      it('constructs an instance', function() {
        var instance = new Container();
        expect(instance.decorate()).toEqual(jasmine.any(instance.Controller));
      });
    });

    describe('.empty', function() {
      it('is destroyed', function() {
        var $foo = $('<div><ul></ul></div>'),
        container = Container.init($foo, spy);
        expect(container.isEmpty()).toEqual(false);
        container.empty();
        expect(container.isEmpty()).toEqual(true);
      });
      it('will not break when emptying an empty container', function() {
        var $foo = $('<div><ul></ul></div>'),
        container = Container.init($foo, spy);
        expect(container.isEmpty()).toEqual(false);
        container.empty();
        expect(container.isEmpty()).toEqual(true);
        container.empty();
        expect(container.isEmpty()).toEqual(true);
      });
      it('can add after being empty', function() {
        var $foo = $('<div><ul></ul></div>'),
        container = Container.init($foo, spy),
        data = ['<li> foo </li>', '<li> bar </li>'];
        expect(container.isEmpty()).toEqual(false);
        container.empty();
        expect(container.isEmpty()).toEqual(true);
        container.add(data);
        expect(container.isEmpty()).toEqual(false);
      });
    });
  });
});
