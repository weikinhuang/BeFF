define([
  'jquery',
  'nbd/util/construct',
  '../Component',
  '../Controller',
  '../trait/eventMappable'
], function($, construct, Component, Controller, eventMappable) {
  'use strict';

  /**
   * Manages a DOM region that contains a list of Controllers for each item
   * @constructor
   * @extends BeFF/Component
   * @module  Container
   */
  return Component.extend({
    /**
     * The controller class constructed for each item in the container
     * Defaults to the base BeFF/Controller unless overridden
     * @type {BeFF/Controller}
     */
    Controller: Controller,

    /**
     * @param {$} $view The "container" element that should be managed
     */
    init: function($view) {
      this.$view = $view;
    },

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
    decorate: function() {
      var inst = construct.apply(this.Controller, arguments);
      if (inst.on) {
        this.listenTo(inst, 'destroy', function() {
          this.remove(inst);
        });
      }
      return inst;
    },

    /**
     * Constructs a controller for every element of the resultset
     * and renders the controller into the managed $view
     * @param {Array} resultset A list of JSON objects representing new items in the container
     * @returns {Array} A list of the newly constructed controllers rendered into $view
     */
    add: function(resultset) {
      if (!resultset || !Array.isArray(resultset)) { return; }
      var nodes = resultset.map(this.decorate, this).filter(Boolean);

      nodes.forEach(function(node) {
        return node.render && node.render(this.$view);
      }, this);

      this._nodes = this._nodes.concat(nodes);

      return nodes;
    },

    remove: function(node) {
      var i;
      if (~(i = this._nodes.indexOf(node))) {
        this._nodes.splice(i, 1);
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
        return item && item.destroy && item.destroy();
      });
      this._nodes.length = 0;
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
      var nodes = [];
      if (!this._nodes || !this._nodes.length){ return nodes; }
      return this._nodes.slice();
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
