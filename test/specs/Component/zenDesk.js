define([
  'jquery',
  'util/prequire',
  'nbd/Promise',
  'Component/zenDesk'
], function($, prequire, Promise, ZenDesk) {
  'use strict';

  describe('be/zenDesk', function() {
    beforeEach(function() {
      affix('div.js-zendesk');

      this.zenDesk = ZenDesk.init({
        subdomain: 'be.zenDesk.com',
        identify: { doesnt: 'matter' }
      });
    });

    afterEach(function() {
      this.zenDesk.destroy();
    });

    describe('#init', function() {
      it('creates the proper globals', function() {
        expect(window.zEmbed).toBeTruthy();
        expect(window.zE).toBeTruthy();
        expect(document.zendeskHost).toBeTruthy();
        expect(document.zEQueue).toBeTruthy();
      });
    });

    describe('behaviors', function() {
      it('calls identify and activate the first time clicked', function(done) {
        this.resolvedProm = Promise.resolve().then(function() {
          // emulate what downloading the zendesk file does
          window.zEmbed.identify = jasmine.createSpy();
          window.zEmbed.activate = jasmine.createSpy();

          document.zEQueue.forEach(function(args) {
            args[0]();
          });
          document.zEQueue = [];
        });

        spyOn(this.zenDesk, '_prequire').and.returnValue(this.resolvedProm);

        $('.js-zendesk').trigger('click');

        this.resolvedProm.then(function() {
          expect(window.zEmbed.identify).toHaveBeenCalledWith({ doesnt: 'matter' });
          expect(window.zEmbed.identify.calls.count()).toBe(1);
          expect(window.zEmbed.activate.calls.count()).toBe(2);
          done();
        });
      });
    });
  });
});
