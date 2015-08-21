define([
  'jquery',
  '../Component',
  '../util/prequire'
], function($, Component, prequire) {
  'use strict';

  return Component.extend({
    init: function(config) {
      this._config = config;
      this._export();
      this._initEmbed();
    },

    bind: function() {
      $('.js-zendesk').bind('click.be-zendesk', function() {
        this._prequire(['//assets.zendesk.com/embeddable_framework/main.js'])
        .then(function() {
          window.zEmbed.activate({ hideOnClose: true });
        });

        // stop propagation and preventDefault
        return false;
      }.bind(this));
    },

    unbind: function() {
      $('.js-zendesk').off('click.be-zendesk');
      window.zEmbed = null;
      window.zE = null;
      document.zendeskHost = null;
      document.zEQueue = null;
    },

    _prequire: prequire,

    _export: function() {
      var queue = [];

      window.zEmbed = function() {
        queue.push(arguments);
      };

      window.zE = window.zE || window.zEmbed;
      document.zendeskHost = this._config.subdomain;
      document.zEQueue = queue;
    },

    _initEmbed: function() {
      window.zEmbed(function() {
        window.zEmbed.identify(this._config.identify);

        // Upon manual testing, it appears that queueing up activate *before*
        // you actually lazyload the script is the only way to get the zendesk
        // popup to appear open onload.
        window.zEmbed.activate({ hideOnClose: true });
      }.bind(this));
    }
  });
});
