define([
  './observable',
  './helpers/observableToPubSubPromise'
], function(observableFacade, observableToPubSubPromise) {
  return function(Uploader, options, files) {
    return observableFacade(Uploader, options, files)
    .then(function(uploadPromises) {
      return uploadPromises.map(function(uploadPromise) {
        return uploadPromise.then(observableToPubSubPromise);
      });
    });
  };
});
