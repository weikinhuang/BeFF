define(['Component/InfiniteContainer', 'Controller', 'util/xhr', 'nbd/Model'], function(InfiniteContainer, Controller, xhr, Model) {
  'use strict';

  describe('InfiniteContainer', function() {
    var controller, param, $content, model;

    beforeEach(function() {
      controller = new Controller('<div></div>');
      param = {url: "/search"};
      $content = affix('div .foo');
      model = new Model();
    });

    afterEach(function() {
      model.destroy();
    });

    it('makes sure bind is being called', function() {
      var foo = new InfiniteContainer(param);
      spyOn(foo, 'bind');
      model.set("hello", "world");
      expect(model.get("hello")).toEqual("world");
      foo.of(controller).at($content).bind(model);
      expect(foo.bind).toHaveBeenCalled();
    });

    it('throws error when no params are passed into .at()', function() {
      expect(function() {
        new InfiniteContainer(param).of(controller).at().bind(model);
      }).toThrowError('Context must be defined');
    });

    it('makes sure ajax request is made', function(done) {
      jasmine.Ajax.install();

      var  $bar = affix('div'),
      foo = new InfiniteContainer(param),
      success = jasmine.createSpy('ajaxSuccess'),
      error = jasmine.createSpy('ajaxFailure'),
      response = xhr ({
        type: 'POST',
        url: 'foo/bar',
        data: {
          foo: 'bar'
        },
      }),
      request = jasmine.Ajax.requests.mostRecent(),
      successResponse = request.response({
        status: 200,
        contentType: 'text/plain',
        responseText: 'hi'
      });

      model.set("foo", "bar");
      expect(model.get("foo")).toEqual("bar");
      foo.of(controller).at($bar).bind(model);

      response.then(success, error).then(function() {
        expect(success).toHaveBeenCalledWith('hi');
        expect(error).not.toHaveBeenCalled();
        done();
      });

      jasmine.Ajax.uninstall();
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
  });
});
