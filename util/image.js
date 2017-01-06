define([], function() {
  return {
    /**
     * Returns whether the src property is a data-uri of an animated gif.
     *
     * @throws {Error} If the src attribute is not a data-uri.
     * @return {Boolean}
     */
    isAnimatedGif: function(binaryData) {
      var gifHeaderHex = '\x00\x21\xF9\x04';
      var gifFrameHex = '\x00\x2C';

      return binaryData.indexOf(gifHeaderHex) > -1 && binaryData.split(gifFrameHex).length > 2;
    },

    getBinaryFromDataUri: function(dataUri) {
      return window.atob(dataUri.split(',')[1]);
    },

    /**
     * Returns whether the src property is a data-uri of a CMYK jpeg.
     *
     * @throws {Error} If the src attribute is not a data-uri.
     * @return {Boolean}
     */
    isCMYK: function(binaryData) {
      // JPEG's with less than 4 color channels can't be CMYK. More importantly,
      // this logic matches the image service logic that has been used in production
      // since at least 2012.
      return this._getChannelCount(binaryData) > 3;
    },

    /**
     * Returns the channel count in a JPG, 0 for other image formats.
     *
     * @see  https://github.com/tommoor/fastimage/blob/master/Fastimage.php, which this implementation
     * was adapted from.
     *
     * @param {String} buffer
     * @throws {Error} If the src attribute is not a data-uri.
     * @return {Number}
     */
    _getChannelCount: function(buffer) {
      var state = 'getNextByte',
          strPos = 0,
          byte,
          numCharactersToSkip,
          header;

      function getChars(count) {
        if (strPos + count > buffer.length) {
          return false;
        }

        var substr = buffer.substring(strPos, strPos + count);
        strPos += count;
        return substr;
      }

      function getByte() {
        return getChars(1);
      }

      function getInt16() {
        var bytes = getChars(2);
        return (bytes.charCodeAt(0) << 8) + bytes.charCodeAt(1);
      }

      function getStateFromByte(byte) {
        return byte === '\xFF' ? 'startOfFrame' : 'getNextByte';
      }

      function getStateFromStartOfFrame() {
        var byte = getByte(),
            validReadMarkers = [
              '\xC0',
              '\xC1',
              '\xC2',
              '\xC3',
              '\xC5',
              '\xC6',
              '\xC7',
              '\xC9',
              '\xCA',
              '\xCB',
              '\xCD',
              '\xCE',
              '\xCF'
            ];

        if (validReadMarkers.indexOf(byte) > -1) {
          return 'readInfo';
        }

        if (byte === '\xFF') {
          return 'startOfFrame';
        }

        return 'skipFrame';
      }

      header = getChars(2);

      // Ensure the first two bytes are the jpeg header
      if (header !== '\xFF\xd8') {
        return 0;
      }

      while (strPos < buffer.length) {
        switch (state) {
          case 'getNextByte':
            byte = getByte();
            if (byte === false) {
              return 0;
            }

            state = getStateFromByte(byte);
            break;

          case 'startOfFrame':
            state = getStateFromStartOfFrame();
            break;

          case 'skipFrame':
            numCharactersToSkip = getInt16() - 2;
            getChars(numCharactersToSkip);
            state = 'getNextByte';
            break;

          case 'readInfo':
            // the info frame contains a 5 byte header, followed by 1 byte for height, width, and channel respectively.
            return getChars(8).charCodeAt(7);
        }
      }
    }
  };
});
