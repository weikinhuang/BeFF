define([
  'jquery',
  'ux/scrollfloat',
  'text!fixtures/ux/scrollfloat.html'
], function($, scrollfloat, fixture) {
  'use strict';

  describe('ux/scrollfloat', function() {
    beforeEach(function() {
      affix('div').append(fixture);
      this._$window = $('.js-mock-window');

      this._scrollTo = function(top) {
        this._$window.scrollTop(top);
        this._$window.trigger('scroll');
      };
      this.foo = {
        setBar: function() {}
      };
      spyOn(this.foo, 'setBar');
    });

    afterEach(function() {
      scrollfloat.off(this.foo.setBar, this._$window[0]);
    });

    describe('scroll', function() {
      it('should trigger callback when overflowY is not hidden', function() {
        expect(this.foo.setBar.calls.count()).toBe(0);

        scrollfloat(0.8, this.foo.setBar, this._$window[0]);

        expect(this.foo.setBar.calls.count()).toBe(1);

        this._scrollTo(this._$window.prop('clientHeight'));

        expect(this.foo.setBar.calls.count()).toBe(2);
      });

      it('should NOT trigger callback when overflowY is hidden', function() {
        this._$window.css('overflowY', 'hidden');

        scrollfloat(0.8, this.foo.setBar, this._$window[0]);
        this._scrollTo(this._$window.prop('clientHeight'));

        expect(this.foo.setBar).not.toHaveBeenCalled();
      });
    });
  });
});

