define(function() {
  'use strict';

  var check,
  test = RegExp.prototype.test,
  tests = {

    Generic:{
      test: test.bind(/^[^<>]+$/),
      message: "This field may not contain less than signs (&lt) or greater than signs (&gt;)"
    },
    AlphaNumeric:{
      test: test.bind(/^[0-9A-Za-z\u00C0-\u00FF\u0100-\u0259\u0386\u0388-\u04E9\u05D0-\u06D3\u1E80-\u200F]+$/),
      message: "This field must contain only alphanumeric characters"
    },
    Alpha:{
      test: test.bind(/^[A-Za-z\u00C0-\u00FF\u0100-\u0259\u0386\u0388-\u04E9\u05D0-\u06D3\u1E80-\u200F]+$/),
      message: "This field must contain only alpha characters"
    },
    AlphaDash:{
      test: test.bind(/^[A-Za-z\u00C0-\u00FF\u0100-\u0259\u0386\u0388-\u04E9\u05D0-\u06D3\u1E80-\u200F\-]+$/),
      message: "This field must contain only alpha characters or dashes"
    },
    ANDash:{
      test: test.bind(/^[0-9A-Za-z\u00C0-\u00FF\u0100-\u0259\u0386\u0388-\u04E9\u05D0-\u06D3\u1E80-\u200F\-]+$/),
      message: "This field must contain only alphanumeric characters or dashes"
    },
    ANUnder:{
      test: test.bind(/^[0-9A-Za-z\u00C0-\u00FF\u0100-\u0259\u0386\u0388-\u04E9\u05D0-\u06D3\u1E80-\u200F_]+$/),
      message: "This field must contain only alphanumeric characters with or without underscores"
    },
    ANUSpace:{
      test: test.bind(/^[0-9A-Za-z\u00C0-\u00FF\u0100-\u0259\u0386\u0388-\u04E9\u05D0-\u06D3\u1E80-\u200F_ ]+$/),
      message: "This field must contain only alphanumeric characters with or without underscores and spaces"
    },
    ANEmail:{
      test: test.bind(/^([_\dA-Za-z\u00C0-\u00FF\u0100-\u0259\u0386\u0388-\u04E9\u05D0-\u06D3\u1E80-\u200F\-]+|[\w\.\+\-]+@(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9]))$/),
      message: "This field must contain a valid username or email"
    },
    Integer:{
      test: test.bind(/^\-?\d+$/),
      message: "This field must only contain numbers, without any spaces"
    },
    CreditCardNumber:{
      test: test.bind(/^\d{13,16}$/),
      message: "This field must only contain numbers, without any spaces or dashes"
    },
    Decimal:{
      test: test.bind(/^\-?\d+(\.\d+)?$/),
      message: "This field must be a valid decimal number"
    },
    Date:{
      test: test.bind(/^\d{1,2}\-\d{1,2}-\d{4}( \d{2}:\d{2}:\d{2})?$/),
      message: "This field must be a valid date"
    },
    SqlDate:{
      test: test.bind(/^\d{4}\-\d{2}\-\d{2}$/),
      message: "This field must be a valid date"
    },
    SqlDateTime:{
      test: test.bind(/^\d{4}\-\d{2}\-\d{2}\s\d{2}\:\d{2}\:\d{2}$/),
      message: "This field must be a valid datetime"
    },
    SlashDate:{
      test: test.bind(/^\d{1,2}\/\d{1,2}\/\d{4}$/),
      message: "This field must be a valid date"
    },
    Email:{
      test: test.bind(/^[\w\.\+\-]+@[a-zA-Z0-9](?:[a-zA-Z0-9\-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9\-]*[a-zA-Z0-9])?)*\.?$/),
      message: "This field must be a valid email address"
    },
    Name:{
      test: test.bind(/^[\wA-Za-z\u00C0-\u00FF\u0100-\u0259\u0386\u0388-\u04E9\u05D0-\u06D3\u1E80-\u200F\'. \-]{2,50}$/),
      message: "This field must be a valid name"
    },
    Username:{
      test: test.bind(/^[A-Za-z0-9_\-]+$/),
      message: "This field contains invalid characters. Please use only letters (a-z, A-Z), numbers, dash or underscore characters."
    },
    Password:{
      test: test.bind(/^\S{6,32}$/),
      message: "This field must be between 6 and 32 characters"
    },
    Address:{
      test: test.bind(/^[\w0-9A-Za-z\u00C0-\u00FF\u0100-\u0259\u0386\u0388-\u04E9\u05D0-\u06D3\u1E80-\u200F# \' \.\,\&\-]+$/),
      message: "This field must be a valid address"
    },
    City:{
      test: test.bind(/^[\wA-Za-z\u00C0-\u00FF\u0100-\u0259\u0386\u0388-\u04E9\u05D0-\u06D3\u1E80-\u200F \' \. \/ \-]+$/),
      message: "This field must be a valid city"
    },
    Province:{
      test: test.bind(/^[\wA-Za-z\u00C0-\u00FF\u0100-\u0259\u0386\u0388-\u04E9\u05D0-\u06D3\u1E80-\u200F ]+$/),
      message: "This field must be a valid province"
    },
    IntZip:{
      test: test.bind(/^[A-Za-z0-9#\. \-]+$/),
      message: "This field must be a valid zipcode"
    },
    UsZip:{
      test: test.bind(/^\d{5}(\-\d{4})?$/),
      message: "This field must be a valid US zipcode"
    },
    Country:{
      test: test.bind(/^[\wA-Za-z\u00C0-\u00FF\u0100-\u0259\u0386\u0388-\u04E9\u05D0-\u06D3\u1E80-\u200F\'. \-]{2,50}$/),
      message: "This field must be a valid country"
    },
    IntPhone:{
      test: test.bind(/^[0-9\+ \(\)\#\-]+$/),
      message: "This field must be a valid phone"
    },
    UsPhone:{
      test: test.bind(/^\d{3}\-\d{3}\-\d{4}$/),
      message: "This field must be a valid US phone"
    },
    PicExt:{
      test: test.bind(/^((jpg)|(jpeg)|(png)|(gif)){1}$/),
      message: "This field must be a valid image extension"
    },
    VideoExt:{
      test: test.bind(/^((mpg)|(mpeg)|(mov)|(avi)|(dv)|(qt)|(asf)|(flv)){1}$/),
      message: "This field must be a valid video extension"
    },
    Url:{
      test: test.bind(/^(http(?:s)?:\/\/|www.)[^<>]*$/),
      message: "This field must be a URL starting with http:// or www."
    },
    UrlExt:{
      test: test.bind(/^((?:https?):\/\/)?(?:(?:(?:[\w\.\-\+!$&\'\(\)*\+,;=_]|%[0-9a-f]{2})+:)*(?:[\w\.\-\+%!$&\'\(\)*\+,;=]|%[0-9a-f]{2})+@)?(?:[A-Za-z0-9_\-]+\.)(?:[A-Za-z0-9\-\._])+(?::\d+)?(?:[\/|\?](?:[\w#!:\.\?\+=&@$\'~*,;_\/\(\)\[\]\-]|%[0-9a-f]{2})*)?$/),
      message: "This field must be a valid URL"
    },
    Html:{
      test: function() {
        return !test.apply(/<((?!\/?span|\/?h1|\/?h2|\/?h3|\/?h4|\/?h5|\/?h6|\/?a|\/?b|\/?ol|\/?ul|\/?li|\/?i|\/?u|\/?strong|\/?em(?!bed)|\/?p|\/?div|\/?br|\/?unb|\/?uni|\/?\s|\/?\>)[^\>]*\>)/i, arguments);
      },
      message: "This field must be properly formed HTML"
    },
    Twitter:{
      test: test.bind(/^[A-Za-z0-9_\-]{1,15}$/),
      message: "This field must be a valid twitter username (without the @ character)"
    },

    required:{
      test: test.bind(/.+/),
      message: "This field is required"
    },

    requireTrimmed:{
      test: function(corpus) {
        return corpus.trim() !== '';
      },
      message: "This field must not be blank"
    },

    length:{
      test: function(corpus, meta) {
        var limits = /\[(,?\d+(?:,\d+)?)\]/.exec(meta);
        corpus = String(corpus).replace(/[\s]+/g, ' ');

        if (!limits) { return false; }
        return (new RegExp('^.{' + limits[1] + '}$')).test(corpus);
      },
      message: function(corpus, meta) {
        var limits;

        limits = /\[(\d+),(\d+)\]/.exec(meta);
        if (limits) {
          return "Must be between " + limits[1] + " and " + limits[2] + " characters.";
        }

        limits = /\[,(\d+)\]/.exec(meta);
        if (limits) {
          return "Must be at most " + limits[1] + " characters.";
        }

        limits = /\[(\d+),\]/.exec(meta);
        if (limits) {
          return "Must be at least " + limits[1] + " characters.";
        }

        limits = /\[(\d+)\]/.exec(meta);
        if (limits) {
          return "Must be exactly " + limits[1] + " characters.";
        }
      }
    }
  },

  // For extracting metada e.g. length[x,y]
  metaRule = /(\w+)(.*)/;

  function commaSplit(str) {
    var i, buffer,
    ignore = false,
    start = 0,
    result = [];

    for (i = 0; i < str.length; ++i) {
      if (str[i] === '[') {
        ignore = true;
        continue;
      }
      if (str[i] === ']') {
        ignore = false;
        continue;
      }
      if (str[i] === ',' && !ignore) {
        buffer = str.substring(start, i);
        if (buffer) {
          result.push(buffer);
        }
        start = i + 1;
      }
    }

    buffer = str.substring(start);
    if (buffer) {
      result.push(buffer);
    }

    return result;
  }

  function validate(body, rules) {
    delete validate.message;
    rules = rules ? commaSplit(rules) : [];

    // /.+/.test(null) passes as true for required check
    if (body == null) {
      body = '';
    }

    // When optional field with no value
    if (rules.indexOf('required') === -1 && body === '') {
      return true;
    }

    return rules.every(check, body);
  }

  // Per rule check
  check = function(rule) {
    var res = metaRule.exec(rule),
    meta;

    if (res) {
      rule = res[1];
      meta = res[2];
    }

    // Skip over invalid rule
    if (!(tests[rule] && tests[rule].test)) {
      return true;
    }

    res = tests[rule].test(this, meta);

    if (!res) {
      validate.message = typeof tests[rule].message === 'function' ?
        tests[rule].message(this, meta) :
        tests[rule].message;
    }

    return res;
  };

  validate.tests = tests;

  return validate;
});
