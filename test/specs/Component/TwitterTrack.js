define([
  'Component/TwitterTrack'
], function(TwitterTrack) {
  'use strict';

  describe('Component/TwitterTrack', function() {
    beforeEach(function() {
      spyOn(TwitterTrack.prototype, '_load').and.returnValue(Promise.resolve());

      window.twq = jasmine.createSpy('twq');
      this.twitterTrack = TwitterTrack.init('123');
    });

    afterEach(function() {
      delete window.twq;
      this.twitterTrack.destroy();
    });

    describe('.init', function() {
      it('loads the library automatically', function() {
        expect(this.twitterTrack._load).toHaveBeenCalled();
      });

      it('creates the "twq" function if it does not exist', function() {
        expect(window.twq.version).not.toBeDefined();
        expect(window.twq.queue).not.toBeDefined();

        delete window.twq;

        TwitterTrack.init('123');

        expect(window.twq).toEqual(jasmine.any(Function));
        expect(window.twq.version).toEqual('1');
        expect(window.twq.queue).toEqual([]);
      });

      it('makes an "init" call with the provided pixel id', function(done) {
        this.twitterTrack._loadingPromise
        .then(function() {
          expect(window.twq).toHaveBeenCalledWith('init', '123');
          done();
        });
      });
    });

    describe('#trackPageView', function() {
      it('makes a "track" call with "PageView"', function(done) {
        this.twitterTrack.trackPageView()
        .then(function() {
          expect(window.twq).toHaveBeenCalledWith('track', 'PageView');
          done();
        });
      });
    });
  });
});
