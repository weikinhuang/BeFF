define([
  'jquery',
  'nbd/Promise',
  'dom/Image'
], function($, Promise, Image) {
  'use strict';

  describe('dom/Image', function() {
    var imgUrl = '/base/test/fixtures/dom/Image/grant.jpeg';

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

    describe('#whenComplete', function() {
      beforeEach(function() {
        var $context = affix('div');
        $context.affix('img[class="no-src"]');
        $context.affix('img[class="has-src"]');
        $context.affix('img[class="empty-src"]');

        this.emptySrcEl = $('.empty-src').attr('src', '')[0];
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
