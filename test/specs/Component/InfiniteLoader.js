define([
  'jquery',
  'Component/InfiniteLoader',
  'fixtures/responses/loader'
], function($, InfiniteLoader, RESPONSES) {
  'use strict';

  var loader,
      context;

  beforeEach(function() {
    jasmine.Ajax.install();
    loader = create();
    context = affix('#scroll_container #scroll_content');
    context.css({height: 100, width: 2, overflow: 'scroll'});
    context.find('#scroll_content').css({height: 1000});
  });

  afterEach(function() {
    loader.destroy();
    jasmine.Ajax.uninstall();
  });

  function getConstructor(options) {
    options = options || {};

    return InfiniteLoader.extend({
      hasMoreResults: options.hasMoreResults || function(response) {
        return response.data.length > 0;
      },
      getNextOffset: options.getNextOffset || function(response) {
        return response.offset;
      },
      loaded: options.loaded || function(response) {
        return true;
      }
    });
  }

  function create(options) {
    var Constructor = getConstructor(options),
      loader = new Constructor();

    loader.url = '/';

    return loader;
  }

  function onLoad(loader, fn, response) {
    var request, promise;

    promise = loader.load();

    request = jasmine.Ajax.requests.mostRecent();

    promise.then(function() {
      fn(request, true);
    }, function() {
      fn(request, false);
    });

    request.response(response || RESPONSES.success);
    return promise;
  }

  function scrollAndCallback(context, height, callback) {
    context.one('scroll', callback);
    context.scrollTop(height);
  }

  function onError(loader, fn, response) {
    var request, promise;

    promise = loader.load();

    request = jasmine.Ajax.requests.mostRecent();

    promise.then(null, function() {
      fn(request);
    });

    request.response(RESPONSES.error);
    return promise;
  }

  describe('Component/InfiniteLoader', function() {
    describe('initialization', function() {
      it('throws errors if not configured', function() {
        var infiniteLoader = InfiniteLoader.init();

        expect(function() {
          infiniteLoader.hasMoreResults();
        }).toThrow();

        expect(function() {
          infiniteLoader.getNextOffset();
        }).toThrow();

        expect(function() {
          infiniteLoader.loaded();
        }).toThrow();

        infiniteLoader.destroy();
      });

      it('doesnt throw an errors if configured', function() {
        var infiniteLoader, Impl;

        Impl = InfiniteLoader.extend({
          hasMoreResults: function() {},
          getNextOffset: function() {},
          loaded: function() {}
        });

        infiniteLoader = Impl.init();

        expect(function() {
          infiniteLoader.hasMoreResults();
        }).not.toThrow();

        expect(function() {
          infiniteLoader.getNextOffset();
        }).not.toThrow();

        expect(function() {
          infiniteLoader.loaded();
        }).not.toThrow();

        infiniteLoader.destroy();
      });
    });

    describe('parameter setting', function() {
      it('can configure what url to load data from', function(done) {
        loader.url = '/dummy';

        onLoad(loader, function(request) {
          expect(request.url).toEqual('/dummy?offset=0');
          done();
        });
      });

      it('can configure GET params besides for offset', function(done) {
        loader.data = {dummy: 'dummy'};

        onLoad(loader, function(request) {
          expect(request.url).toEqual('/?dummy=dummy&offset=0');
          done();
        });
      });

      it('can configure the offset key of the GET params', function(done) {
        loader.offsetKey = 'dummyOffset';

        onLoad(loader, function(request) {
          expect(request.url).toEqual('/?dummyOffset=0');
          done();
        });
      });

      it('can configure the offset of the GET params', function(done) {
        loader.offset = 3;

        onLoad(loader, function(request) {
          expect(request.url).toEqual('/?offset=3');
          done();
        });
      });

      it('can configure url, data, offset using setParams', function() {
        loader.setParams(1, {dummy: 'dummy'}, '/dummy');
        expect(loader.offset).toEqual(1);
        expect(loader.data).toEqual({dummy: 'dummy'});
        expect(loader.url).toEqual('/dummy');

        loader.setParams(2);
        expect(loader.offset).toEqual(2);
        expect(loader.data).toEqual({dummy: 'dummy'});
        expect(loader.url).toEqual('/dummy');

        loader.setParams(null, {a: 'a'});
        expect(loader.offset).toEqual(2);
        expect(loader.data).toEqual({a: 'a'});
        expect(loader.url).toEqual('/dummy');

        loader.setParams(null, null, '/');
        expect(loader.offset).toEqual(2);
        expect(loader.data).toEqual({a: 'a'});
        expect(loader.url).toEqual('/');
      });

      it('can configure url, data, offset using resetParams', function() {
        var defaultOffset = loader.offset,
          defaultData = loader.data;

        loader.resetParams(1, {dummy: 'dummy'}, '/dummy');
        expect(loader.offset).toEqual(1);
        expect(loader.data).toEqual({dummy: 'dummy'});
        expect(loader.url).toEqual('/dummy');

        loader.resetParams(2);
        expect(loader.offset).toEqual(2);
        expect(loader.data).toEqual(defaultData);

        loader.resetParams(null, {a: 'a'});
        expect(loader.offset).toEqual(defaultOffset);
        expect(loader.data).toEqual({a: 'a'});

        loader.resetParams(null, null, '/');
        expect(loader.offset).toEqual(defaultOffset);
        expect(loader.data).toEqual(defaultData);
        expect(loader.url).toEqual('/');
      });
    });

    describe('InfiniteLoader.init', function() {
      it('calls load with correct offset once the context is scrolled enough', function(done) {
        var Constructor = getConstructor(), offset = 3;
        loader.destroy();
        loader = new Constructor('#scroll_container', offset);

        loader.load = jasmine.createSpy();
        loader.bind();

        expect(loader.offset).toEqual(offset);

        scrollAndCallback(context, 1, function() {
          expect(loader.load).not.toHaveBeenCalled();

          scrollAndCallback(context, context.find('#scroll_content').height(), function() {
            expect(loader.load).toHaveBeenCalled();
            done();
          });
        });
      });
    });

    describe('reload', function() {
      it('still loads after it has no more results and calls reload', function(done) {
        jasmine.Ajax.install();

        onLoad(loader, function() {
          loader.reload();
          expect(jasmine.Ajax.requests.count()).toEqual(2);
          jasmine.Ajax.uninstall();
          done();
        }, RESPONSES.empty);
      });
    });

    describe('bind', function() {
      it('binds an event to the context', function(done) {
        spyOn(loader, 'load');
        loader.context = '#scroll_container';
        loader.bind();

        scrollAndCallback(context, 1, function() {
          expect(loader.load).not.toHaveBeenCalled();

          scrollAndCallback(context, context.find('#scroll_content').height(), function() {
            expect(loader.load).toHaveBeenCalled();
            done();
          });
        });
      });

      it('only binds if not already bound', function() {
        spyOn(loader, '_infinitescroll').and.callThrough();
        loader.bind();
        loader.bind();

        expect(loader._infinitescroll.calls.count()).toEqual(1);
      });
    });

    describe('unbind', function() {
      it('unbinds an event from the context', function(done) {
        spyOn(loader, 'load');
        loader.context = '#scroll_container';
        loader.bind();
        loader.unbind();

        scrollAndCallback(context, $('#scroll_content').height(), function() {
          expect(loader.load).not.toHaveBeenCalled();
          done();
        });
      });

      it('only unbinds when currently bound', function() {
        spyOn(loader, 'load');
        loader.bind();

        spyOn(loader._infinitescroll, 'off').and.callThrough();
        loader.unbind();
        loader.unbind();

        expect(loader._infinitescroll.off.calls.count()).toEqual(1);
      });
    });

    describe('load', function() {
      it('fires the before and success events in that order with correct responses', function(done) {
        var callSpy = jasmine.createSpy('callSpy');

        loader.on('all', callSpy);

        onLoad(loader, function() {
          expect(callSpy.calls.count()).toBe(2);
          expect(callSpy.calls.argsFor(0)[0]).toBe('before');
          expect(callSpy.calls.argsFor(1)[0]).toBe('success');
          done();
        });
      });

      it('incrementally passes a new offset from a previous result', function(done) {
        expect(loader.offset).not.toEqual(1);

        onLoad(loader, function(request) {
          expect(request.url).toEqual('/?offset=0');
          expect(loader.offset).toEqual(1);
        }).then(function() {
          onLoad(loader, function(request) {
            expect(request.url).toEqual('/?offset=1');
            done();
          });
        });
      });

      it('can change loader type', function(done) {
        loader.type = 'POST';
        onLoad(loader, function(request) {
          expect(request.method).toBe('POST');
          done();
        });
      });

      it('waits for the first loaded call to resolve before it begins loading a second time', function(done) {
        onLoad(loader, function() {
          loader.load();
          expect(jasmine.Ajax.requests.count()).toEqual(2);
          done();
        });

        expect(jasmine.Ajax.requests.count()).toEqual(1);
      });

      it('rejects its promise once it realizes it has no more results', function(done) {
        onLoad(loader, function(response, wasSuccessful) {
          expect(wasSuccessful).toEqual(false);
          done();
        }, RESPONSES.empty);
      });

      it('fires the error, but not success events once it receives an error response', function(done) {
        var errorSpy = jasmine.createSpy('error');

        loader
        .on('error', function() {
          errorSpy('error');
        })
        .on('success', function() {
          errorSpy('loaded');
        });

        onError(loader, function() {
          expect(errorSpy.calls.count()).toEqual(1);
          expect(errorSpy.calls.argsFor(0)[0]).toEqual('error');
          done();
        });
      });
    });
  });
});
