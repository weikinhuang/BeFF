define([
  'nbd/Promise',
  'nbd/util/extend',
  'nbd/util/pipe',
  '../Component',
  './util/xhr',
  './util/error'
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
      this.commmit;

    chain.resolve(retval === then ? xhr(metadata) : retval);

    return chain;
  },

  findFields = function(err) {
    if (!(err instanceof Object)) { throw err; }
    var meta = this._cacheMeta || this.toJSON(),

    matches = Object.keys(meta.data)
    .filter(err.hasOwnProperty.bind(err)),

    results = matches
    .reduce(function(o, key) {
      o[key] = err[key];
      return o;
    }, {});

    if (matches.length) {
      throw new this.constructor.Error(results);
    }
    throw err;
  },

  Form = Component.extend({
    init: function($context) {
      this.$form = $context.is('form') ? $context : $context.find('form');

      // Internal bindings so that we can unbind later
      this._normalizeSubmitter = normalizeSubmitter.bind(this);
      this.submit = this.submit.bind(this);

      // Error handling chain
      this.on('error', function(e) {
        error.call([this._catch.bind(this)], e).catch(error);
      });
    },

    destroy: function() {
      this._super();
      this.$form = null;
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
     * Default error catch
     */
    _catch: function(err) {
      if (!(err instanceof Form.Error)) {
        throw err;
      }

      Object.keys(err).forEach(function(name) {
        var $element = this.$form.find('[name=' + name + '], #' + name).first();
        if ($element.length) {
          this.trigger('error:show', $element, err[name]);
        }
      }, this);
    },

    submit: function(e) {
      this.trigger('before', e);
      var chain = this._submit(e);
      chain
      .catch(findFields.bind(this))
      .then(this.trigger.bind(this, 'success'), this.trigger.bind(this, 'error'));
      return chain;
    },

    _submit: function(e) {
      var validator = Array.isArray(this.validator) ?
            pipe.apply(null, this.validator) :
            this.validator,
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

    Error: function(messages) {
      extend(this, messages);
    }
  });

  return Form;
});
