define(['Component/Form', 'nbd/Promise', 'util/xhr'], function(Form, Promise, xhr) {
  'use strict';

  var foo, $content;

  beforeEach(function() {
    $content = $('<form><input name="foo" value="bar"></form>');
    foo = new Form($content);
  });

  describe('init()', function() {
    it('properly creates a form', function() {
      expect(foo.$form.is('form')).toBeTruthy();
    });

    it('throws error when form is undefined or null', function() {
      var $context;
      expect(function() {new Form($context);}).toThrow(new Error("The context of the form cannot be empty"));
      $context = null;
      expect(function() {new Form($context);}).toThrow(new Error("The context of the form cannot be empty"));
    });
  });

  describe('.validator', function() {
    it('calls commit when valid', function(done) {
      spyOn(foo, 'validator').and.returnValue(true);
      spyOn(foo, 'commit');

      foo.submit().finally(function() {
        expect(foo.commit).toHaveBeenCalled();
        expect(foo.validator).toHaveBeenCalledWith({ foo: 'bar'});
        done();
      });
    });

    it('does not call commit when validator returns false', function(done) {
      foo.validator = function() {
        return false;
      };

      spyOn(foo, 'commit');

      foo.submit().catch(function() {
        expect(foo.commit).not.toHaveBeenCalled();
        done();
      });
    });

    it('does not call commit when validator throws an error', function(done) {
      foo.validator = function() {
        throw new Error('you shall not pass');
      };

      spyOn(foo, 'commit');

      foo.submit().catch(function() {
        expect(foo.commit).not.toHaveBeenCalled();
        done();
      });
    });

    it('fires error event when validation fails', function(done) {
      var spy = jasmine.createSpy(),
          err = new Error('you shall not pass');

      foo.validator = function() {
        throw err;
      };

      foo.on('error', function(error) {
        expect(error).toBe(err);
        done();
      });

      foo.submit();
    });

    it('can be an array of functions', function() {
      var spy = jasmine.createSpy('Jessica').and.returnValue('is awesome'),
          spy2 = jasmine.createSpy('Maria').and.returnValue('is not awesome'),
          spy3 = jasmine.createSpy('Jasmine');

      foo.validator = [spy, spy2, spy3];
      foo.submit();

      expect(spy).toHaveBeenCalledWith({ foo: 'bar'});
      expect(spy2).toHaveBeenCalledWith('is awesome');
      expect(spy3).toHaveBeenCalledWith('is not awesome');
    });

    it('can fail inside of an array', function(done) {
      var spy = jasmine.createSpy('Jessica').and.returnValue('is awesome'),
          spy2 = jasmine.createSpy('Maria').and.callFake(function() {
            throw new Error('you shall not pass');
          }),
          spy3 = jasmine.createSpy('Jasmine');

      foo.validator = [spy, spy2, spy3];
      foo.submit().catch(done);

      expect(spy).toHaveBeenCalledWith({ foo: 'bar'});
      expect(spy2).toHaveBeenCalledWith('is awesome');
      expect(spy3).not.toHaveBeenCalled();
    });

    it('should fire the event error:show', function(done) {
      foo.validator = function() { throw { foo: "This is bad" }; };

      foo.on('error:show', function($element, msg) {
        expect(msg).toBe('This is bad');
        expect($element).toEqual(jasmine.any(jQuery));
        expect($element[0]).toBe($content.find('[name=foo]')[0]);
        done();
      });

      foo.submit();
    });
  });

  describe('.submit', function() {
    it('allows default form behavior', function() {
      foo.$form.on('submit', function(event) {
        expect(event.isDefaultPrevented()).toBe(false);
        return false;
      });
      foo.$form.submit();
    });

    it('prevents default behavior', function(done) {
      var eventSpy = jasmine.createSpyObj('event', ['preventDefault']);

      foo.commit = function() { return 'foo'; };

      foo.submit(eventSpy).then(function(value) {
        expect(eventSpy.preventDefault).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('.commit', function() {
    it('returns its original context', function(done) {
      jasmine.Ajax.install();

      var spy = jasmine.createSpy(),
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

      foo.commit = function() {
        expect(this.then).toEqual(jasmine.any(Function));
        this.then(spy);
        return this;
      };

      foo.submit().finally(function() {
        expect(spy).toHaveBeenCalled();
      }).then(done);

      response.then(success, error).then(function() {
        expect(success).toHaveBeenCalledWith('hi');
        expect(error).not.toHaveBeenCalled();
      });

      jasmine.Ajax.uninstall();
    });

    it('is a function that passes a value to its promise', function(done) {
      foo.commit = function() { return 'foo'; };

      foo.submit().then(function(value) {
        expect(value).toBe('foo');
        done();
      });
    });

    it('can be a value that is passed to its promise', function(done) {
      foo.commit = 'foo';

      foo.submit().then(function(value) {
        expect(value).toBe('foo');
        done();
      });
    });

    it('is a function that passes a value to success event', function(done) {
      foo.commit = function() { return 'foo'; };

      foo.on('success', function(value) {
        expect(value).toBe('foo');
        done();
      });

      foo.submit();
    });

    it('is a function that passes errors to its promise', function(done) {
      foo.commit = function() { throw 'foo'; };

      foo.submit().catch(function(err) {
        expect(err).toBe('foo');
        done();
      });
    });

    it('is a function that passes errors to the error event', function(done) {
      foo.commit = function() { throw 'foo'; };

      foo.on('error', function(value) {
        expect(value).toBe('foo');
        done();
      });

      foo.submit();
    });
  });

  describe('events', function() {
    describe('after', function() {
      it('fires after the success event', function(done) {
        var order = 0;

        foo.commit = function() { return 'foo'; };

        foo.on('success', function(value) {
          expect(order++).toBe(0);
        });

        foo.on('after', function(value) {
          expect(order++).toBe(1);
          done();
        });

        foo.submit();
      });

      it('fires after the error event', function(done) {
        var order = 0;

        foo.commit = function() { throw 'foo'; };

        foo.on('error', function(value) {
          expect(order++).toBe(0);
        });

        foo.on('after', function(value) {
          expect(order++).toBe(1);
          done();
        });

        foo.submit();
      });
    });

    describe('before', function() {
      it('fires before the success event', function(done) {
        var order = 0;

        foo.commit = function() { return 'foo'; };

        foo.on('before', function(value) {
          expect(order++).toBe(0);
        });

        foo.on('success', function(value) {
          expect(order++).toBe(1);
          done();
        });

        foo.submit();
      });

      it('fires before the error event', function(done) {
        var order = 0;

        foo.commit = function() { throw 'foo'; };

        foo.on('before', function(value) {
          expect(order++).toBe(0);
        });

        foo.on('error', function(value) {
          expect(order++).toBe(1);
          done();
        });

        foo.submit();
      });

      it('fires before the data is serialized', function(done) {
        var order = 0;

        foo.validator = jasmine.createSpy().and.returnValue(false);

        foo.on('before', function(value) {
          this.$form.find('input').val('something');
        });

        foo.on('error', function(value) {
          expect(foo.validator).toHaveBeenCalledWith({ foo: 'something' });
          done();
        });

        foo.submit();
      });
    });
  });

  describe('destroy()', function() {
    it('throws error when destroying null form', function() {
      foo.destroy();
      expect(foo.$form).toEqual(null);
      expect(function() {foo.destroy();}).toThrow(new Error("Cannot destroy null form"));
    });

    it('throws error when you submit after destroy', function() {
      foo.destroy();
      expect(foo.$form).toEqual(null);
      expect(function() {foo.submit();}).toThrow(new Error("The form cannot be null"));
    });
  });
});
