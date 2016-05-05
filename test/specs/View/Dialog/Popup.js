define([
  'jquery',
  'View/Dialog/Popup'
], function($, Popup) {
  'use strict';

  describe('View/Dialog/Popup', function() {
    beforeEach(function() {
      this._$parent = affix('div');
      this._popup = new Popup();
      this._popup.render(this._$parent);
    });

    afterEach(function() {
      this._popup.destroy();
    });

    it('closes when blocking div is clicked', function(done) {
      var $block = this._$parent.find('.blocking-div');
      this._popup.show();

      expect($block.length).toBe(1);

      $block.click();

      this._popup._hiding.then(function() {
        expect(this._$parent.find('.popup').css('display')).toBe('none');
        expect($block.css('display')).toBe('none');
        done();
      }.bind(this));
    });
  });
});
