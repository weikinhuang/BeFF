define([], function() {
  function int16BE(bits, pos) {
    return (bits.charCodeAt(pos) << 8) + bits.charCodeAt(pos + 1);
  }

  function int16LE(bits, pos) {
    return (bits.charCodeAt(pos + 1) << 8) + bits.charCodeAt(pos);
  }

  return {
    /**
     * Returns whether the src property is a data-uri of an animated gif.
     *
     * @throws {Error} If the src attribute is not a data-uri.
     * @return {Boolean}
     */
    isAnimatedGif: function(bits) {
      if (!/^GIF8[79]a/.test(bits)) {
        return false;
      }

      var count = 0;

      // Find Graphic Control Extension followed by image separator (0x2C) or extension introducer (0x21):
      // Graphic control extensions are:
      // 0x21 Extension Introducer
      // 0xF9 Graphic Control Label
      // 0x04 Block Size (always a fixed value of 4)
      // 4 bytes of other data
      // 0x00 Block Terminator
      // Must not be inlined due to /g flag to keep track of number of matches
      var gceWithImageSeparatorRe = /\x21\xF9\x04.{4}\x00(\x2C|\x21)/g;

      while (gceWithImageSeparatorRe.exec(bits)) {
        count++;
        if (count === 2) {
          return true;
        }
      }

      // Some animated gifs don't include the optional graphics control extension.
      // In this case, do a simple check for Block Terminator followed by Image Separator.
      // This will produce an occasional false positive, but better than having
      // to parse the whole entire gif for this rare case.
      if (count === 0) {
        return bits.split('\x00\x2c').length > 2;
      }

      return false;
    },

    getDimensions: function(bits) {
      var header = bits.substring(0, 6);
      if (!/^GIF8[79]a/.test(header)) {
        throw new Error('Please provide a GIF encoded image.');
      }

      var frameHex = '\x00\x2C';
      var framePos = bits.indexOf(frameHex);

      if (framePos < 0) {
        throw new Error('Please provide a GIF encoded image.');
      }

      return {
        width: int16LE(bits, 6),
        height: int16LE(bits, 8)
      };
    },

    getBinaryFromDataUri: function(dataUri) {
      return atob(dataUri.split(',')[1]);
    },

    /**
     * Returns whether the src property is a data-uri of a CMYK jpeg.
     *
     * @throws {Error} If the src attribute is not a data-uri.
     * @return {Boolean}
     */
    isCMYK: function(bits) {
      // JPEG's with less than 4 color channels can't be CMYK. More importantly,
      // this logic matches the image service logic that has been used in production
      // since at least 2012.
      return this._getChannelCount(bits) > 3;
    },

    /**
     * Returns the channel count in a JPG, 0 for other image formats.
     *
     * @see  https://github.com/tommoor/fastimage/blob/master/Fastimage.php, which this implementation
     * was adapted from.
     *
     * @param {String} bits
     * @throws {Error} If the src attribute is not a data-uri.
     * @return {Number}
     */
    _getChannelCount: function(bits) {
      var state = 'getNextByte',
          strPos = 0,
          byte,
          numCharactersToSkip,
          header;

      function getChars(count) {
        if (strPos + count > bits.length) {
          return false;
        }

        var substr = bits.substring(strPos, strPos + count);
        strPos += count;
        return substr;
      }

      function getByte() {
        return getChars(1);
      }

      function getInt16() {
        var bytes = getChars(2);
        return int16BE(bytes, 0);
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

      while (strPos < bits.length) {
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
