define([
  'jquery',
  'Component/Form/validators'
], function($, formValidators) {
  'use strict';

  describe('util/formValidators', function() {
    beforeEach(function() {
      this.$form = $('<form><input name="foo" data-validate="Alpha"><input name="baz" data-validate="Alpha"></form>');
      this._data = {
        foo: 'bar',
        bar: ' ',
        baz: '<>'
      };
    });

    describe('#trimIfEmpty', function() {
      it('trims empty fields', function() {
        expect(formValidators.trimIfEmpty.call(this, this._data)).toEqual({
          foo: 'bar',
          bar: '',
          baz: '<>'
        });
      });
    });

    describe('#validateForm', function() {
      it('throws error when validation fails', function() {
        try {
          formValidators.validateForm.call(this, this._data);
        }
        catch(e) {
          expect(e.foo).not.toBeDefined();
          expect(e.baz).toBeDefined();
        }
      });

      it('returns data when validation passes', function() {
        this._data.baz = 'foo';
        expect(formValidators.validateForm.call(this, this._data)).toEqual({
          foo: 'bar',
          bar: ' ',
          baz: 'foo'
        });
      });
    });
  });
});
