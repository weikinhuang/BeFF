define([
  'dom/Image'
], function(Image) {
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
  });
});
