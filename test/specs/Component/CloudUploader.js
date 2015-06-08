define([
  'jquery',
  'mocks/fineuploader',
  'Component/CloudUploader'
], function($, fineUploaderMock, Uploader) {
  'use strict';

  describe('Component/CloudUploader', function() {
    function injectMock(uploader) {
      var mock = new fineUploaderMock.s3.FineUploaderBasic(uploader._config);
      uploader._uploader = mock;
      return mock;
    }

    beforeEach(function() {
      this.uploader = Uploader.extend({
        _getSignatureConfig: function() { return {}; },
        _getRequestConfig: function() {
          return {
            endpoint: 'http://example.com/example'
          };
        },
        _isDisabled: function() { return false; }
      }).init();
    });

    afterEach(function() {
      this.uploader.destroy();
    });

    describe('events', function() {
      beforeEach(function() {
        this.uploaderMock = injectMock(this.uploader);
      });

      it('fires the complete event on a successful upload', function(done) {
        spyOn(this.uploader._uploader, 'getKey').and.returnValue('1.jpg');

        this.uploader.on('complete', function(data) {
          expect(data.response.http_code).toBe(200);
          expect(data.id).toBe(0);
          expect(data.uploadEndpoint).toBe('http://example.com/example');
          expect(data.uploadPath).toBe('1.jpg');
          done();
        });

        this.uploaderMock.fakeComplete({
          http_code: 200
        });
      });

      it('fires the allComplete event when all uploads are complete', function(done) {
        this.uploader.on('allComplete', done);
        this.uploaderMock.fakeAllComplete();
      });

      it('fires the submit event after a successful submission', function(done) {
        this.uploader.on('submit', function(file) {
          expect(file.name).toBeDefined();
          expect(file.id).toBeDefined();
          expect(file.readerData).toBeDefined();
          done();
        });
        this.uploaderMock.fakeSubmit();
      });

      it('fires the error event on an upload error', function(done) {
        this.uploader.on('error', function(data) {
          expect(data.id).toBe(0);
          expect(data.name).toBe(this.uploaderMock.getFakeImageName());
          expect(data.message).toBe('image upload error');
          expect('xhr' in data).toBeTruthy();
          done();
        }.bind(this));

        this.uploaderMock.fakeError('image upload error');
      });

      it('fires the cancel event on an upload cancel', function(done) {
        this.uploader.on('cancel', function(data) {
          expect('id' in data).toBeTruthy();
          expect('name' in data).toBeTruthy();
          done();
        });
        this.uploaderMock.fakeCancel();
      });
    });

    describe('formatSize', function() {
      it('returns kB for kilobytes', function() {
        expect(this.uploader.formatSize(1)).toBe('0.1kB');
        expect(this.uploader.formatSize(1024)).toBe('1.0kB');
      });

      it('returns MB for megabytes', function() {
        expect(this.uploader.formatSize(1024 * 1024)).toBe('1.0MB');
      });
    });
  });
});
