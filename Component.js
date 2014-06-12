define([
  'nbd/Class',
  'nbd/util/construct',
  'nbd/trait/pubsub'
], function(Class, construct, pubsub) {
  'use strict';

  return Class.extend({
    bind: function() { return this; },
    unbind: function() { return this; },
    destroy: function() {
      this
      .off()
      .stopListening()
      .unbind();
    }
  }, {
    init: function() {
      return construct.apply(this, arguments).bind();
    }
  })
  .mixin(pubsub);
});
