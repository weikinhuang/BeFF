define([
  'nbd/Promise',
  'nbd/trait/pubsub',
  'nbd/util/extend',
], function(Promise, pubsub, extend) {
  return function observableToPubSubPromise(upload) {
    var pubSubPromise = extend(new Promise(), pubsub);

    upload.observable.forEach(function(progress) {
      pubSubPromise.trigger('progress', progress);
    })
    .then(pubSubPromise.resolve)
    .catch(pubSubPromise.reject);

    return {
      file: upload.file || null,
      promise: pubSubPromise
    };
  };
});
