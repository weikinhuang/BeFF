define(['trait/eventMappable', 'nbd/util/extend'], function(eventMappable, extend) {
  'use strict';

  var test, div;

  beforeEach(function() {
    test = extend({
      $view: affix('div .foo')
    }, eventMappable);

    div = test.$view[0];
  });

  describe("_mapEvents", function() {
    it('maps event correctly', function() {
      var spy = jasmine.createSpy().and.callFake(function() {
        expect(this).toBe(div);
      });
      expect(test.$view.is('div')).toBeTruthy();
      test.events = {
        click: 'trafalgar'
      };

      test.trafalgar = jasmine.createSpy();
      test._mapEvents();
      test.$view.click();
      expect(test.trafalgar).toHaveBeenCalled();
    });

    it('does not trigger event that is not called', function() {
      test.events = {
        click: {
          '.foo': 'trafalgar'
        },
        select: {
          '.foo': 'bar'
        }
      };

      test.trafalgar = jasmine.createSpy('trafalgar');
      test.bar = jasmine.createSpy('bar');

      test._mapEvents();
      test.$view.click();
      expect(test.trafalgar).not.toHaveBeenCalled();
      expect(test.bar).not.toHaveBeenCalled();

      test.$view.find(".foo").click();
      expect(test.trafalgar).toHaveBeenCalled();
      expect(test.bar).not.toHaveBeenCalled();

      test.$view.find(".foo").select();
      expect(test.trafalgar.calls.count()).toEqual(1);
      expect(test.bar).toHaveBeenCalled();
    });

    it('properly handles null events', function() {
      test.events = null;
      expect(function() {
        test._mapEvents();
      }).not.toThrowError();
      expect(test.events).toBeNull();
    });

    it('properly handles when events is empty', function() {
      test.events = { };
      expect(function() {
        test._mapEvents();
      }).not.toThrowError();
      expect(test.events).toEqual({});
    });

    it('properly handles an array of functions', function() {
      var spy = jasmine.createSpy(),
          spy2 = jasmine.createSpy();

      test.events = {
        click: [spy, spy2, 'trafalgar']
      };

      test.trafalgar = jasmine.createSpy('trafalgar');

      test._mapEvents();
      test.$view.click();
      expect(test.trafalgar).toHaveBeenCalled();
      expect(spy).toHaveBeenCalled();
      expect(spy2).toHaveBeenCalled();
      expect(test.trafalgar.calls.count()).toEqual(1);
      expect(spy.calls.count()).toEqual(1);
      expect(spy2.calls.count()).toEqual(1);
    });
  });

  describe("_undelegateEvents", function() {
    it('does not make calls after undelegated', function() {
      test.events = {
        click: 'trafalgar'
      };

      test.trafalgar = jasmine.createSpy();

      test._mapEvents();
      test.$view.click();
      test._undelegateEvents();
      test.$view.find(".foo").select();
      expect(test.trafalgar.calls.count()).toEqual(1);
    });

    it('properly handles when events is null', function() {
      test.events = null;
      test._mapEvents();
      expect(test.events).toBeNull();
      expect(function() {
        test._undelegateEvents();
      }).not.toThrowError();
      expect(test.events).toBeNull();
    });

    it('properly handles when events is empty', function() {
      test.events = { };
      test._mapEvents();
      expect(test.events).toEqual({});
      expect(function() {
        test._undelegateEvents();
      }).not.toThrowError();
      expect(test.events).toEqual({});
    });

    it('properly handles array of functions', function() {
      var spy = jasmine.createSpy(),
          spy2 = jasmine.createSpy();

      test.events = {
        click: [spy, spy2, 'trafalgar']
      };

      test.trafalgar = jasmine.createSpy('trafalgar');

      test._mapEvents();
      test.$view.click();
      test._undelegateEvents();
      expect(test.trafalgar.calls.count()).toEqual(1);
      expect(spy.calls.count()).toEqual(1);
      expect(spy2.calls.count()).toEqual(1);
    });
  });
});
