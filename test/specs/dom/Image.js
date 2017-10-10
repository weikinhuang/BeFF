define([
  'jquery',
  '@behance/nbd/Promise',
  'dom/Image',
  'fixtures/dom/Image/fileReaderData'
], function($, Promise, Image, Images) {
  'use strict';

  describe('dom/Image', function() {
    var imgUrl = '/base/test/fixtures/dom/Image/grant.jpeg';

    function loadImage(src) {
      return new Promise(function(resolve) {
        var image = new Image();

        image.on('load', function() {
          resolve(image);
        });

        image.src(src);
      });
    }

    describe('#getDimensions', function() {
      it('resolves with an object describing the image dimensions', function(done) {
        Image.getDimensions(imgUrl)
        .then(function(dimensions) {
          expect(dimensions).toEqual({
            displayWidth: 423,
            displayHeight: 640,
            width: 423,
            height: 640
          });
          done();
        });
      });
    });

    describe('#isCMYK', function() {
      it('detects a CMYK jpeg image properly', function(done) {
        loadImage(Images.cmykKoala.result).then(function(image) {
          expect(image.isCMYK()).toBeTruthy();
          done();
        });
      });

      it('detects a non-CMYK jpeg image properly', function(done) {
        loadImage(Images.rgbGrant.result).then(function(image) {
          expect(image.isCMYK()).toBeFalsy();
          done();
        });
      });

      it('detects a non-jpeg image properly', function(done) {
        loadImage(Images.animatedGif.result).then(function(image) {
          expect(image.isCMYK()).toBeFalsy();
          done();
        });
      });

      it('throws when called on a non-base64 image', function(done) {
        loadImage(imgUrl).then(function(image) {
          expect(function() { image.isCMYK(); }).toThrow();
          done();
        });
      });
    });

    describe('#isAnimatedGif', function() {
      it('detects an animated gif properly', function(done) {
        loadImage(Images.animatedGif.result).then(function(image) {
          expect(image.isAnimatedGif()).toBeTruthy();
          done();
        });
      });

      it('detects a non-gif image properly', function(done) {
        loadImage(Images.rgbGrant.result).then(function(image) {
          expect(image.isAnimatedGif()).toBeFalsy();
          done();
        });
      });

      it('throws when called on a non-base64 image', function(done) {
        loadImage(imgUrl).then(function(image) {
          expect(function() { image.isAnimatedGif(); }).toThrow();
          done();
        });
      });
    });

    describe('#whenComplete', function() {
      beforeEach(function() {
        var $context = affix('div');
        $context.affix('img[class="no-src"]');
        $context.affix('img[class="has-src"]');
        $context.affix('img[class="empty-src"]');

        this.emptySrcEl = $('.empty-src')[0];
        this.noSrcEl = $('.no-src').attr('data-src', imgUrl)[0];
        this.hasSrcEl = $('.has-src').attr('src', imgUrl)[0];

        this.hasSrcPromise = Image.whenComplete(this.hasSrcEl).then(function() { return 'has-src'; });
        this.noSrcPromise = Image.whenComplete(this.noSrcEl).then(function() { return 'no-src'; });
        this.emptySrcPromise = Image.whenComplete(this.emptySrcEl).then(function() { return 'empty-src'; });
      });

      it('Will resolve an image with src before an image with an empty src', function(done) {
        Promise.race([
          this.emptySrcPromise,
          this.hasSrcPromise
        ])
        .then(function(identifier) {
          expect(identifier).toBe('has-src');
          done();
        });
      });

      it('Will resolve an image with src before an image with no src', function(done) {
        Promise.race([
          this.noSrcPromise,
          this.hasSrcPromise
        ])
        .then(function(identifier) {
          expect(identifier).toBe('has-src');
          done();
        });
      });

      it('Will resolve an image with empty src once given a new src', function(done) {
        Promise.race([
          this.noSrcPromise,
          this.emptySrcPromise
        ])
        .then(function(identifier) {
          expect(identifier).toBe('empty-src');
          done();
        });

        this.emptySrcEl.src = imgUrl;
      });

      it('Will resolve an image with no src once given a new src', function(done) {
        Promise.race([
          this.noSrcPromise,
          this.emptySrcPromise
        ])
        .then(function(identifier) {
          expect(identifier).toBe('no-src');
          done();
        });

        this.noSrcEl.src = imgUrl;
      });

      it('Will resolve an already loaded image', function(done) {
        this.hasSrcPromise
        .then(function() {
          return Image.whenComplete(this.hasSrcEl);
        }.bind(this))
        .then(done);
      });
    });
  });
});
