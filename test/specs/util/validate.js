define(['util/validate'], function(validate) {
  'use strict';

  describe('lib/validate', function() {
    var goodUrls = [
      'http://a.com',
      'http://www.a.com',
      'https://www.a.com',
      'a.com',
      'http://a.com?blah',
      'a.com?blah',
      'smurf.co',
      'http://foo:bar@a.com',
      'http://InSens.COm',
      'ftp://blah.com',
      'fun.stuff.with.urls.co.uk',
    ];
    var tests = {
          Generic: {
            good: [' ', 'anything', '!@#$%^&*()-=', '\''],
            bad: ['<script type="jarvascript">document.write', null, undefined]
          },

          AlphaNumeric: {
            good: ['bacon123', 'anything', '165092', 'Clément'],
            bad: ['<script type="jarvascript">document.write', ' ', '\'', '!@#$%^&*()-=', '"']
          },

          Alpha: {
            good: ['bacon', 'Clément', 'ångstrom'],
            bad: ['Astoria-Ditmars', '¬®¯§»÷½°¹¸·¶µ´³²±', '!@#$%^&*()-=', '"']
          },

          AlphaDash: {
            good: ['bacon', 'Clément', 'ångstrom', 'États-Unis'],
            bad: ['¬®¯§»÷½°¹¸·¶µ´³²±', '!@#$%^&*()-=', '"']
          },

          ANDash: {
            good: ['bacon', 'Clément', 'ångstrom', 'États-Unis', 'r4zz13-d4zz13'],
            bad: ['¬®¯§»÷½°¹¸·¶µ´³²±', '!@#$%^&*()-=', '"']
          },

          ANUnder: {
            good: ['bacon_', '_Clément', 'ångstrom', 'États_Unis', 'r4zz13_d4zz13'],
            bad: ['¬®¯§»÷½°¹¸·¶µ´³²±', '!@#$%^&*()-=', '"', 'r4zz13-d4zz13']
          },

          Email: {
            good: ['a@b.co', 'a.b@c.do', 'a+b@d.co', 'a_b@d.co', 'a@b.c.do', 'a@b-c.do'],
            bad: ['a@b', 'a@b.c', 'a @b.c', 'a!b@c.d', 'aßb@c.d', 'a@b c.d', 'a@b!c.d', 'a@bß.c', 'a@b_c.d', 'a@b..c']
          },

          Password: {
            good: ['bacon123', 'password', 'ångstro?!', 'Ét)(<>@', 'r4zz13-d4zz13'],
            bad: ['abcde', 'abcdefghijklmnopqrstuvwxyz1234567']
          },

          Url: {
            good: ['http://foo.com', 'http://foo', 'https://foo.com/bar', 'www.foo.com', 'http://foo.com/?bar#what'],
            bad: ['htts://foo.com', 'ww.foo.com', 'https://foo.hack"attr']
          },

          UrlWithProtocol: {
            good: ['http://foo.com', 'https://foo.com/bar', 'http://foo.com/?bar#what', 'http://1.2.3.4', 'http://some.very.long.domain', 'http://a.co', 'http://punycode.XN--TCKWE', 'http://全国温泉ガイド.jp', 'http://उदाहरण.परीक्षा', 'https://инобрнауки.рф'],
            bad: ['foo-bar', 'http://hello', 'http://-foo.com', 'http://foo.-cm', 'htts://foo.com', 'ww.foo.com', 'www.foo.com', '12.34.56.78', 'https://foo.hack"attr', 'canada.XN--TFTFTF', 'инобрнауки', 'ガイド.jp']
          },

          UrlExt: {
            good: ['www.foo.com', 'abcde.us', 'https://foo.com/bar', 'http://foo.com/?bar#what', 'http://1.2.3.4', 'http://a.co', 'http://punycode.XN--TCKWE', 'canada.XN--TFTFTF', 'http://xn--p1b6ci4b4b3a.xn--11b5bs3a9aj6g', 'http://全国温泉ガイド.jp', 'http://उदाहरण.परीक्षा', 'инобрнауки.рф'],
            bad: ['foo-bar', 'http://hello', 'htts://foo.com', 'http://abc.', 'инобрнауки']
          },

          City: {
            good: ['Boston', 'Aloi/Alcoy', 'Cote D\'Ivoire'],
            bad: ['Cote D>Ivoire', 'Wat?']
          },

          Html: {
            good: ['<p></p>', '<em></em>', '<u></u>', '<strong></strong>'],
            bad: ['<script></script>', '<embed></embed>']
          },

          ContainsUrl: {
            good: goodUrls.concat(goodUrls.map(function(url) { return 'In the ' + url + ' middle'; })),
            bad: ['Text without a link', 'a.a', 'http://', 'www.f', 'In other words...I....LOVE IT!', 'I wanted to explore a more intimate and everyday style of Iceland... Glad you like it! :)']
          },

          ContainsEmail: {
            good: ['blah@blah.com', 'blah.something1@f.co', 'With IP address test@[123.123.123.123]', 'In the blah.soioj@asdf.abz middle'],
            bad: ['blah.com', '@blah.com', 'friend@something', 'With broken IP address test@[123.123.123]'],
          },
        },

        /**
         * Verify value for rules are valid. Context should be set to rules.
         *
         * @param {string} rule rule to validate against
         * @param {string} testCase value being validated
         */
        good = function(rule, testCase) {
          expect(validate(testCase, rule)).toBe(true);
          expect(validate.message).not.toBeDefined();
        },

        /**
         * Verify value for rules are not valid. Context should be set to rules.
         *
         * @param {string} rule rule to validate against
         * @param {string} testCase value being validated
         */
        bad = function(rule, testCase) {
          expect(validate(testCase, rule)).toBe(false);
          expect(validate.message).toBeDefined();
        },
        key;

    function notNullUndefined(val) {
      return val != null;
    }

    function verifyRequired(key) {
      var validator = 'required,' + key;
      tests[key].good.forEach(function(testCase) { good(validator, testCase); });
      tests[key].bad.filter(notNullUndefined).forEach(function(testCase) { bad(validator, testCase); });
    }

    function verifyOptional(key) {
      good(key, '');
      good(key, null);
      good(key, undefined);

      tests[key].good.forEach(function(testCase) { good(key, testCase); });
      tests[key].bad.filter(notNullUndefined).forEach(function(testCase) { bad(key, testCase); });
    }

    for (key in tests) {
      it('verifies required ' + key, verifyRequired.bind(this, key));
    }

    for (key in tests) {
      it('verifies optional values correctly for ' + key, verifyOptional.bind(this, key));
    }

    it('allows new rules to be added', function() {
      expect(validate.tests.amazingRule).not.toBeDefined();

      validate.tests.amazingRule = {
        test: function(corpus) {
          return corpus.charAt(0) === 'A';
        },
        message: 'This field must begin with A'
      };

      validate('  ', 'amazingRule');
      expect(validate.message).toEqual('This field must begin with A');

      delete validate.tests.amazingRule;
    });

    it('verifies required', function() {
      validate('', 'required,Generic');
      expect(validate.message).toEqual('This field is required');
    });

    it('verifies requireTrimmed', function() {
      good('requireTrimmed', ' foo');
      good('requireTrimmed', 'foo ');

      validate('  ', 'requireTrimmed');
      expect(validate.message).toEqual('This field must not be blank');
    });

    it('verifies required null', function() {
      validate(null, 'required,Generic');
      expect(validate.message).toEqual('This field is required');
    });

    it('verifies required undefined', function() {
      validate(undefined, 'required,Generic');
      expect(validate.message).toEqual('This field is required');
    });

    it('passes required 0', function() {
      good('required,Integer', 0);
    });

    it('runs validator for 0', function() {
      bad('Alpha', 0);
    });

    it('verifies length when a minimum and maximum are defined', function() {
      var tests = {
        good: ['a', 'aa'],
        bad: ['', 'aaa']
      };

      tests.good.forEach(function(testCase) { good('required,length[1,2]', testCase); });
      tests.bad.forEach(function(testCase) { bad('required,length[1,2]', testCase); });
    });

    it('verifies length when a only a maximum is defined', function() {
      var tests = {
        good: ['12', 'aas'],
        bad: ['aaaa', '12345']
      };

      tests.good.forEach(function(testCase) { good('required,length[,3]', testCase); });
      tests.bad.forEach(function(testCase) { bad('required,length[,3]', testCase); });
    });

    it('verifies length when a only a minimum is defined', function() {
      var tests = {
        good: ['aaa', '11111'],
        bad: ['1', 'aa']
      };

      tests.good.forEach(function(testCase) { good('required,length[3,]', testCase); });
      tests.bad.forEach(function(testCase) { bad('required,length[3,]', testCase); });
    });

    it('verifies optional', function() {
      var tests = {
        good: ['', 'text?', 'aaa']
      };

      tests.good.forEach(function(testCase) { good('optional', testCase); });
    });
  });
});
