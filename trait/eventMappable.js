define(function() {
  'use strict';

  var parse = function parse(method) {
    var self = this;
    if (typeof method === 'string') {
      return {
        method: function() {
          if (self[method]) {
            self[method].apply(self, arguments);
          }
          else {
            Array.prototype.unshift.call(arguments, method);
            self.trigger.apply(self, arguments);
          }
        }
      };
    }

    if (typeof method === 'function') {
      return { method: method };
    }

    return Object.keys(method)
    .map(function(selector) {
      return {
        selector: selector,
        method: parse.call(this, method[selector]).method
      };
    }, this);
  },

  decomposeEvent = function(method) {
    var parseMethod = parse.bind(this);
    return [].concat(Array.isArray(method) ?
                     method.map(parseMethod) :
                     parseMethod(method));
  };

  return {
    _mapEvents: function() {
      if (this.events == null || !this.$view) { return; }

      this._undelegateEvents();
      Object.keys(this.events)
      .forEach(function(event) {
        var bindings = decomposeEvent.call(this, this.events[event]);
        event += '.delegated';

        bindings.forEach(function(binding) {
          if (binding.selector) {
            this.on(event, binding.selector, binding.method);
          }
          else {
            this.on(event, binding.method);
          }
        }, this.$view);
      }, this);
    },

    _undelegateEvents: function() {
      if (!this.$view) { return; }
      this.$view.off('.delegated');
    },
  };
});
