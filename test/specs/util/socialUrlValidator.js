define(['util/socialUrlValidator'], function(socialUrlValidator) {
  'use strict';

  describe('util/socialUrlValidator', function() {
    beforeEach(function() {
      this._twitter = /(^|\.)twitter\.com$/;
    });

    it('rejects bad urls', function() {
      expect(socialUrlValidator.isValid(this._twitter, 'adsafasf')).toBe(false);
      expect(socialUrlValidator.isValid(this._twitter, 'google.com')).toBe(false);
      expect(socialUrlValidator.isValid(this._twitter, 'twitter.com')).toBe(false);
      expect(socialUrlValidator.isValid(this._twitter, '.twitter.com')).toBe(false);
      expect(socialUrlValidator.isValid(this._twitter, 'eviltwitter.com')).toBe(false);
      expect(socialUrlValidator.isValid(this._twitter, 'twitterevil.com')).toBe(false);
    });

    it('passes good urls', function() {
      expect(socialUrlValidator.isValid(this._twitter, 'http://www.twitter.com/foo')).toBe(true);
      expect(socialUrlValidator.isValid(this._twitter, 'http://twitter.com/foo')).toBe(true);
      expect(socialUrlValidator.isValid(this._twitter, 'https://www.twitter.com/foo')).toBe(true);
      expect(socialUrlValidator.isValid(this._twitter, 'https://twitter.com/foo')).toBe(true);
    });

    it('normalizes urls missing protocols', function() {
      expect(socialUrlValidator.normalize('www.twitter.com/foo')).toEqual('http://www.twitter.com/foo');
    });

    it('normalizes urls in a way that can be successfully validated', function() {
      expect(socialUrlValidator.isValid(this._twitter, socialUrlValidator.normalize('twitter.com/foo'))).toBe(true);
      expect(socialUrlValidator.isValid(this._twitter, socialUrlValidator.normalize('http://twitter.com/foo'))).toBe(true);
    });
  });
});
