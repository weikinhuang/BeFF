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
    },

    CMYKWarning: function(file, warnings) {
      warnings = Array.isArray(warnings) ? warnings : [];

      return new Promise(function(resolve) {
        if (file.readerData.isImage && image.isCMYK(image.getBinaryFromDataUri(file.readerData.result))) {
          warnings.push('Image ' + file.readerData.name + ' has been converted from CMYK to a web friendly format. <a href="https://help.behance.net/hc/en-us/articles/115003666887" target="_blank">Learn more about CMYK display here</a>.');
        }

        resolve(warnings);
      });
    }
  };
});
