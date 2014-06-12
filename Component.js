define([
  'nbd/Class',
  'nbd/util/construct',
  'nbd/trait/log',
  'nbd/trait/pubsub'
], function(Class, construct, log, pubsub) {
  'use strict';

  return Class.extend({
    bind: function() { return this; },
    unbind: function() { return this; },
    destroy: function() {
      this
      .unbind()
      .stopListening()
      .off();
    }
  }, {
    displayName: 'Component',
    init: function() {
      return construct.apply(this, arguments).bind();
    }
  })
  .mixin(log)
  .mixin(pubsub);
});
