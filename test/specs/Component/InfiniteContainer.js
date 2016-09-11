define(['Component/InfiniteContainer', 'util/xhr', 'nbd/Model', 'nbd/util/deparam'], function(InfiniteContainer, xhr, Model, deparam) {
  'use strict';

  describe('Component/InfiniteContainer', function() {
    var Controller, param, $content, model;

    beforeEach(function() {
      Controller = jasmine.createSpy('controller class');
      param = { url: '/search' };
      $content = affix('div .foo');
      model = new Model();
    });

    it('makes sure bind is being called', function() {
      var foo = new InfiniteContainer(param);
      spyOn(foo, 'bind');
      foo.of(Controller).at($content).bind(model);
      expect(foo.bind).toHaveBeenCalled();
    });

    it('does not stop listening to the model on parameterless calls to bind', function(done) {
      var foo = new InfiniteContainer();

      foo.of(Controller).at($content).bind(model, true);
      // Manually trigger a bind which should not stop infcontainer from
      // listening to its model
      foo.bind();

      foo.on('reload', done);

      model.trigger('booyah');
    });

    it('throws error when no params are passed into .at()', function() {
      expect(function() {
        (new InfiniteContainer(param)).of(Controller).at().bind(model);
      }).toThrowError();
    });

    it('defaults its container to BeFF/Component/Container if not overriden by subclasses', function() {
      var Container = require('Component/Container'),
          Foo = InfiniteContainer.extend(),
          foo = new Foo(),
          $bar = affix('div');

      foo.of(Controller).at($bar).bind(model);

      expect(foo._container instanceof Container).toBeTruthy();
    });

    it('allows the Container constructor to be configurable within subclasses', function() {
      var Container = require('Component/Container'),
          TestContainer = Container.extend(),
          Foo = InfiniteContainer.extend({
            Container: TestContainer
          }),
          foo = new Foo(),
          $bar = affix('div');

      foo.of(Controller).at($bar).bind(model);

      expect(foo._container instanceof TestContainer).toBeTruthy();
    });

    it('forwards the update event from its container', function() {
      var $bar = affix('div'),
          data = ['<li> foo </li>', '<li> bar </li>'],
          updated = jasmine.createSpy(),
          Infcont = InfiniteContainer.extend(),
          inf = new Infcont();

      inf.of(Controller).at($bar).bind(model);

      inf.on('update', updated);
      inf._container.add(data);

      expect(updated).toHaveBeenCalled();
      expect(updated).toHaveBeenCalledWith(inf._container.getNodes());
    });

    it('makes sure ajax request is with empty model', function() {
      jasmine.Ajax.install();

      var  $bar = affix('div'),
          foo = new InfiniteContainer(param);

      foo.of(Controller).at($bar).bind(model);
      var request = jasmine.Ajax.requests.mostRecent(),
          data = request.url.split('?');

      expect(data[0]).toBe('/search');
      expect(deparam(data[1])).toEqual({ offset: '0' });
      expect(request.method).toBe('GET');

      jasmine.Ajax.uninstall();
    });

    it('makes sure ajax request is with model that already has data', function() {
      jasmine.Ajax.install();

      var  $bar = affix('div'),
          foo = new InfiniteContainer(param),
          model = new Model({ foo: 'bar' });

      expect(model.get('foo')).toEqual('bar');
      foo.of(Controller).at($bar).bind(model);

      var request = jasmine.Ajax.requests.mostRecent(),
          data = request.url.split('?');

      expect(data[0]).toBe('/search');
      expect(deparam(data[1])).toEqual({ offset: '0', foo: 'bar' });
      expect(request.method).toBe('GET');

      jasmine.Ajax.uninstall();
    });

    it('makes sure ajax request is made', function() {
      jasmine.Ajax.install();

      var  $bar = affix('div'),
          foo = new InfiniteContainer(param);

      model.set('foo', 'bar');
      foo.of(Controller).at($bar).bind(model);

      var request = jasmine.Ajax.requests.mostRecent(),
          data = request.url.split('?');

      expect(data[0]).toBe('/search');
      expect(deparam(data[1])).toEqual({ offset: '0', foo: 'bar' });
      expect(request.method).toBe('GET');

      jasmine.Ajax.uninstall();
    });

    it('', function(done) {
      jasmine.Ajax.install();

      var  $bar = affix('div'),
          foo = new InfiniteContainer(param),
          model = new Model({ foo: 'bar' });

      foo.of(Controller).at($bar).bind(model);
      foo.offset = 3;
      model.set('foo', 'hi');

      setTimeout(function() {
        var request = jasmine.Ajax.requests.mostRecent(),
            data = request.url.split('?');
        expect(data[0]).toBe('/search');
        expect(deparam(data[1])).toEqual({ offset: '0', foo: 'hi' });
        expect(request.method).toBe('GET');
        jasmine.Ajax.uninstall();
        done();
      }, 100);
    });

    it('turns data into DOM elements', function(done) {
      jasmine.Ajax.install();

      var  $bar = affix('div'),
          foo = new InfiniteContainer(param);
      foo.of(Controller).at($bar).bind(model);

      var request = jasmine.Ajax.requests.mostRecent();

      request.respondWith({
        status: 200,
        contentType: 'application/json',
        responseText: JSON.stringify({ data: [{}, {}, {}] })
      });

      setTimeout(function() {
        expect(foo._container).toBeDefined();
        expect(foo._container._nodes.length).toEqual(3);
        expect(foo._container._nodes).toEqual(jasmine.any(Array));
        foo._container._nodes.forEach(function(node) {
          expect(node).toEqual(jasmine.any(foo._container.Controller));
        });
        jasmine.Ajax.uninstall();
        done();
      }, 100);
    });

    it('triggers the empty event', function(done) {
      jasmine.Ajax.install();

      var  $bar = affix('div'),
          foo = new InfiniteContainer(param),
          spy = jasmine.createSpy();

      foo.of(Controller).at($bar).bind(model);
      foo.on('empty', spy);

      var request = jasmine.Ajax.requests.mostRecent();

      request.respondWith({
        status: 200,
        contentType: 'application/json',
        responseText: JSON.stringify({ data: [] })
      });

      setTimeout(function() {
        expect(foo._container).toBeDefined();
        expect(foo._container._nodes.length).toEqual(0);
        expect(spy).toHaveBeenCalled();
        expect(foo._container._nodes).toEqual(jasmine.any(Array));
        jasmine.Ajax.uninstall();
        done();
      }, 100);
    });

    it('does not throw error when .bind() is called', function() {
      expect(function() {
        new InfiniteContainer(param).bind(model);
      }).not.toThrowError();
    });

    describe('destroy()', function() {
      it('is destroyed properly', function() {
        var foo = new InfiniteContainer(param).of(Controller).at($content).bind(model);
        expect(foo._container).toBeDefined();
        foo.destroy();
        expect(foo._container).toBeNull();
      });
    });

    describe('isEmpty', function() {
      it('returns whether or not there are contained nodes', function() {
        $content = affix('div');
        var foo = new InfiniteContainer(param).of(Controller).at($content).bind(model);
        expect(foo.isEmpty()).toBeTruthy();
      });
    });
  });
});
