define([
  'jquery',
  'ux/scrollfloat',
  'text!fixtures/ux/scrollfloat.html'
], function($, scrollfloat, fixture) {
  'use strict';

  describe('ux/scrollfloat', function() {
    beforeEach(function() {
      affix('div').append(fixture);
      this._contextSelector = '.js-mock-window';
      this._contentContextSelector = '.js-content-measure';
      this._$window = $(this._contextSelector);

      this._scrollTo = function(top) {
        this._$window.scrollTop(top);
        this._$window.trigger('scroll');
      };
      this._spy = {
        fn: jasmine.createSpy()
      };
    });

    describe('without contentContext', function() {
      afterEach(function() {
        scrollfloat.off(this._spy.fn, this._contextSelector);
      });

      it('should trigger callback when overflowY is not hidden', function() {
        expect(this._spy.fn.calls.count()).toBe(0);

        scrollfloat(0.8, this._spy.fn, this._contextSelector);

        expect(this._spy.fn.calls.count()).toBe(1);

        this._scrollTo(this._$window.prop('clientHeight'));

        expect(this._spy.fn.calls.count()).toBe(2);
      });

      it('should NOT trigger callback when overflowY is hidden', function() {
        this._$window.css('overflowY', 'hidden');

        scrollfloat(0.8, this._spy.fn, this._contextSelector);
        this._scrollTo(this._$window.prop('clientHeight'));

        expect(this._spy.fn).not.toHaveBeenCalled();
      });

      it('should NOT trigger callback if far from bottom of context', function() {
        $('.js-content-wrap').height(6000);
        scrollfloat(0.8, this._spy.fn, this._contextSelector);
        expect(this._spy.fn).not.toHaveBeenCalled();
      });
    });

    describe('with scrollContext', function() {
      afterEach(function() {
        scrollfloat.off(this._spy.fn, this._contextSelector, this._contentContextSelector);
      });

      it('should throw if context is not a string', function() {
        $('.js-content-wrap').height(6000);
        expect(function() {
          scrollfloat(0.8, this._spy.fn, this._$window[0], this._contentContextSelector);
        }.bind(this)).toThrow();
      });

      it('should throw if contentContext is not a string', function() {
        $('.js-content-wrap').height(6000);
        expect(function() {
          scrollfloat(0.8, this._spy.fn, this._contextSelector, $(this._contentContextSelector));
        }.bind(this)).toThrow();
      });

      it('should trigger callback if far from bottom of context but close to bottom of contentContext', function() {
        $('.js-content-wrap').height(6000);
        scrollfloat(0.8, this._spy.fn, this._contextSelector, this._contentContextSelector);
        expect(this._spy.fn).toHaveBeenCalled();
      });
    });
  });
});

