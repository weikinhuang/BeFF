define([
  'nbd/Promise',
  'nbd/util/extend',
  'nbd/util/pipe',
  '../Component',
  '../util/xhr',
  '../util/error'
], function(Promise, extend, pipe, Component, xhr, error) {
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
      this.commit;

    chain.resolve(retval === then ? this.xhr(metadata) : retval);

    return chain;
  },

  Form = Component.extend({
    xhr: xhr,

    init: function($context) {
      if (!$context) {
        throw new Error("The context of the form cannot be empty");
      }
      this.$form = $context.is('form') ? $context : $context.find('form');

      // Temporarily commented out while fixing spots on network that would throw this
      // if (!this.$form.length) {
      //   throw new Error("Unable to find form within context");
      // }

      // Internal bindings so that we can unbind later
      this._normalizeSubmitter = normalizeSubmitter.bind(this);
      this.submit = this.submit.bind(this);

      Object.defineProperty(this, 'handlers', {
        value: [this._handleFormError.bind(this)]
      });
    },

    destroy: function() {
      if (!this.$form) {
        throw new Error("Cannot destroy null form");
      }
      this._super();
      this.$form = null;
    },

    /**
     * Wrapper for resetting form without needing to know the DOM
     */
    reset: function() {
      this.$form[0].reset();

      return this;
    },

    /**
     * Default validator does nothing
     */
    validator: function(data) { return true; },

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
     * Default error catch, which only handles "field" errors. Otherwise, rethrows the error
     *
     * @param  {Object|Form.Error} err the error to handle
     * @throws {Object} if the error is not of type Form.Error
     */
    _handleFormError: function(err) {
      if (!(err instanceof Form.Error)) {
        throw err;
      }

      Object.keys(err).forEach(function(name) {
        var $element = this.$form.find('[name=' + name + '], #' + name).first(),
            self = this;

        if ($element.length) {
          // binding error:hide must come first in case error:show synchronously
          // triggers 'input' on the element, hiding must take place.
          $element.one('input change', function onChange() {
            // one() binds the events separately, so avoid double firing
            $element.off('input change', onChange);
            self.trigger('error:hide', $element);
          });

          this.trigger('error:show', $element, err[name]);
        }
      }, this);
    },

    /**
     * Attempts to handle errors by first running through all supplied handlers
     * and then delegating to the global error handler
     *
     * @param  {Object} err either a validation error or a server error
     * @return {Promise}
     */
    _handleError: function(err) {
      this.trigger('error', err);

      return error.call(this.handlers, err)
      .catch(error)
      .finally(function() {
        delete this._cacheMeta;
      }.bind(this));
    },

    /**
     * inspects an error object to see if it contains "field" errors
     * which Form can automatically handle. If so, it throws a Form.Error
     * containing the errors, otherwise, rethrows the original error
     *
     * @param  {Object} err the error to inspect
     * @throws {Form.Error} if a "field" error is detected
     * @throws {Object} if no "field" error is detected
     */
    _findFormError: function(err) {
      if (!(err instanceof Object)) { throw err; }

      var meta = this._cacheMeta || this.toJSON(),
          results = {},
          key;

      for (key in meta.data) {
        if (err.hasOwnProperty(key)) {
          results[key] = err[key];
        }
      }

      if (Object.keys(results).length) {
        throw new this.constructor.Error(results);
      }
      throw err;
    },

    submit: function(e) {
      if (!this.$form) {
        throw new Error("The form cannot be null");
      }
      this.trigger('before', e);
      var chain = this._submit(e);
      chain
      .catch(this._findFormError.bind(this))
      .then(this.trigger.bind(this, 'success'), this._handleError.bind(this))
      .finally(this.trigger.bind(this, 'after'));

      return chain;
    },

    _submit: function(e) {
      var validator = Array.isArray(this.validator) ?
            pipe.apply(null, this.validator.map(function(validator) {
              return validator.bind(this);
            }, this)) :
            this.validator.bind(this),
          resolver = new Promise(),
          meta, valid, error;

      this._cacheMeta = meta = this.toJSON();
      try {
        valid = validator(meta.data);
      }
      catch (validationError) {
        valid = false;
        error = validationError;
      }
      valid = valid !== false;

      if (e && (!valid || typeof this.commit === 'function')) {
        e.preventDefault();
      }

      if (!valid) {
        resolver.reject(error);
      }
      else {
        resolver.resolve(meta);
      }
      return resolver.then(innerChain.bind(this));
    },

    toJSON: function() {
      return {
        url: this.$form.attr('action'),
        type: this.$form.attr('method') || 'POST',
        data: this.constructor.decompose(this.$form.serializeArray())
      };
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
    decompose: decompose,

    Error: function FormError(messages) {
      extend(this, messages);
    }
  });

  return Form;
});
