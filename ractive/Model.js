define([
  '@behance/nbd/Model'
], function(Model) {
  'use strict';

  return Model.extend({
    /**
     * @param  {String} id - keypath/subtree the model maintains
     * @param  {ractive} ractive - the instance managing the parent tree
     */
    init: function(id, ractive) {
      this._id = id;
      this._r = ractive;
      this._observer = this._r.observe(
        this._id,
        function(newValue, oldValue, keypath) { this.trigger(keypath, newValue, oldValue); },
        { init: false, context: this }
      );
    },

    destroy: function() {
      this._observer.cancel();
      this._super();
    },

    /** @returns {String} */
    id: function() {
      return this._id;
    },

    /**
     * @param  {String} prop
     * @return {*}
     */
    get: function(prop) {
      return this._r.get(this.constructor.completePath(this.id(), prop));
    },

    /**
     * @param {String} prop
     * @param {String} value
     * @returns {Boolean}
     */
    set: function(prop, value) {
      if (value === undefined && typeof prop !== 'string') {
        value = prop;
        prop = undefined;
      }
      return this._r.set(this.constructor.completePath(this.id(), prop), value);
    },

    /** @param {String} path */
    updateModel: function(path) {
      return this._r.updateModel(this.constructor.completePath(this.id(), path));
    },

    /** @param  {String} path */
    unset: function(path) {
      path = this.constructor.completePath(this.id(), path).split('.');

      var key = path.pop();
      var obj = this._r.get(path.join('.'));

      if (Array.isArray(obj)) {
        obj.splice(+key, 1);
      }
      else {
        delete obj[key];
        this._r.update();
      }
    },

    data: function() {
      return this.get();
    }
  }, {
    displayName: 'RactiveModel',

    /**
     * Path completion based on context and unnormalized path
     */
    completePath: function(context, local) {
      var path;

      if (!local) {
        return context;
      }

      // Look for global escape: !path.to.data
      if (path = /^!(.+)/.exec(local)) {
        return path[1];
      }
      return context + '.' + local;
    },

    /**
     * Captures foo:bar or url:/project or url:/http://www.be.net
     *
     * @param  {Object} ctxt
     * @param  {String} ident
     * @return {Boolean}
     */
    matchIdentity: function(ctxt, ident) {
      var identRE = /(\w+?):(.+)/,
          parts = identRE.exec(ident) || [],
          key = parts[1],
          value = parts[2];

      // Intentional weak equality
      // eslint-disable-next-line eqeqeq
      return ctxt[key] == value;
    },

    /**
     * Matches identity strings with data
     *
     * @param context {Object | Object[]}
     * @param identity {String}
     *
     * @example
     *   var key = findByIdentity(objectOrArray, "id:24601");
     */
    findByIdentity: function(context, identity) {
      var k;

      for (k in context) {
        if (context.hasOwnProperty(k) && this.matchIdentity(context[k], identity)) {
          return k;
        }
      }
    }
  })
  .mixin({
    get _data() {
      return this._r.get();
    },

    get ractive() {
      return this._r;
    },

    /**
     * @noop
     */
    set _data(data) { return data; }
  });
});
