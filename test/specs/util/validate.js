define(['util/validate'], function(validate) {
  'use strict';

  var tests = {

    required: {
      good: [' ', 'anything', '!@#$%^&*()-=', '\''],
      bad: ['', null, undefined]
    },

    Generic: {
      good: [' ', 'anything', '!@#$%^&*()-=', '\''],
      bad: ['<script type="jarvascript">document.write', '', null, undefined]
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
      good: ['user@example.com'],
      bad: ['dave@behanced..com']
    },

    Password: {
      good: ['bacon123', 'password', 'ångstro?!', 'Ét)(<>@', 'r4zz13-d4zz13'],
      bad: ['abcde', 'abcdefghijklmnopqrstuvwxyz1234567']
    },

    Html: {
      good: ['<p></p>', '<em></em>', '<u></u>', '<strong></strong>'],
      bad: ['<script></script>', '<embed></embed>']
    }
  },

  good = function(corpus) {
    expect(validate(corpus, this)).toBe(true);
    expect(validate.message).not.toBeDefined();
  },

  bad = function(corpus) {
    expect(validate(corpus, this)).toBe(false);
    expect(validate.message).toBeDefined();
  };

  describe('lib/validate', function() {
    var key;
    function verify(key) {
      tests[key].good.forEach(good, key);
      tests[key].bad.forEach(bad, key);
    }

    for (key in tests) {
      it('verifies ' + key, verify.bind(this, key));
    }

    it('verifies length', function() {
      var tests = {
        good: ['a', 'aa'],
        bad: ['', 'aaa']
      };

      tests.good.forEach(good, "length[1,2]");
      tests.bad.forEach(bad, "length[1,2]");
    });

    it('verifies optional', function() {
      var tests = {
        good: ['', 'text?', 'aaa'],
      };

      tests.good.forEach(good, "optional");
    });
  });

  return validate;
});
