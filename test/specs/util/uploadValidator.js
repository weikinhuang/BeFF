define([
  'util/uploadValidator',
  '../../fixtures/files'
], function(uploadValidator, fixtureData) {
  'use strict';

  describe('lib/uploadValidator', function() {
    describe('.CMYK', function() {
      it('returns a rejected promise with a CMYK image', function(done) {
        var data = { readerData: fixtureData.cmykKoala };
        uploadValidator.CMYK(data).catch(function(reason) {
          expect(reason).toEqual(new Error('Your images look best on the web in RGB instead of CMYK. Please upload koala.jpeg as a RGB image.'));
          done();
        });
      });

      it('returns a promise with the file with a RGB image', function(done) {
        var data = { readerData: fixtureData.rgbGrant };
        uploadValidator.CMYK(data).then(function(file) {
          expect(file).toBe(data);
          done();
        });
      });

      it('returns a promise with the file with a non image', function(done) {
        var data = { readerData: fixtureData.nonImage };
        uploadValidator.CMYK(data).then(function(file) {
          expect(file).toBe(data);
          done();
        });
      });
    });

    describe('.CMYKWarning', function() {
      it('returns a promise with an array containing a warning when validating a CMYK image', function(done) {
        var data = { readerData: fixtureData.cmykKoala };
        uploadValidator.CMYKWarning(data).then(function(warnings) {
          expect(warnings).toEqual(['Your images look best on the web in RGB instead of CMYK. Please upload koala.jpeg as a RGB image.']);
          done();
        });
      });

      it('returns a promise with an empty array when validating a RGB image', function(done) {
        var data = { readerData: fixtureData.rgbGrant };
        uploadValidator.CMYKWarning(data).then(function(warnings) {
          expect(warnings).toEqual([]);
          done();
        });
      });

      it('appends the CMYK warning to optionally passed in array of existing warnings', function(done) {
        var data = { readerData: fixtureData.cmykKoala };
        var existingWarnings = ['foo'];
        uploadValidator.CMYKWarning(data, existingWarnings).then(function(warnings) {
          expect(warnings).toEqual(['foo', 'Your images look best on the web in RGB instead of CMYK. Please upload koala.jpeg as a RGB image.']);
          done();
        });
      });
    });
  });
});
