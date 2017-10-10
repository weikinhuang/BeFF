define([
  '@behance/nbd/Promise',
  '@behance/nbd/trait/pubsub',
  '@behance/nbd/util/extend'
], function(Promise, pubsub, extend) {
  function promisesFacade(Uploader, options, files, resolve) {
    var uploader = Uploader.init(options);
    var submitted = {};
    var wrappers;

    function createWrapper(blobData) {
      return {
        blobData: blobData,
        validationPromise: new Promise(),
        uploadPromise: extend(new Promise(), pubsub),
      };
    }

    function findUnsubmittedWrapper(file) {
      var wrapper = wrappers.filter(function(wrapper) {
        var bdata = wrapper.blobData;
        return (bdata.name === file.name);
      })[0];
      wrappers.splice(wrappers.indexOf(wrapper), 1);
      return wrapper;
    }

    uploader
    .on('validateBatch', function(data) {
      wrappers = data.files.map(createWrapper);
      resolve(wrappers.map(function(wrapper) {
        return wrapper.validationPromise;
      }));
    })
    .on('cancel error', function(data) {
      var wrapper = submitted[data.id];
      if (!wrapper) {
        wrapper = findUnsubmittedWrapper(data);
        wrapper.uploadPromise.reject(data);
        wrapper.validationPromise.resolve({
          file: null,
          promise: wrapper.uploadPromise
        });
      }
      else {
        wrapper.uploadPromise.reject(data);
      }
    })
    .on('submit', function(data) {
      var wrapper = findUnsubmittedWrapper(data);
      wrapper.validationPromise.resolve({
        name: data.name,
        file: data.file,
        promise: wrapper.uploadPromise
      });
      submitted[data.id] = wrapper;
    })
    .on('progress', function(data) {
      submitted[data.id].uploadPromise.trigger('progress', data);
    })
    .on('complete', function(data) {
      submitted[data.id].uploadPromise.resolve(data);
    })
    .on('allComplete', function() {
      uploader.destroy();
    });

    if (files) {
      uploader.addFiles(files);
    }
    else {
      uploader.choose();
    }
  }

  return function(Uploader, options, files) {
    return new Promise(function(resolve) {
      promisesFacade(Uploader, options, files, resolve);
    });
  };
});
