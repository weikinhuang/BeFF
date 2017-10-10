define([
  'jquery',
  '@behance/nbd/util/construct',
  '../Component',
  '../Controller',
  '../trait/eventMappable'
], function($, construct, Component, Controller, eventMappable) {
  'use strict';

  /**
   * Manages a DOM region that contains a list of Controllers for each item.
   * Forwards all events from inner nodes with an event prefix.
   *
   * @constructor
   * @extends BeFF/Component
   * @module  BeFF/Component/Container
   */
  return Component.extend({
    /**
     * The controller class constructed for each item in the container
     * Defaults to the base BeFF/Controller unless overridden
     * @type {BeFF/Controller}
     */
    Controller: Controller,

    /**
     * All events from inner nodes are forwarded with this prefix.
     * @type {String}
     */
    eventPrefix: 'change:',

    /**
     * @param {$} $view The "container" element that should be managed
     */
    init: function($view) {
      this.$view = $view;
    },

    /**
     * @return {BeFF/Component/Container}
     */
    bind: function() {
      this._mapEvents();
      this._nodes = this.$view.children().toArray()
      .map(this.decorate, this);
      return this;
    },

    unbind: function() {
      this._undelegateEvents();
      return this;
    },

    /**
     * Constructs an instance of the controller with the passed args
     * @return {BeFF/Controller} An instance of the controller
     */
    decorate: function(dataOrEl) {
      var inst = new this.Controller(dataOrEl);
      if (inst.on) {
        this.listenTo(inst, 'destroy', function() {
          this.remove(inst);
        });

        this.listenTo(inst, 'all', this.forwardEvents);
      }
      return inst;
    },

    /**
     * Forwards events from inner nodes with a prefix.
     * This allows listeners of this container to distinguish container-level events
     * from a container's node's events.
     */
    forwardEvents: function() {
      var eventName = this.eventPrefix + arguments[0],
          eventData = [].slice.call(arguments, 1);

      this.trigger.bind(this, eventName).apply(this, eventData);
    },

    /**
     * Constructs a controller for every element of the resultset
     * and renders the controller into the managed $view
     * @param {Array} resultset A list of JSON objects representing new items in the container
     * @fires module:BeFF/Component/Container#update
     * @returns {Array} A list of the newly constructed controllers rendered into $view
     */
    add: function(resultset) {
      if (!resultset || !Array.isArray(resultset)) { return; }
      var nodes = resultset.map(this.decorate, this).filter(Boolean);

      nodes.forEach(function(node) {
        return node.render && node.render(this.$view);
      }, this);

      this._nodes = this._nodes.concat(nodes);
      this.trigger('update', this.getNodes());

      return nodes;
    },

    /** @fires module:BeFF/Component/Container#update */
    remove: function(node) {
      var i;
      if ((i = this._nodes.indexOf(node)) !== -1) {
        this._nodes.splice(i, 1);
        this.stopListening(node, 'all', this.forwardEvents);
        this.trigger('update', this.getNodes());
      }
    },

    /**
     * Destroys all of the managed controllers and empties
     * the managed $view
     * @return {$} The newly emptied $view
     */
    empty: function() {
      if (!this._nodes) {
        return this.$view;
      }

      this._nodes.forEach(function(item) {
        if (!item) { return; }
        if (item.off) {
          this.stopListening(item);
        }
        if (item.destroy) {
          item.destroy();
        }
      }, this);
      this._nodes.length = 0;
      this.trigger('update', this.getNodes());
      return this.$view.empty();
    },

    /**
     * @return {Boolean} Whether or not there are any managed controllers
     */
    isEmpty: function() {
      return !this._nodes || !this._nodes.length;
    },

    /**
     * @return {Array} An array of all the nodes
     */
    getNodes: function() {
      return this._nodes && this._nodes.slice() || [];
    }
  }, {
    init: function($view, Controller) {
      var instance = new this($view);
      instance.Controller = Controller || instance.Controller;
      return instance.bind();
    }
  })
  .mixin(eventMappable);
});
