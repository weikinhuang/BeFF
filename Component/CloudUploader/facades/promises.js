define([
  'nbd/Promise',
  'nbd/trait/pubsub',
  'nbd/util/extend'
], function(Promise, pubsub, extend) {
  function promisesFacade(Uploader, options, files, resolve) {
    var uploader = Uploader.init(options);
    var submitted = {};
    var wrappers;

    function createWrapper(blobData) {
      return {
        blobData: blobData,
        uploadPromise: new Promise(),
        submit: function(data) {
          this.promise = extend(new Promise(), pubsub);
          this.uploadPromise.resolve({
            file: data.file,
            promise: this.promise
          });
        },
        progress: function(progress) {
          this.promise.trigger('progress', progress);
        },
        complete: function(data) {
          this.promise.resolve(data);
        },
        error: function(err) {
          this.promise.reject(err);
        },
        validationError: function(err) {
          this.submit({ file: null });
          this.promise.reject(err);
        }
      };
    }

    function findWrapper(file) {
      return wrappers.filter(function(wrapper) {
        var bdata = wrapper.blobData;
        return (bdata.name === file.name);
      })[0];
    }

    uploader
    .on('validateBatch', function(data) {
      wrappers = data.files.map(createWrapper);
      resolve(wrappers.map(function(wrapper) {
        return wrapper.uploadPromise;
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
      promisesFacade(Uploader, options, files, resolve);
    });
  };
});
