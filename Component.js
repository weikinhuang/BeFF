define([
  '@behance/nbd/Class',
  '@behance/nbd/util/construct',
  '@behance/nbd/trait/log',
  '@behance/nbd/trait/pubsub'
], function(Class, construct, log, pubsub) {
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
    displayName: 'Component',
    init: function() {
      var self = construct.apply(this, arguments);
      self.bind();
      return self;
    }
  })
  .mixin(log)
  .mixin(pubsub);
});
