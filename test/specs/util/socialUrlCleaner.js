define(['util/socialUrlCleaner'], function(socialUrl) {
  'use strict';

  describe('util/socialUrlCleaner', function() {
    beforeEach(function() {
      this._urls = {
        twitter: {
          domain: /twitter.com\//,
          prefix: '@'
        },
        behance: {
          domain: /behance.net\//
        },
        linkedin: {
          domain: /linkedin.com\/in\//
        },
        google: {
          domain: /plus.google.com\//,
          prefix: '+'
        },
        tumblr: {
          domain: /.tumblr.com/
        }
      };
    });

    it('passes through an unmatched pattern as is', function() {
      expect(socialUrl(this._urls, 'blah.com/bar')).toEqual('blah.com/bar');
    });

    it('can implicitly clean a prefixed username', function() {
      expect(socialUrl(this._urls, '@foo')).toEqual('foo');
    });

    it('can implicitly clean a username when a bad service key is provided', function() {
      expect(socialUrl(this._urls, 'foo', 'baz')).toEqual('foo');
    });

    it('can clean http url', function() {
      expect(socialUrl(this._urls, 'http://foo.com')).toEqual('foo.com');
    });

    it('can clean https url', function() {
      expect(socialUrl(this._urls, 'https://foo.com')).toEqual('foo.com');
    });

    it('removes www from url', function() {
      expect(socialUrl(this._urls, 'www.foo.com')).toEqual('foo.com');
    });

    it('removes www and https from url', function() {
      expect(socialUrl(this._urls, 'https://www.foo.com')).toEqual('foo.com');
    });

    it('removes white space', function() {
      expect(socialUrl(this._urls, '  foo  ')).toEqual('foo');
    });

    it('removes everything at once', function() {
      expect(socialUrl(this._urls, '   https://plus.google.com/+foo       ')).toEqual('foo');
    });

    describe('twitter', function() {
      it('can explicitly clean a url', function() {
        expect(socialUrl(this._urls, 'twitter.com/foo', 'twitter')).toEqual('foo');
      });

      it('can explicitly clean a prefixed username', function() {
        expect(socialUrl(this._urls, '@foo', 'twitter')).toEqual('foo');
      });

      it('can implicitly clean a url', function() {
        expect(socialUrl(this._urls, 'twitter.com/foo')).toEqual('foo');
      });
    });

    describe('behance', function() {
      it('can explicitly clean a url', function() {
        expect(socialUrl(this._urls, 'behance.net/foo', 'behance')).toEqual('foo');
      });

      it('can implicitly clean a url', function() {
        expect(socialUrl(this._urls, 'behance.net/foo')).toEqual('foo');
      });
    });

    describe('linkedin', function() {
      it('can explicitly clean a url', function() {
        expect(socialUrl(this._urls, 'linkedin.com/in/foo', 'linkedin')).toEqual('foo');
      });

      it('can implicitly clean a url', function() {
        expect(socialUrl(this._urls, 'linkedin.com/in/foo')).toEqual('foo');
      });
    });

    describe('google', function() {
      it('can explicitly clean a url', function() {
        expect(socialUrl(this._urls, 'plus.google.com/+foo', 'google')).toEqual('foo');
      });

      it('can implicitly clean a url', function() {
        expect(socialUrl(this._urls, 'plus.google.com/+foo')).toEqual('foo');
      });
    });

    describe('tumblr', function() {
      it('can explicitly clean a tumblr url', function() {
        expect(socialUrl(this._urls, 'foo.tumblr.com', 'tumblr')).toEqual('foo');
      });

      it('can implicitly clean a tumblr url', function() {
        expect(socialUrl(this._urls, 'foo.tumblr.com')).toEqual('foo');
      });
    });
  });
});
