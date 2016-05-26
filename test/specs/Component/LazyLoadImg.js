define([
  'jquery',
  'Component/LazyLoadImg'
], function($, LazyLoadImg) {
  'use strict';

  describe('Component/LazyLoadImg', function() {
    beforeEach(function() {
      this.$content = affix('div.container[style="height:14000px"]');
      this.$elem = affix('div .js-images img[data-src="some/image1"][style="height:100px;width:100px;"]+img[data-src="some/image2"][style="height:100px;width:100px;"]');
      this.lazyLoad = LazyLoadImg.init(this.$elem);
    });

    afterEach(function() {
      this.lazyLoad.unbind();
      this.lazyLoad = null;
    });

    it('should have IntersectionObserver defined', function() {
      expect(window.IntersectionObserver).toBeDefined();
    });

    // Works in the browser only
    xit('should set src from data-src after intersection', function(done) {
      expect(this.$elem.find('img').attr('src')).toBeFalsy();
      expect(this.$elem.find('img').attr('data-src')).toBeTruthy();

      this.lazyLoad.on('load', function() {
        expect(this.$elem.find('img').attr('src')).toBeTruthy();
        expect(this.$elem.find('img').attr('data-src')).toBeFalsy();
        done();
      }.bind(this));

      this.$content.remove();
    });

    // Works in the browser only
    xit('should set srcset from data-srcset after intersection', function(done) {
      this.$elem = affix('div .js-images img[data-srcset="some/image1 100w, some/image2 50w"][style="height:100px;width:100px;"]+img[data-srcset="some/image3"][style="height:100px;width:100px;"]');
      this.lazyLoad = LazyLoadImg.init(this.$elem);

      expect(this.$elem.find('img').attr('srcset')).toBeFalsy();
      expect(this.$elem.find('img').attr('data-srcset')).toBeTruthy();

      this.lazyLoad.on('load', function() {
        expect(this.$elem.find('img').attr('srcset')).toBeTruthy();
        expect(this.$elem.find('img').attr('data-srcset')).toBeFalsy();
        done();
      }.bind(this));

      this.$content.remove();
    });

    it('should disconnect observers on unbind', function() {
      var disconnect = spyOn(this.lazyLoad._observer, 'disconnect');

      this.lazyLoad.unbind();

      expect(disconnect).toHaveBeenCalled();
    });
  });
});
