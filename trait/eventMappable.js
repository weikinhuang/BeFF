define(function() {
  'use strict';

  var isEvent = /^:(.+)/,

      parse = function parse(method) {
        var self = this, event;
        if (typeof method === 'string') {
          return {
            method: function() {
              if (self[method]) {
                self[method].apply(self, arguments);
              }
              else if (event = isEvent.exec(method)) {
                Array.prototype.unshift.call(arguments, event[1]);
                self.trigger.apply(self, arguments);
              }
              else {
                throw new Error('Method "' + method + '" not found');
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
        method = Array.isArray(method) ? method : [method];
        return Array.prototype.concat.apply([], method.map(parse, this));
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
    }
  };
});
