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

    Container: Container,

    init: function(loaderOptions) {
      this._super();
      extend(this, loaderOptions);
      this._Container = this.Container.extend();
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
      if (!$context) {
        throw new Error('Context must be defined');
      }

      this._container = this._Container.init($context);

      this.listenTo(this._container, 'update', this.trigger.bind(this, 'update'));

      if ($context.css('overflowX') !== 'visible') {
        this.context = $context[0].id ?
          '#' + $context[0].id :
          this.context;
      }
      return this;
    },

    of: function(Klass) {
      if (this._container) {
        this._container.Controller = Klass;
        return this;
      }

      this._Container.mixin({
        Controller: Klass
      });
      return this;
    },

    _xhrOptions: function() {
      var options = this._super();
      if (this._model){
        extend(options.data, this._model.data());
      }
      return options;
    },

    bind: function(model, firstLoad) {
      if (this._model) {
        this.stopListening(this._model);
      }

      if (model && model.data) {
        this._model = model;

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
      }

      if (firstLoad) {
        this.reload();
        return this;
      }
      else {
        return this._super();
      }
    },

    destroy: function() {
      if (this._model) {
        this.stopListening(this._model);
        this._model = null;
      }
      if (this._container) {
        this._container.destroy();
        this._container = null;
      }
      this._super();
    }
  });
});
