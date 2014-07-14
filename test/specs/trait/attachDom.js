define([
  'trait/attachDom',
  'nbd/Model'
], function(attachDom, Model) {
  'use strict';

  describe('trait/attachDom', function() {
    var model;

    beforeEach(function() {
      model = Model.extend().mixin(attachDom)();
      spyOn(model, 'get').and.callThrough();
      spyOn(model, 'set').and.callThrough();
    });

    afterEach(function() {
      model.destroy();
    });

    describe('attachCheckbox', function() {
      var $context;

      beforeEach(function() {
        $context = affix('div input[type="checkbox"][value="bar"] input[type="checkbox"][value="baz"]');
      });

      it('sets model with piped dom values', function(done) {
        model.attachCheckbox('foo', $context);
        $context.find('input:first').click();

        setTimeout(function() {
          expect(model.set).toHaveBeenCalledWith('foo', 'bar');
          $context.find('input:last').click();

          setTimeout(function() {
            expect(model.set).toHaveBeenCalledWith('foo', 'bar|baz');
            done();
          }, 100);
        }, 100);
      });

      it('changes based on model', function(done) {
        model.attachCheckbox('foo', $context);
        model.trigger('foo', 'baz');
        setTimeout(function() {
          expect($context.find('input:first')[0].checked).toBe(false);
          expect($context.find('input:last')[0].checked).toBe(true);
          done();
        }, 100);
      });
    });

    describe('attachRadio', function() {
      var $context;

      beforeEach(function() {
        $context = affix('div input[type="radio"][name="foo"][value="bar"] input[type="radio"][name="foo"][value="baz"]');
      });

      it('sets model to dom values', function(done) {
        model.attachRadio('foo', $context);
        $context.find('input:first').click();

        setTimeout(function() {
          expect(model.set).toHaveBeenCalledWith('foo', 'bar');
          $context.find('input:last').click();

          setTimeout(function() {
            expect(model.set).toHaveBeenCalledWith('foo', 'baz');
            done();
          }, 100);
        }, 100);
      });

      it('changes based on model', function(done) {
        model.attachRadio('foo', $context);
        model.trigger('foo', 'baz');

        setTimeout(function() {
          expect($context.find('input:first')[0].checked).toBe(false);
          expect($context.find('input:last')[0].checked).toBe(true);
          done();
        }, 100);
      });
    });

    describe('attachSelect', function() {
      var $context;

      beforeEach(function() {
        $context = affix('select option[value="bar"]');
        $context.affix('option[value="baz"]');
      });

      it('sets model with dom values', function(done) {
        model.attachSelect('foo', $context);
        $context.find('option:first').prop('selected', true).change();

        setTimeout(function() {
          expect(model.set).toHaveBeenCalledWith('foo', 'bar');
          $context.find('option:last').prop('selected', true).change();

          setTimeout(function() {
            expect(model.set).toHaveBeenCalledWith('foo', 'baz');
            done();
          }, 100);
        }, 100);
      });

      it('changes based on model', function(done) {
        model.attachSelect('foo', $context);
        model.trigger('foo', 'baz');

        setTimeout(function() {
          expect($context.val()).toBe('baz');
          done();
        }, 100);
      });
    });

    describe('attachText', function() {
      var $context;

      beforeEach(function() {
        $context = affix('input[type="text"]');
      });

      it('sets model with dom values', function(done) {
        model.attachText('foo', $context);
        $context.val('bar').change();

        setTimeout(function() {
          expect(model.set).toHaveBeenCalledWith('foo', 'bar');
          done();
        }, 100);
      });

      it('changes based on model', function(done) {
        model.attachText('foo', $context);
        model.set('foo', 'baz');

        setTimeout(function() {
          expect($context.val()).toBe('baz');
          done();
        }, 100);
      });
    });
  });
});
