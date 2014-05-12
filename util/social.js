// Initialize 3rd party social sharing widgets
/*global FB, twttr, IN, STMBLPN */
define(['jquery'], function($) {
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
      if ($('.viral-button-twitter', $context).length) {
        require(['//platform.twitter.com/widgets.js'], function() {
          try {
            twttr.widgets.load();
          }
          catch (e) {}
        });
      }
    },

    linkedin: function($context) {
      if ($('.viral-button-linkedin', $context).length) {
        require(['//platform.linkedin.com/in.js'], function() {
          if (typeof IN !== 'undefined' && IN.parse) { IN.parse(); }
        });
      }
    },

    facebook: function($context) {
      if ($('.fb-like', $context).length) {
        require(['//connect.facebook.net/en_US/all.js#xfbml=1'], function() {
          if (typeof FB !== 'undefined' && FB.XFBML) { FB.XFBML.parse(); }
        });
      }
    },

    pinterest: function pinterest($context) {
      $('.viral-button-pinterest', $context).on('click', function() {
        require(['//assets.pinterest.com/js/pinmarklet.js'], function() {
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
      if ($('.viral-button-stumble', $context).length && window.location.protocol === 'https:') {
        require(['//platform.stumbleupon.com/1/widgets.js'], function() {
          if (typeof STMBLPN !== 'undefined') { STMBLPN.processWidgets(); }
        });
      }
    }
  };
});
