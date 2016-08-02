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

    describe('#position', function() {
      it('sets the proper z index', function() {
        this._popup.position();
        expect(this._popup.$view.css('zIndex')).toEqual('250');
      });

      it('sets the proper stacking z index when positioning popups on top of each other', function() {
        this._popup.position();

        var secondPopup = new Popup();
        secondPopup.render(this._$parent);
        secondPopup.position();

        var thirdPopup = new Popup();
        thirdPopup.render(this._$parent);
        thirdPopup.position();

        expect(this._popup.$view.css('zIndex')).toEqual('250');
        expect(secondPopup.$view.css('zIndex')).toEqual('252');
        expect(thirdPopup.$view.css('zIndex')).toEqual('254');
      });

      it('sets the proper z-index when a previous dialog has not been positioned', function() {
        var secondPopup = new Popup();
        secondPopup.render(this._$parent);
        secondPopup.position();

        expect(this._popup.$view.css('zIndex')).toEqual('auto');
        expect(secondPopup.$view.css('zIndex')).toEqual('250');
      });
    });
  });
});
