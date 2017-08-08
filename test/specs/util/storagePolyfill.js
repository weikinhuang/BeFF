define([
  'util/cookie',
  'util/storagePolyfill'
], function(cookie, storagePolyfill) {
  'use strict';

  describe('util/storagePolyfill', function() {
    var originalLocalStorage = Object.getOwnPropertyDescriptor(window, 'localStorage');
    var originalSessionStorage = Object.getOwnPropertyDescriptor(window, 'sessionStorage');

    beforeEach(function() {
      spyOn(storagePolyfill, '_attemptStoragePatch').and.callThrough();
      spyOn(storagePolyfill, '_hasStorageAPI');
    });

    afterEach(function() {
      // must use define property otherwise chrome throws
      // TypeError: Cannot assign to read only property 'localStorage' of object '#<Window>'
      Object.defineProperty(window, 'localStorage', originalLocalStorage);
      Object.defineProperty(window, 'sessionStorage', originalSessionStorage);
    });

    describe('#run', function() {
      it('does not patch storage if storage APIs exist', function() {
        storagePolyfill._hasStorageAPI.and.returnValue(true);

        storagePolyfill.run();

        expect(storagePolyfill._attemptStoragePatch).not.toHaveBeenCalled();
        expect(window.localStorage instanceof storagePolyfill.storage).toBeFalsy();
        expect(window.sessionStorage instanceof storagePolyfill.storage).toBeFalsy();
      });

      it('adds the polyfill if storage APIs do not exist', function() {
        storagePolyfill._hasStorageAPI.and.returnValue(false);

        storagePolyfill.run();

        expect(storagePolyfill._attemptStoragePatch).toHaveBeenCalled();
        expect(window.localStorage instanceof storagePolyfill.storage).toBeTruthy();
        expect(window.sessionStorage instanceof storagePolyfill.storage).toBeTruthy();
      });
    });

    describe('Storage', function() {
      beforeEach(function() {
        spyOn(storagePolyfill.storage.prototype, '_getCookies').and.returnValue('');
      });

      describe('local', function() {
        beforeEach(function() {
          this.storage = new storagePolyfill.storage('local');
        });

        afterEach(function() {
          this.storage.clear();
          this.storage = null;
        });

        describe('#constructor', function() {
          beforeEach(function() {
            this.storage.clear();
            this.storage = null;

            storagePolyfill.storage.prototype._getCookies.and.returnValue([
              'localStoragekey1=' + encodeURIComponent(JSON.stringify({ key: 'key1', value: 'bar' })),
              'localStoragekey2=' + encodeURIComponent(JSON.stringify({ key: 'key2', value: 'baz' })),
              'somerandomcookie=foorandomcookie',
            ].join('; '));

            this.storage = new storagePolyfill.storage('local');
          });

          it('gets existing data from the store', function() {
            expect(this.storage.getItem('key1')).toEqual('bar');
            expect(this.storage.getItem('key2')).toEqual('baz');
          });

          it('sets the initial length based on initial data', function() {
            expect(this.storage.length).toEqual(2);
          });
        });

        describe('#getItem', function() {
          it('returns null if the key has not been set', function() {
            expect(this.storage.getItem('foo')).toEqual(null);
          });

          it('returns the set value if the key has been set', function() {
            this.storage.setItem('foo', 'bar');
            expect(this.storage.getItem('foo')).toEqual('bar');
          });
        });

        describe('#setItem', function() {
          it('sets the item in the local store data', function() {
            expect(this.storage.getItem('foo')).not.toEqual('bar');
            this.storage.setItem('foo', 'bar');
            expect(this.storage.getItem('foo')).toEqual('bar');
          });

          it('sets the value in the session store cookie', function() {
            expect(cookie.get('localStoragefoo')).toEqual(null);
            this.storage.setItem('foo', 'bar');
            expect(cookie.get('localStoragefoo')).toEqual('{"key":"foo","value":"bar"}');
          });

          it('increments the length if the key does not already exist', function() {
            expect(this.storage.length).toEqual(0);
            this.storage.setItem('foo', 'bar');
            expect(this.storage.length).toEqual(1);
          });

          it('does not increment the length if the key already exists', function() {
            expect(this.storage.length).toEqual(0);
            this.storage.setItem('foo', 'bar');
            expect(this.storage.length).toEqual(1);
            this.storage.setItem('foo', 'baz');
            expect(this.storage.length).toEqual(1);
          });
        });

        describe('#removeItem', function() {
          beforeEach(function() {
            this.storage.setItem('foo', 'bar');
          });

          it('does not throw if the key does not exist', function() {
            var storage = this.storage;
            expect(function() {
              storage.removeItem('randomItem');
            }).not.toThrow();
          });

          it('does not change the value in other session store cookies if the key does not exist', function() {
            expect(cookie.get('localStoragefoo')).toEqual('{"key":"foo","value":"bar"}');
            this.storage.removeItem('randomItem');
            expect(cookie.get('localStoragefoo')).toEqual('{"key":"foo","value":"bar"}');
          });

          it('removes the item in the session store data', function() {
            expect(this.storage.getItem('foo')).toEqual('bar');
            this.storage.removeItem('foo');
            expect(this.storage.getItem('foo')).toEqual(null);
          });

          it('removes the the session store cookie for that key', function() {
            expect(cookie.get('localStoragefoo')).toEqual('{"key":"foo","value":"bar"}');
            this.storage.removeItem('foo');
            expect(cookie.get('localStoragefoo')).toEqual(null);
          });

          it('decrements the length if the key exists', function() {
            expect(this.storage.length).toEqual(1);
            this.storage.removeItem('foo');
            expect(this.storage.length).toEqual(0);
          });

          it('does not increment the length if the key does not exist or has already been removed', function() {
            expect(this.storage.length).toEqual(1);
            this.storage.removeItem('randomItem');
            expect(this.storage.length).toEqual(1);
            this.storage.removeItem('foo');
            expect(this.storage.length).toEqual(0);
          });
        });

        describe('#key', function() {
          beforeEach(function() {
            this.storage.setItem('foo', 'bar');
          });

          it('returns null if the index is larger than the size of data', function() {
            expect(this.storage.key(3)).toEqual(null);
          });

          it('returns null if the index is negative', function() {
            expect(this.storage.key(-2)).toEqual(null);
          });

          it('returns the set value if the key has been set', function() {
            expect(this.storage.key(0)).toEqual('foo');
          });
        });

        describe('#clear', function() {
          beforeEach(function() {
            this.storage.setItem('foo', 'bar');
            this.storage.setItem('bar', 'baz');
          });

          it('resets the length of data to 0', function() {
            expect(this.storage.length).toEqual(2);
            this.storage.clear();
            expect(this.storage.length).toEqual(0);
          });

          it('removes all items in the session store data', function() {
            expect(this.storage.getItem('foo')).toEqual('bar');
            expect(this.storage.getItem('bar')).toEqual('baz');
            this.storage.clear();
            expect(this.storage.getItem('foo')).toEqual(null);
            expect(this.storage.getItem('bar')).toEqual(null);
          });

          it('removes all items in the session store cookie', function() {
            expect(cookie.get('localStoragefoo')).toEqual('{"key":"foo","value":"bar"}');
            expect(cookie.get('localStoragebar')).toEqual('{"key":"bar","value":"baz"}');
            this.storage.clear();
            expect(cookie.get('localStoragefoo')).toEqual(null);
            expect(cookie.get('localStoragebar')).toEqual(null);
          });
        });
      });

      describe('session', function() {
        var originalWindowName = window.name;

        beforeEach(function() {
          window.name = 'ABC';
          this.storage = new storagePolyfill.storage('session');
        });

        afterEach(function() {
          this.storage.clear();
          this.storage = null;

          window.name = originalWindowName;
        });

        describe('#constructor', function() {
          beforeEach(function() {
            this.storage.clear();
            this.storage = null;

            storagePolyfill.storage.prototype._getCookies.and.returnValue([
              'sessionStorageABCkey1=' + encodeURIComponent(JSON.stringify({ key: 'key1', value: 'bar' })),
              'sessionStorageABCkey2=' + encodeURIComponent(JSON.stringify({ key: 'key2', value: 'baz' })),
              'somerandomcookie=foorandomcookie',
            ].join('; '));

            this.storage = new storagePolyfill.storage('session');
          });

          it('gets existing data from the store', function() {
            expect(this.storage.getItem('key1')).toEqual('bar');
            expect(this.storage.getItem('key2')).toEqual('baz');
          });

          it('sets the initial length based on initial data', function() {
            expect(this.storage.length).toEqual(2);
          });
        });

        describe('#getItem', function() {
          it('returns null if the key has not been set', function() {
            expect(this.storage.getItem('foo')).toEqual(null);
          });

          it('returns the set value if the key has been set', function() {
            this.storage.setItem('foo', 'bar');
            expect(this.storage.getItem('foo')).toEqual('bar');
          });
        });

        describe('#setItem', function() {
          it('sets the item in the session store data', function() {
            expect(this.storage.getItem('foo')).not.toEqual('bar');
            this.storage.setItem('foo', 'bar');
            expect(this.storage.getItem('foo')).toEqual('bar');
          });

          it('sets the value in the session store cookie', function() {
            expect(cookie.get('sessionStorageABCfoo')).toEqual(null);
            this.storage.setItem('foo', 'bar');
            expect(cookie.get('sessionStorageABCfoo')).toEqual('{"key":"foo","value":"bar"}');
          });

          it('increments the length if the key does not already exist', function() {
            expect(this.storage.length).toEqual(0);
            this.storage.setItem('foo', 'bar');
            expect(this.storage.length).toEqual(1);
          });

          it('does not increment the length if the key already exists', function() {
            expect(this.storage.length).toEqual(0);
            this.storage.setItem('foo', 'bar');
            expect(this.storage.length).toEqual(1);
            this.storage.setItem('foo', 'baz');
            expect(this.storage.length).toEqual(1);
          });
        });

        describe('#removeItem', function() {
          beforeEach(function() {
            this.storage.setItem('foo', 'bar');
          });

          it('does not throw if the key does not exist', function() {
            var storage = this.storage;
            expect(function() {
              storage.removeItem('randomItem');
            }).not.toThrow();
          });

          it('does not change the value in other session store cookies if the key does not exist', function() {
            expect(cookie.get('sessionStorageABCfoo')).toEqual('{"key":"foo","value":"bar"}');
            this.storage.removeItem('randomItem');
            expect(cookie.get('sessionStorageABCfoo')).toEqual('{"key":"foo","value":"bar"}');
          });

          it('removes the item in the session store data', function() {
            expect(this.storage.getItem('foo')).toEqual('bar');
            this.storage.removeItem('foo');
            expect(this.storage.getItem('foo')).toEqual(null);
          });

          it('removes the the session store cookie for that key', function() {
            expect(cookie.get('sessionStorageABCfoo')).toEqual('{"key":"foo","value":"bar"}');
            this.storage.removeItem('foo');
            expect(cookie.get('sessionStorageABCfoo')).toEqual(null);
          });

          it('decrements the length if the key exists', function() {
            expect(this.storage.length).toEqual(1);
            this.storage.removeItem('foo');
            expect(this.storage.length).toEqual(0);
          });

          it('does not decrement the length if the key does not exist or has already been removed', function() {
            expect(this.storage.length).toEqual(1);
            this.storage.removeItem('randomItem');
            expect(this.storage.length).toEqual(1);
            this.storage.removeItem('foo');
            expect(this.storage.length).toEqual(0);
          });
        });

        describe('#key', function() {
          beforeEach(function() {
            this.storage.setItem('foo', 'bar');
          });

          it('returns null if the index is larger than the size of data', function() {
            expect(this.storage.key(3)).toEqual(null);
          });

          it('returns null if the index is negative', function() {
            expect(this.storage.key(-2)).toEqual(null);
          });

          it('returns the set value if the key has been set', function() {
            expect(this.storage.key(0)).toEqual('foo');
          });
        });

        describe('#clear', function() {
          beforeEach(function() {
            this.storage.setItem('foo', 'bar');
            this.storage.setItem('bar', 'baz');
          });

          it('resets the length of data to 0', function() {
            expect(this.storage.length).toEqual(2);
            this.storage.clear();
            expect(this.storage.length).toEqual(0);
          });

          it('removes all items in the session store data', function() {
            expect(this.storage.getItem('foo')).toEqual('bar');
            expect(this.storage.getItem('bar')).toEqual('baz');
            this.storage.clear();
            expect(this.storage.getItem('foo')).toEqual(null);
            expect(this.storage.getItem('bar')).toEqual(null);
          });

          it('removes all items in the session store cookie', function() {
            expect(cookie.get('sessionStorageABCfoo')).toEqual('{"key":"foo","value":"bar"}');
            expect(cookie.get('sessionStorageABCbar')).toEqual('{"key":"bar","value":"baz"}');
            this.storage.clear();
            expect(cookie.get('sessionStorageABCfoo')).toEqual(null);
            expect(cookie.get('sessionStorageABCbar')).toEqual(null);
          });
        });
      });
    });
  });
});
