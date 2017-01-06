define([
  'util/image',
  'fixtures/dom/Image/fileReaderData'
], function(image, Images) {
  'use strict';

  describe('util/image', function() {
    describe('#isCMYK', function() {
      it('detects a CMYK jpeg image properly', function() {
        expect(image.isCMYK(image.getBinaryFromDataUri(Images.cmykKoala.result))).toBeTruthy();
      });

      it('detects a non-CMYK jpeg image properly', function() {
        expect(image.isCMYK(image.getBinaryFromDataUri(Images.rgbGrant.result))).toBeFalsy();
      });

      it('detects a non-jpeg image properly', function() {
        expect(image.isCMYK(image.getBinaryFromDataUri(Images.animatedGif.result))).toBeFalsy();
      });
    });

    describe('#isAnimatedGif', function() {
      it('detects an animated gif properly', function() {
        expect(image.isAnimatedGif(image.getBinaryFromDataUri(Images.animatedGif.result))).toBeTruthy();
      });

      it('detects a non-gif image properly', function() {
        expect(image.isAnimatedGif(image.getBinaryFromDataUri(Images.rgbGrant.result))).toBeFalsy();
      });
    });
  });
});
