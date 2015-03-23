define([
  'dom/truncate'
], function(truncate) {
  'use strict';

  describe('dom/truncate', function() {
    beforeEach(function() {
      this.$context = affix('div').text((new Array(50)).join(' yada '));
    });

    it('correctly truncates height', function() {
      var fontSize = 10,
          lines = 3;

      this.$context.css({
        width: 300,
        lineHeight: 1,
        fontSize: fontSize
      });

      while (--lines) {
        truncate(this.$context.contents()[0], lines);
        expect(this.$context.height()).toBe(lines * fontSize);
      }
    });
  });
});
