// A View Entity that delegates it's events
define(function() {
  'use strict';

  function decomposeEvent(method, context) {
    var parseMethod = function parse(method) {
      if (typeof method === 'string') {
        return {
          method: function() {
            context[method].apply(context, arguments);
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
          method: parse(this[selector]).method
        };
      }, method);
    };

    return Array.isArray(method) ?
      Array.prototype.concat.apply([], method.map(parseMethod)) :
      [].concat(parseMethod(method));
  }

  return {
    _mapEvents: function() {
      this._undelegateEvents();

      Object.keys(this.events)
      .forEach(function(event) {
        var bindings = decomposeEvent(this.events[event], this);
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
      this.$view.off('.delegated');
    },
  };
});
