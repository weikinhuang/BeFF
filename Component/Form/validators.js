define([
  'jquery',
  '../../util/validate'
], function($, validate) {
  'use strict';

  return {
    trimIfEmpty: function(data) {
      Object.keys(data).forEach(function(key) {
        var trimmedValue,
            value = data[key];

        if (typeof value === 'string') {
          trimmedValue = value.trim();
          data[key] = trimmedValue.length === 0 ? trimmedValue : value;
        }
      });

      return data;
    },

    validateForm: function(data) {
      var elements = this.$form.find('[data-validate]:not(:disabled)').toArray();

      this.errors = elements.reduce(function(invalid, el) {
        var $el = $(el),
            rule = $el.data('validate'),
            key = $el.attr('name') || $el.attr('id');

        if (!validate(data[key], rule)) {
          invalid[key] = validate.message;
        }

        return invalid;
      }, {});

      if (Object.keys(this.errors).length) {
        throw this.errors;
      }

      return data;
    }
  };
});
