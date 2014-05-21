define([
  'nbd/Promise',
  'nbd/util/pipe',
  '../Component',
  './util/xhr'
], function(Promise, pipe, Component, xhr) {
  'use strict';

  /**
   * Takes a serialized Array (such as from $.serializeArray) and
   * transforms it into a JSON structure apporpriate for sending
   * as data over and ajax request.
   *
   * @param {Array} inputs - List objects with the form { name: 'foo', value: 'bar' }
   *
   * @return {Object} obj - Map of input names to input values
   */
  function decompose(inputs) {
    return inputs.reduce(function(obj, entry) {
      var val = obj[entry.name];

      obj[entry.name] = val ?
        // Format selects into { name: [value1, value2,...] }
        [].concat(val, entry.value) :
        entry.value;

      return obj;
    }, {});
  }

  var normalizeSubmitter = function(e) {
    switch (e.which) {
      // Left mouse
      case 1:
      // Enter
      case 13:
      // Spacebar
      case 32:
        this.$form.submit();
        break;
      default:
        break;
    }
  },

  innerChain = function(metadata) {
    var chain = new Promise(),
    then = chain.thenable(),
    retval = typeof this.commit === 'function' ?
      this.commit.call(then, metadata) :
      this.commmit;

    chain.resolve(retval === then ? xhr(metadata) : retval);

    return chain;
  },

  Form = Component.extend({
    init: function($context) {
      this.$form = $context.is('form') ? $context : $context.find('form');

      // Internal bindings so that we can unbind later
      this._normalizeSubmitter = normalizeSubmitter.bind(this);
      this.submit = this.submit.bind(this);
    },

    destroy: function() {
      this._super();
      this.$form = null;
    },

    /**
     * Inner Submission process. Should be limited to the forms specific behaviors that are
     * dependent on pre- and post- submission of the form. For the majority of simple forms,
     * this should be all that needs to be overridden.
     *
     * Default implementation simply submits the form data to the form's defined endpoint.
     */
    commit: function(metadata) {
      return this;
    },

    /**
     * Default validator does nothing
     */
    validator: function(data) { return true; },

    submit: function(e) {
      var meta = {
            url: this.$form.attr('action'),
            type: this.$form.attr('method') || 'POST',
            data: this.constructor.decompose(this.$form.serializeArray())
          },
          validator = Array.isArray(this.validator) ?
            pipe.apply(null, this.validator) :
            this.validator,
          resolver = new Promise(),
          chain, valid, error;

      this.trigger('before');

      try {
        valid = validator(meta.data);
      }
      catch (validationError) {
        valid = false;
        error = validationError;
      }

      if (e && (valid === false || typeof this.commit === 'function')) {
        e.preventDefault();
      }

      if (valid === false) {
        resolver.reject(error);
      }
      else {
        resolver.resolve(meta);
      }
      chain = resolver.then(innerChain.bind(this));
      chain.then(this.trigger.bind(this, 'success'), this.trigger.bind(this, 'error'));

      return chain;
    },

    _submitSelector: '.js-submit:not([type=submit])',

    bind: function() {
      this.$form
      .on('click keydown', this._submitSelector, this._normalizeSubmitter)
      .on('submit', this.submit);
      return this;
    },

    unbind: function() {
      this.$form
      .off('click keydown', this._submitSelector, this._normalizeSubmitter)
      .off('submit', this.submit);
      return this;
    }
  }, {
    decompose: decompose
  });

  return Form;
});
