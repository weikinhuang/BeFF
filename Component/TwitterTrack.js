define([
  '../Component',
  'tiny-script-loader/loadScriptPromised'
], function(Component, loadScriptPromised) {
  'use strict';

  return Component.extend({
    init: function(pixelId) {
      this._pixelId = pixelId;
    },

    bind: function() {
      this._createTwitterWrapper();

      this._loadingPromise = this._load()
      .then(function() {
        this._twitter('init', this._pixelId);
      }.bind(this));
    },

    trackPageView: function() {
      return this._loadingPromise.then(function() {
        this._twitter('track', 'PageView');
      }.bind(this));
    },

    _twitter: function() {
      if (window.twq) {
        window.twq.apply(window.twq, arguments);
      }
    },

    _load: function() {
      return loadScriptPromised('//static.ads-twitter.com/uwt.js');
    },

    _createTwitterWrapper: function() {
      if (window.twq) { return; }

      window.twq = function() {
        var twitter = window.twq;

        if (twitter.exe) {
          twitter.exe.apply(twitter, arguments);
        }
        else {
          twitter.queue.push(arguments);
        }
      };

      window.twq.version = '1';
      window.twq.queue = [];
    }
  });
});
