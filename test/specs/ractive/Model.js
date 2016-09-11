define([
  'ractive',
  'ractive/Model'
], function(Ractive, RactiveModel) {
  'use strict';

  describe('lib/RactiveModel', function() {
    var data;
    var ractive;
    var ractiveModel;

    beforeEach(function() {
      data = {
        foo: {
          pages: [{
            url: '/page-one'
          }, {
            url: '/page-two'
          }]
        },
        pages: {
          '/page-one': {
            url: '/page-one',
            title: 'Page One'
          },
          '/page-two': {
            url: '/page-two',
            title: 'Page Two'
          }
        }
      };
      ractive = new Ractive({ data: data });
      ractiveModel = new RactiveModel('foo.pages', ractive);
    });

    afterEach(function() {
      if (ractive) {
        ractive.teardown();
      }
      if (ractiveModel) {
        ractiveModel.destroy();
      }
    });

    describe('#id', function() {
      it('returns the keypath', function() {
        expect(ractiveModel.id()).toBe('foo.pages');
      });

      it('is replaceable', function() {
        ractiveModel.id = jasmine.createSpy('id').and.returnValue('pages./page-two');

        expect(ractiveModel.get('title')).toBe('Page Two');
        ractiveModel.set('title', 'Page 2');

        expect(ractiveModel.id).toHaveBeenCalled();
        expect(ractive.get('pages./page-two.title')).toBe('Page 2');
      });
    });

    describe('#unset', function() {
      it('should remove the item from the ractive model based on the path', function() {
        ractiveModel.unset('!pages./page-one');
        expect(data.pages).toEqual({
          '/page-two': {
            url: '/page-two',
            title: 'Page Two'
          }
        });
      });

      it('should fail not do anything when the path does not match existing data', function() {
        ractiveModel.unset('!pages./nonexistent');
        expect(data.pages).toEqual({
          '/page-one': {
            url: '/page-one',
            title: 'Page One'
          },
          '/page-two': {
            url: '/page-two',
            title: 'Page Two'
          }
        });
      });
    });

    describe('.completePath', function() {
      it('joins portions of the keypath', function() {
        expect(RactiveModel.completePath('foo', 'bar')).toBe('foo.bar');
      });

      it('returns the context if there is no local path', function() {
        expect(RactiveModel.completePath('foo')).toBe('foo');
      });

      it('handles globally escaped local paths', function() {
        expect(RactiveModel.completePath('foo', '!bar')).toBe('bar');
      });
    });

    describe('.matchIdentity', function() {
      beforeEach(function() {
        this._context = {
          foo: 1,
          url: 'http://www.be.net'
        };
      });

      it('returns whether or not the context is relevant to the identity', function() {
        expect(RactiveModel.matchIdentity(this._context, 'bar:2')).toBe(false);
        expect(RactiveModel.matchIdentity(this._context, 'foo:1')).toBe(true);
        expect(RactiveModel.matchIdentity(this._context, 'url:http://www.be.net')).toBe(true);
      });
    });

    describe('.findByIdentity', function() {
      beforeEach(function() {
        this._context = {
          page1: {
            foo: 1,
            url: 'http://www.be.net'
          },
          page2: {
            foo: 2,
            bar: 3
          }
        };
      });

      it('returns the key whose value is relevant to the identity', function() {
        expect(RactiveModel.findByIdentity(this._context, 'bar:2')).toBeUndefined();
        expect(RactiveModel.findByIdentity(this._context, 'foo:1')).toBe('page1');
        expect(RactiveModel.findByIdentity(this._context, 'bar:3')).toBe('page2');
      });
    });
  });
});
