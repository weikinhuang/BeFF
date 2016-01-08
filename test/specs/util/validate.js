define(['util/validate'], function(validate) {
  'use strict';

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
      good: ['a@b.c', 'a.b@c.d', 'a+b@d.c', 'a_b@d.c', 'a@b.c.d', 'a@b-c.d'],
      bad: ['a @b.c', 'a!b@c.d', 'aßb@c.d', 'a@b c.d', 'a@b!c.d', 'a@bß.c', 'a@b_c.d', 'a@b..c']
    },

    Password: {
      good: ['bacon123', 'password', 'ångstro?!', 'Ét)(<>@', 'r4zz13-d4zz13'],
      bad: ['abcde', 'abcdefghijklmnopqrstuvwxyz1234567']
    },

    City: {
      good: ['Boston', 'Aloi/Alcoy', 'Cote D\'Ivoire'],
      bad: ['Cote D>Ivoire', 'Wat?']
    },

    Html: {
      good: ['<p></p>', '<em></em>', '<u></u>', '<strong></strong>'],
      bad: ['<script></script>', '<embed></embed>']
    }
  },

  /**
   * Verify value for rules are valid. Context should be set to rules.
   *
   * @param {string} corpus value being validated
   */
  good = function(corpus) {
    expect(validate(corpus, this)).toBe(true);
    expect(validate.message).not.toBeDefined();
  },

  /**
   * Verify value for rules are not valid. Context should be set to rules.
   *
   * @param {string} corpus value being validated
   */
  bad = function(corpus) {
    expect(validate(corpus, this)).toBe(false);
    expect(validate.message).toBeDefined();
  };

  describe('lib/validate', function() {
    var key;
    function verifyRequired(key) {
      var validator = 'required,' + key;
      tests[key].good.forEach(good, validator);
      tests[key].bad.forEach(bad, validator);
    }

    function notNullUndefined(val) {
      return val != null;
    }

    function verifyOptional(key) {
      good.call(key, '');
      good.call(key, null);
      good.call(key, undefined);

      tests[key].good.forEach(good, key);
      tests[key].bad.filter(notNullUndefined).forEach(bad, key);
    }

    for (key in tests) {
      it('verifies required ' + key, verifyRequired.bind(this, key));
    }

    for (key in tests) {
      it('verifies optional values correctly for ' + key, verifyOptional.bind(this, key));
    }

    it('verifies required', function() {
      validate('', 'required,Generic');
      expect(validate.message).toEqual('This field is required');
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
      good.call('required,Integer', 0);
    });

    it('runs validator for 0', function() {
      bad.call('Alpha', 0);
    });

    it('verifies length', function() {
      var tests = {
        good: ['a', 'aa'],
        bad: ['', 'aaa']
      };

      tests.good.forEach(good, "required,length[1,2]");
      tests.bad.forEach(bad, "required,length[1,2]");
    });

    it('verifies optional', function() {
      var tests = {
        good: ['', 'text?', 'aaa']
      };

      tests.good.forEach(good, "optional");
    });
  });

  return validate;
});
