define([
  'trait/attachDom',
  'nbd/Model'
], function(attachDom, Model) {
  'use strict';

  function attachDomModel() {
    return Model.extend().mixin(attachDom)();
  }

  describe('trait/attachDom', function() {
    describe('attachCheckbox', function() {
      var $context;

      beforeEach(function() {
        $context = affix('div');
        $context.affix('input[type="checkbox"][value="bar"]');
        $context.affix('input[type="checkbox"][value="baz"]');
      });

      it('sets model with piped dom values', function(done) {
        var model = attachDomModel();

        model.attachCheckbox('foo', $context);
        $context.find('input:first').click();

        // NOTE(sean): This must use setTimeout until a bug in nbd's pubsub implementation is fixed.
        // Failing test added in: https://github.com/behance/nbd.js/pull/96
        setTimeout(function() {
          expect(model.get('foo')).toBe('bar');
          $context.find('input:last').click();

          setTimeout(function() {
            expect(model.get('foo')).toBe('bar|baz');
            done();
          }, 100);
        }, 100);
      });

      it('changes based on model', function(done) {
        var model = attachDomModel();

        model.attachCheckbox('foo', $context);
        model.one('foo', function() {
          expect($context.find('input:first')[0].checked).toBe(false);
          expect($context.find('input:last')[0].checked).toBe(true);
          done();
        });

        model.set('foo', 'baz');
      });
    });

    describe('attachRadio', function() {
      var $context;

      beforeEach(function() {
        $context = affix('div');
        $context.affix('input[type="radio"][name="foo"][value="bar"]');
        $context.affix('input[type="radio"][name="foo"][value="baz"]');
      });

      it('sets model to dom values', function(done) {
        var model = attachDomModel();

        model.attachRadio('foo', $context);
        $context.find('input:first').click();

        setTimeout(function() {
          expect(model.get('foo')).toBe('bar');
          $context.find('input:last').click();

          setTimeout(function() {
            expect(model.get('foo')).toBe('baz');
            done();
          }, 100);
        }, 100);
      });

      it('changes based on model', function(done) {
        var model = attachDomModel();

        model.attachRadio('foo', $context);
        model.one('foo', function() {
          expect($context.find('input:first')[0].checked).toBe(false);
          expect($context.find('input:last')[0].checked).toBe(true);
          done();
        });

        model.set('foo', 'baz');
      });
    });

    describe('attachSelect', function() {
      var $context;

      beforeEach(function() {
        $context = affix('select option[value="bar"]');
        $context.affix('option[value="baz"]');
      });

      it('sets model with dom values', function(done) {
        var model = attachDomModel();

        model.attachSelect('foo', $context);
        $context.find('option:first').prop('selected', true).change();

        setTimeout(function() {
          expect(model.get('foo')).toBe('bar');
          $context.find('option:last').prop('selected', true).change();

          setTimeout(function() {
            expect(model.get('foo')).toBe('baz');
            done();
          }, 100);
        }, 100);
      });

      it('changes based on model', function(done) {
        var model = attachDomModel();

        model.attachSelect('foo', $context);
        model.one('foo', function() {
          expect($context.val()).toBe('baz');
          done();
        });

        model.set('foo', 'baz');
      });
    });

    describe('attachTextArea', function() {
      var $context;

      beforeEach(function() {
        $context = affix('textarea');
      });

      it('sets model with dom values', function(done) {
        var model = attachDomModel();

        model.attachTextArea('foo', $context);
        $context.val('bar').change();

        setTimeout(function() {
          expect(model.get('foo')).toBe('bar');
          $context.val('baz').change();

          setTimeout(function() {
            expect(model.get('foo')).toBe('baz');
            done();
          }, 100);
        }, 100);
      });

      it('changes based on model', function(done) {
        var model = attachDomModel();

        model.attachTextArea('foo', $context);
        model.one('foo', function() {
          expect($context.val()).toBe('baz');
          done();
        });

        model.set('foo', 'baz');
      });
    });

    describe('attachText', function() {
      var $context;

      beforeEach(function() {
        $context = affix('input[type="text"]');
      });

      it('sets model with dom values', function(done) {
        var model = attachDomModel();

        model.attachText('foo', $context);
        model.one('foo', function() {
          expect(model.get('foo')).toBe('bar');
          done();
        });

        $context.val('bar').change();
      });

      it('strips input value before setting', function(done) {
        var model = attachDomModel();

        model.attachText('foo', $context);
        model.one('foo', function() {
          expect(model.get('foo')).toBe('bar');
          done();
        });

        $context.val('  bar').change();
      });

      it('changes based on model', function(done) {
        var model = attachDomModel();

        model.attachText('foo', $context);
        model.one('foo', function() {
          expect($context.val()).toBe('baz');
          done();
        });

        model.set('foo', 'baz');
      });
    });
  });
});
