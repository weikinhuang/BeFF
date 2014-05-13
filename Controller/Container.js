define([
  'nbd/util/async',
  'nbd/util/construct',
  'nbd/util/extend',
  'nbd/Controller',
  'nbd/trait/pubsub',
  './InfiniteLoader',
  '../View/Container'
], function(async, construct, extend, Controller, pubsub, InfiniteLoader, ContainerView) {
  'use strict';

  return Controller.extend({
    dataKey: 'data',
    offsetKey: 'offset',

    hasMoreResults: function(response) {
      var more = !!(response && response[this.offsetKey]);
      if (!more && this._view.isEmpty()) {
        this.trigger('empty');
      }
      return more;
    },

    getNextOffset: function(response) {
      return response[this.offsetKey];
    },

    loaded: function(response) {
      var data = response[this.dataKey];
      this._view.render(data);
    },

    init: function(loaderOptions) {
      this._Loader = InfiniteLoader.extend({
        hasMoreResults: function() {
          return this.hasMoreResults.apply(this, arguments);
        }.bind(this),
        getNextOffset: function() {
          return this.getNextOffset.apply(this, arguments);
        }.bind(this),
        loaded: function() {
          return this.loaded.apply(this, arguments);
        }.bind(this)
      });

      extend(this._loader = new this._Loader(this.context), {
        url: this.url,
        offsetKey: this.offsetKey
      }, loaderOptions);
      this.listenTo(this._loader, 'all', this.trigger);
    },

    at: function($context) {
      this._initView(this.constructor.VIEW_CLASS, $context);
      if ($context.css('overflowX') !== 'visible') {
        this._loader.context = $context[0].id ?
          '#' + $context[0].id :
          this._loader.context;
      }
      return this;
    },

    of: function(Klass) {
      if (this._view) {
        this._view.decorate = construct.bind(Klass);
        return this;
      }

      this.constructor.VIEW_CLASS = this.constructor.VIEW_CLASS.extend({
        decorate: construct.bind(Klass)
      });
      return this;
    },

    bind: function(model, firstLoad) {
      this._Loader.mixin({
        data: model.data.bind(model)
      });

      this.listenTo(model, 'all', function reset() {
        if (reset.throttle) { return; }
        reset.throttle = true;
        async(function() {
          this.trigger('reload');
          this._loader.reload();
          if (this._view) {
            this._view.clear();
          }
          reset.throttle = false;
        }.bind(this));
      });

      if (firstLoad) {
        this._loader.reload();
      }
      else {
        this._loader.bind();
      }
    },

    destroy: function() {
      if (this._view) {
        this._view.destroy();
        this._view = null;
        this._loader.unbind();
      }

      this.stopListening();
    }
  }, {
    VIEW_CLASS: ContainerView
  })
  .mixin(pubsub);
});
