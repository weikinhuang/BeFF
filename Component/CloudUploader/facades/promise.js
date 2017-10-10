define([
  '@behance/nbd/Promise',
  './promises',
], function(Promise, promisesFacade) {
  return function(Uploader, options, files) {
    return promisesFacade(Uploader, options, files)
    .then(function(uploadPromises) {
      return Promise.all(uploadPromises);
    });
  };
});
