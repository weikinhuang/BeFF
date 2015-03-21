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

    it('forwards prefixed events from its internal nodes', function(done) {
      var $foo = $('<ul><li></li><li></li><li></li></ul>'),
          instance = new Container($foo);

      instance.bind();
      instance.on('change:foo', done);
      instance.getNodes()[0].trigger('foo');
    });

    describe('init()', function() {
      it('constructs an instance', function() {
        var $foo = $('<div></div>'),
        instance = Container.init($foo, spy);
        expect(instance).toEqual(jasmine.any(Container));
        expect(spy).not.toHaveBeenCalled();
      });
      it('is not rendered', function() {
        var $foo = $('<div><ul></ul></div>');
        Container.init($foo, spy);
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
        instance = new Container($foo);
        instance.bind();
        expect(instance._mapEvents).toHaveBeenCalled();
      });

      it('decorates existing DOM elements', function() {
        var $foo = $('<ul><li></li><li></li><li></li></ul>'),
        instance = new Container($foo);
        instance.bind();
        expect(instance._nodes.length).toEqual(3);
        expect(instance._nodes).toEqual(jasmine.any(Array));
        instance._nodes.forEach(function(node) {
          expect(node).toEqual(jasmine.any(instance.Controller));
        });
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

    describe('.add()', function() {
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
      it('fires an update event after all nodes have been added', function() {
        var $foo = $('<div><ul></ul></div>'),
            container = Container.init($foo, spy),
            data = ['<li> foo </li>', '<li> bar </li>'],
            nodeAdded = jasmine.createSpy();

        container.on('update', nodeAdded);
        container.add(data);

        expect(nodeAdded).toHaveBeenCalled();
      });
    });

    describe('.remove()', function() {
      it('fires an update event when a node is removed', function() {
        var $foo = $('<div><ul></ul></div>'),
            container = Container.init($foo, spy),
            data = ['<li> foo </li>', '<li> bar </li>'],
            nodeRemoved = jasmine.createSpy();

        container.on('update', nodeRemoved);
        container.add(data);
        container.remove(container.getNodes()[0]);

        expect(nodeRemoved).toHaveBeenCalled();
      });

      it('stops proxying a node\'s events', function() {
        var $foo = $('<ul><li></li><li></li><li></li></ul>'),
            instance = new Container($foo),
            spy = jasmine.createSpy(),
            node;

        instance.bind();
        instance.on('change:foo', spy);
        node = instance.getNodes()[0];
        instance.remove(node);
        node.trigger('foo');
        expect(spy).not.toHaveBeenCalled();
      });
    });

    describe('.decorate', function() {
      it('constructs an instance', function() {
        var instance = new Container();
        expect(instance.decorate()).toEqual(jasmine.any(instance.Controller));
      });
    });

    describe('.empty()', function() {
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

    describe('.getNodes()', function() {
      it('returns correct number of nodes', function() {
        var $foo = $('<ul><li></li><li></li><li></li></ul>'),
        instance = new Container($foo);
        instance.bind();
        expect(instance.getNodes().length).toEqual(instance._nodes.length);
        expect(instance.getNodes()).toEqual(jasmine.any(Array));
        instance.getNodes().forEach(function(node) {
          expect(node).toEqual(jasmine.any(instance.Controller));
        });
      });

      it('returns an empty array when this._nodes is empty', function() {
        var $foo = $('<ul></ul>'),
        instance = new Container($foo);
        instance.bind();
        expect(instance.isEmpty()).toBe(true);
        expect(instance.getNodes().length).toEqual(0);
        expect(instance.getNodes().length).toEqual(instance._nodes.length);
      });
    });
  });
});
