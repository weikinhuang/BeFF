define(['./cookie'], function(cookie) {
  'use strict';

  // Adapted from https://gist.github.com/jarrodirwin/0ce4c0888336b533b2c4
  // Refer to https://gist.github.com/remy/350433
  var Storage = (function() {
    function _getSessionName() {
    // If there is no name for this window, set one.
    // To ensure it's unique use the current timestamp.
      if (!window.name) {
        window.name = new Date().getTime();
      }

      return 'sessionStorage' + window.name;
    };

    function _setData() {
      var self = this;

      Object.keys(this._data).forEach(function(key) {
        var value = JSON.stringify({
          key: key,
          value: self._data[key],
        });

        cookie.set(self._cookiePrefix + key, value, { expires: 30, path: '/' });
      });
    };

    function _clearData(key) {
      cookie.set(this._cookiePrefix + key, null, { path: '/' });
    };

    function _getData() {
      var cookieRegex = new RegExp(this._cookiePrefix);

      return this._getCookies().split('; ')
        .reduce(function(cookieObj, cookieValue) {
          if (cookieRegex.test(cookieValue)) {
            var decodedCookieValue = decodeURIComponent(cookieValue.split('=')[1]);

            try {
              var property = JSON.parse(decodedCookieValue);
              cookieObj[property.key] = property.value;
            }
            catch (e) { /* empty catch incase a stray match shows up */ }
          }

          return cookieObj;
        }, {});
    };

    function Storage(type) {
      this._type = type;

      this._cookiePrefix = type === 'session' ? _getSessionName() : 'localStorage';

      this._data = _getData.call(this);
      this.length = Object.keys(this._data).length;
    }

    Storage.prototype.getItem = function(key) {
      return this._data[key] === undefined ? null : this._data[key];
    };

    Storage.prototype.setItem = function(key, value) {
      if (!this._data[key]) {
        this.length++;
      }

      this._data[key] = String(value);
      _setData.call(this);
    };

    Storage.prototype.removeItem = function(key) {
      if (!this._data[key]) {
        return;
      }

      delete this._data[key];

      this.length--;
      _clearData.call(this, key);
    };

    Storage.prototype.key = function(i) {
      if (i >= this.length || i < 0) {
        return null;
      }

      var ctr = 0;

      for (var k in this._data) {
        if (ctr === i) {
          return k;
        }
        else {
          ctr++;
        }
      }

      return null;
    };

    Storage.prototype.clear = function() {
      var self = this;

      Object.keys(this._data).forEach(function(key) {
        _clearData.call(self, key);
      });

      this._data = {};
      this.length = 0;
    };

    Storage.prototype._getCookies = function() {
      return document.cookie;
    };

    return Storage;
  })();

  return {
    storage: Storage,
    run: function() {
      try {
        if (!this._hasStorageAPI()) {
          throw 'exception';
        };

        // Test webstorage accessibility to see if it throws or isn't implemented
        window.localStorage.setItem('storage_test', '1');

        if (window.localStorage.getItem('storage_test') !== '1') {
          throw 'exception';
        }

        window.localStorage.removeItem('storage_test');
      }
      catch (e) {
        this._attemptStoragePatch();
      }
    },

    _hasStorageAPI: function() {
      return window.localStorage && window.sessionStorage;
    },

    _attemptStoragePatch: function() {
      // In Chrome with "All site data blocked" trying to read from local or session storage
      // will throw an error
      try {
        var fakeLocalStorage = new this.storage('local');
        var fakeSessionStorage = new this.storage('session');

        if (!window.localStorage) {
          window.localStorage = fakeLocalStorage;
        }

        if (!window.sessionStorage) {
          window.sessionStorage = fakeSessionStorage;
        }

        Object.setPrototypeOf(window.localStorage, fakeLocalStorage);
        Object.setPrototypeOf(window.sessionStorage, fakeSessionStorage);
      }
      catch (e) {}
    },
  };
});
