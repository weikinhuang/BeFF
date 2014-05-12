// Top-level form module for programmictally assembling form behaviors
define([
  'nbd/Class',
  'nbd/Promise',
  'nbd/trait/pubsub',
  './util/xhr'
], function(Class, Promise, pubsub, xhr) {
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

  initChain = function(e) {
    if (e) { e.preventDefault(); }

    var chain = new Promise(),
        formMetadata = {
          url: this.$form.attr('action'),
          type: this.$form.attr('method') || 'POST',
          data: decompose(this.$form.serializeArray())
        };

    chain.resolve(formMetadata);
    return this._submit(chain);
  },

  innerChain = function(metadata) {
    var chain = new Promise(),
    then = chain.thenable(),
    retval;

    retval = this.commit.call(then, metadata);
    chain.resolve(retval === then ? xhr(metadata) : retval);

    return chain;
  },

  Form = Class.extend({
    init: function($context) {
      this.$form = $context;

      // Internal bindings so that we can unbind later
      this._normalizeSubmitter = normalizeSubmitter.bind(this);
      this._initChain = initChain.bind(this);

      this._bindSubmission();
    },

    destroy: function() {
      this._unbindSubmission();
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

    submit: function() {
      return this._initChain();
    },

    /**
     * Private function that handles the steps necessary to submit the form. This should be
     * overridden in subclasses.
     *
     * The base implementation calls the submission function to determine whether to return
     * submission's return value or ajax submit the form.
     */
    _submit: function(chain) {
      this.trigger('before');

      chain = chain.then(innerChain.bind(this));
      chain.then(this.trigger.bind(this, 'success'), this.trigger.bind(this, 'error'));

      return chain;
    },

    _bindSubmission: function() {
      this.$form
      .on('click keydown', '.form-submit:not([type=submit])', this._normalizeSubmitter)
      .on('submit', this._initChain);
    },

    _unbindSubmission: function() {
      this.$form
      .off('click keydown', '.form-submit:not([type=submit])', this._normalizeSubmitter)
      .off('submit', this._initChain);
    }
  }, {
    decompose: decompose
  })
  .mixin(pubsub);

  return Form;
});
