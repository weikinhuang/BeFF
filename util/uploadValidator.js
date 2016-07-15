define([
  '../dom/Image',
  'nbd/Promise'
], function(Image, Promise) {
  'use strict';

  function validateCMYK(file) {
    if (!file.readerData.isImage) {
      return Promise.resolve(file);
    }

    return Image.load(file.readerData.result)
    .then(function(img) {
      var name = file.readerData.name;

      if (img.isCMYK()) {
        throw new Error('Your images look best on the web in RGB instead of CMYK. Please upload ' + name + ' as a RGB image.');
      }

      return file;
    });
  }

  return {
    CMYK: function(file) {
      return validateCMYK(file);
    }
  };
});
