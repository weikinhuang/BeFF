define([
  'nbd/util/async',
  'nbd/util/construct',
  'nbd/util/extend',
  './InfiniteLoader',
  './Container'
], function(async, construct, extend, InfiniteLoader, Container) {
  'use strict';

  return InfiniteLoader.extend({
    dataKey: 'data',
    offsetKey: 'offset',

    init: function(loaderOptions) {
      this._super();
      extend(this, loaderOptions);
      this._Container = Container.extend();
    },

    hasMoreResults: function(response) {
      var more = !!(response && response[this.offsetKey]);
      if (!more && this._container.isEmpty()) {
        this.trigger('empty');
      }
      return more;
    },

    getNextOffset: function(response) {
      return response[this.offsetKey];
    },

    loaded: function(response) {
      var data = response[this.dataKey];
      this._container.add(data);
    },

    at: function($context) {
      this._container = new this._Container($context);
      if ($context.css('overflowX') !== 'visible') {
        this.context = $context[0].id ?
          '#' + $context[0].id :
          this.context;
      }
      return this;
    },

    of: function(Klass) {
      if (this._container) {
        this._container.decorate = construct.bind(Klass);
        return this;
      }

      this._Container.mixin({
        decorate: construct.bind(Klass)
      });
      return this;
    },

    bind: function(model, firstLoad) {
      if (!(model && model.data)) {
        return this._super();
      }

      Object.defineProperty(this, 'data', {
        enumerable: true,
        writable: true,
        value: model.data.bind(model)
      });

      this.listenTo(model, 'all', function reset() {
        if (reset.throttle) { return; }
        reset.throttle = true;
        async(function() {
          this.trigger('reload');
          this.reload();
          if (this._container) {
            this._container.empty();
          }
          reset.throttle = false;
        }.bind(this));
      });

      if (firstLoad) {
        this.reload();
        return this;
      }
      else {
        return this._super();
      }
    },

    destroy: function() {
      if (this._container) {
        this._container.destroy();
        this._container = null;
      }
      this._super();
    }
  });
});
