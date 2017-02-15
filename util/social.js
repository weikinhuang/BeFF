// Initialize 3rd party social sharing widgets
/* global FB, twttr, IN, STMBLPN */
define([
  'jquery',
  'tiny-script-loader/loadScriptPromised'
], function($, loadScriptPromised) {
  'use strict';

  return {
    init: function($context) {
      this.twitter($context);
      this.facebook($context);
      this.linkedin($context);
      this.pinterest($context);
      this.stumbledupon($context);
    },

    twitter: function($context) {
      if ($('.js-viral-button-twitter', $context).length) {
        loadScriptPromised('//platform.twitter.com/widgets.js')
        .then(function() {
          try {
            twttr.widgets.load();
          }
          catch (e) {}
        });
      }
    },

    linkedin: function($context) {
      if ($('.js-viral-button-linkedin', $context).length) {
        loadScriptPromised('//platform.linkedin.com/in.js')
        .then(function() {
          if (typeof IN !== 'undefined' && IN.parse) { IN.parse(); }
        });
      }
    },

    facebook: function($context) {
      if ($('.js-viral-button-fb', $context).length) {
        loadScriptPromised('//connect.facebook.net/en_US/all.js#xfbml=1')
        .then(function() {
          if (typeof FB !== 'undefined' && FB.XFBML) { FB.XFBML.parse(); }
        });
      }
    },

    pinterest: function pinterest($context) {
      $('.js-viral-button-pinterest', $context).on('click', function() {
        loadScriptPromised('//assets.pinterest.com/js/pinmarklet.js')
        .then(function() {
          if (typeof pinterest === 'undefined') {
            return;
          }

          if (pinterest.PIN) {
            window[pinterest.PIN].f.init();
            return;
          }

          pinterest.PIN = Object.keys(window).filter(function(key) {
            return (/^PIN_/).test(key);
          })[0];
        });
      });
    },

    stumbledupon: function($context) {
      // Do not show stumbleupon when on secure pages as they throw security
      // warnings because they load insecure subresources, last checked 3/13/2015
      if (window.location.protocol !== 'https:' && $('.js-viral-button-stumble', $context).length) {
        loadScriptPromised('//platform.stumbleupon.com/1/widgets.js')
        .then(function() {
          if (typeof STMBLPN !== 'undefined') { STMBLPN.processWidgets(); }
        });
      }
    }
  };
});
