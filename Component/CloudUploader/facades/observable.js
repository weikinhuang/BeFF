define([
  'nbd/Promise',
  './helpers/UploadWrapper',
], function(Promise, UploadWrapper) {
  function observableFacade(Uploader, options, files, resolve) {
    var uploader = Uploader.init(options);
    var submitted = {};
    var wrappers;

    function findWrapper(file) {
      return wrappers.filter(function(wrapper) {
        var bdata = wrapper.blobData;
        return (bdata.name === file.name);
      })[0];
    }

    uploader
    .on('validateBatch', function(data) {
      wrappers = data.files.map(function(blobData) {
        return new UploadWrapper(blobData);
      });
      resolve(wrappers.map(function(wrapper) {
        return wrapper.upload;
      }));
    })
    .on('cancel error', function(data) {
      var wrapper = submitted[data.id];
      if (!wrapper) {
        wrapper = findWrapper(data);
        wrapper.validationError(data);
      }
      else {
        wrapper.error(data);
      }
    })
    .on('submit', function(data) {
      submitted[data.id] = findWrapper(data);
      submitted[data.id].submit(data);
    })
    .on('progress', function(data) {
      submitted[data.id].progress(data);
    })
    .on('complete', function(data) {
      submitted[data.id].complete(data);
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
      observableFacade(Uploader, options, files, resolve);
    });
  };
});
