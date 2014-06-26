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
      }).then(done);
      expect(foo.validator).toHaveBeenCalledWith({ foo: 'bar'});
    });

    it('does not call commit when validator is false', function(done) {
      spyOn(foo, 'validator').and.returnValue(false);
      spyOn(foo, 'commit');
      foo.submit().finally(function() {
        expect(foo.commit).not.toHaveBeenCalled();
      }).then(done);
      expect(foo.validator).toHaveBeenCalledWith({ foo: 'bar'});
    });

    it('returns error when validator throws an error', function(done) {
      spyOn(foo, 'validator').and.callFake(function() {
        throw new Error('you shall not pass');
      });
      spyOn(foo, 'commit');
      foo.submit().finally(function() {
        expect(foo.commit).not.toHaveBeenCalled();
      }).then(done);
      expect(foo.validator).toHaveBeenCalledWith({ foo: 'bar'});
      expect(foo.validator).toThrowError('you shall not pass');
    });

    it('throws error event when validation fails', function(done) {
      var spy = jasmine.createSpy();
      spyOn(foo, 'validator').and.callFake(function() {
        throw new Error('you shall not pass');
      });
      foo.on('error', spy);
      foo.submit();
      setTimeout(function() {
        expect(spy).toHaveBeenCalledWith(new Error('you shall not pass'));
        done();
      }, 100);
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
      var spy = jasmine.createSpy();
      foo.on('error:show', spy);
      foo.validator = function() { throw { foo: "This is bad" }; };
      foo.submit();
      setTimeout(function() {
        expect(spy).toHaveBeenCalled();
        expect(spy.calls.argsFor(0)[1]).toBe('This is bad');
        expect(spy.calls.argsFor(0)[0]).toEqual(jasmine.any(jQuery));
        expect(spy.calls.argsFor(0)[0][0]).toBe($content.find('[name=foo]')[0]);
        done();
      }, 100);
    });
  });

  describe('.commit', function() {
    it('is a value and default behavior happens', function() {
      foo.$form.on('submit', function(event) {
        expect(event.isDefaultPrevented()).toBe(false);
        return false;
      });
      foo.$form.submit();
    });

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

    it('is a function that returns a value', function(done) {
      var spy = jasmine.createSpy();
      foo.commit = function() { return 'foo'; };
      foo.on('success', spy);
      foo.submit().then(function(value) {
        expect(value).toBe('foo');
      });
      setTimeout(function() {
        expect(spy).toHaveBeenCalledWith("foo");
        done();
      }, 100);
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
