define([
  './image'
], function(image) {
  'use strict';

  return {
    CMYK: function(file) {
      return new Promise(function(resolve, reject) {
        if (file.readerData.isImage && image.isCMYK(image.getBinaryFromDataUri(file.readerData.result))) {
          reject(new Error('Your images look best on the web in RGB instead of CMYK. Please upload ' + file.readerData.name + ' as a RGB image.'));
        }

        resolve(file);
      });
    }
  };
});
