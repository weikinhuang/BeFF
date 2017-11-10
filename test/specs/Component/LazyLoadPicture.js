define([
  'jquery',
  'Component/LazyLoadPicture',
  'text!fixtures/Component/LazyLoadPicture.html'
], function($, LazyLoadPicture, fixture) {
  'use strict';

  describe('be/LazyLoadPicture', function() {
    beforeEach(function() {
      affix('div').append(fixture);

      this._$lazyPicture = $('picture.js-lazy');
      this._$lazyImg = $('img.js-lazy');
      this._$img = this._$lazyPicture.find('img');
      this._$sources = this._$lazyPicture.find('source');
    });

    it('lazyloads the picture\'s image and sources on window resize', function() {
      var src = this._$img.data('src');
      var lazyLoadPicture;
      var expectedAttrs = [];

      expect(this._$img.attr('src')).not.toBe(src);
      this._$sources.each(function(_, source) {
        var $source = $(source);
        expectedAttrs.push($source.data());

        expect($source).not.toHaveAttr('srcset');
        expect($source).not.toHaveAttr('media');
      });

      lazyLoadPicture = LazyLoadPicture.init(this._$lazyPicture);

      $(window).trigger('resize');

      expect(this._$img).not.toHaveAttr('data-src');
      expect(this._$img).toHaveAttr('src', src);
      this._$sources.each(function(i, source) {
        var $source = $(source);

        expect($source).not.toHaveAttr('data-media');
        expect($source).not.toHaveAttr('data-srcset');
        expect($source).toHaveAttr('srcset', expectedAttrs[i].srcset);
        expect($source).toHaveAttr('media', expectedAttrs[i].media);
      });

      lazyLoadPicture.destroy();
    });

    it('lazyloads the img src, srcset, and sizes on window resize', function() {
      var src = this._$lazyImg.data('src');
      var srcset = this._$lazyImg.data('srcset');
      var sizes = this._$lazyImg.data('sizes');

      var lazyLoadPicture;

      expect(this._$lazyImg.attr('src')).not.toBe(src);
      expect(this._$lazyImg.attr('srcset')).not.toBe(srcset);
      expect(this._$lazyImg.attr('sizes')).not.toBe(sizes);

      lazyLoadPicture = LazyLoadPicture.init(this._$lazyImg);

      $(window).trigger('resize');

      expect(this._$lazyImg).not.toHaveAttr('data-src');
      expect(this._$lazyImg).not.toHaveAttr('data-srcset');
      expect(this._$lazyImg).not.toHaveAttr('data-sizes');

      expect(this._$lazyImg.attr('src')).toBe(src);
      expect(this._$lazyImg.attr('srcset')).toBe(srcset);
      expect(this._$lazyImg.attr('sizes')).toBe(sizes);

      lazyLoadPicture.destroy();
    });

    it('doesn\'t remove data-* attrs if keepDataAttributes is true', function() {
      var src = this._$lazyImg.data('src');
      var srcset = this._$lazyImg.data('srcset');
      var sizes = this._$lazyImg.data('sizes');

      var lazyLoadPicture;

      expect(this._$lazyImg.attr('src')).not.toBe(src);
      expect(this._$lazyImg.attr('srcset')).not.toBe(srcset);
      expect(this._$lazyImg.attr('sizes')).not.toBe(sizes);

      lazyLoadPicture = LazyLoadPicture.init(this._$lazyImg, { keepDataAttributes: true });

      $(window).trigger('resize');

      expect(this._$lazyImg).toHaveAttr('data-src');
      expect(this._$lazyImg).toHaveAttr('data-srcset');
      expect(this._$lazyImg).toHaveAttr('data-sizes');

      expect(this._$lazyImg.attr('src')).toBe(src);
      expect(this._$lazyImg.attr('srcset')).toBe(srcset);
      expect(this._$lazyImg.attr('sizes')).toBe(sizes);

      lazyLoadPicture.destroy();
    });

    it('removes dimension attrs and style once image is loaded', function(done) {
      var lazyLoadPicture = LazyLoadPicture.init(this._$lazyPicture);

      this._$lazyPicture.on('appear', function() {
        expect(this._$img).toHaveAttr('height');
        expect(this._$img).toHaveAttr('width');
        expect(this._$img).toHaveAttr('style');

        this._$img.trigger('load');

        expect(this._$img).not.toHaveAttr('height');
        expect(this._$img).not.toHaveAttr('width');
        expect(this._$img).not.toHaveAttr('style');

        lazyLoadPicture.destroy();
        done();
      }.bind(this));

      $(window).trigger('resize');
    });

    it('doesnt remove attrs and style once image is loaded if removeAttributes is false', function(done) {
      var lazyLoadPicture = LazyLoadPicture.init(this._$lazyPicture, { removeAttributes: false });

      this._$lazyPicture.on('appear', function() {
        expect(this._$img).toHaveAttr('height');
        expect(this._$img).toHaveAttr('width');
        expect(this._$img).toHaveAttr('style');

        this._$img.trigger('load');

        expect(this._$img).toHaveAttr('height');
        expect(this._$img).toHaveAttr('width');
        expect(this._$img).toHaveAttr('style');

        lazyLoadPicture.destroy();
        done();
      }.bind(this));

      $(window).trigger('resize');
    });
  });
});
