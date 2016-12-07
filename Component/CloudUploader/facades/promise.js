define([
  'nbd/Promise',
  './observable',
  './helpers/observableToPubSubPromise'
], function(Promise, observableFacade, observableToPubSubPromise) {
  return function(Uploader, options, files) {
    return observableFacade(Uploader, options, files)
    .then(function(uploadPromises) {
      return Promise.all(uploadPromises)
      .then(function(uploads) {
        return uploads.map(observableToPubSubPromise);
      });
    });
  };
});
