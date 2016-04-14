define([
  './window',
  './xhr'
], function(win, xhr) {
  'use strict';

  var queue = [],
      api = {},
      levels = ['INFO', 'ERROR'],
      interval;

  /**
   * Ensures that no key has a value over a certain length
   *
   * @param {Object} params
   *
   * @return {Object}
   */
  function _truncateObject(params) {
    Object.keys(params).forEach(function(key) {
      if (typeof params[key] === 'object') {
        params[key] = _truncateObject(params[key]);
      }
      else {
        params[key] = params[key].toString().substr(0, 200);
      }
    });

    return params;
  }

  /**
   * Pushes a log item to queue
   *
   * @param {string} level
   * @param {string} channel
   * @param {string} message
   * @param {Object} context
   */
  function _push(level, channel, message, context) {
    context = (typeof context === 'object') ? context : {},
    level = level || 'ERROR',
    message = message || '[No message]',
    channel = channel || 'client_log';

    if (levels.indexOf(level) === -1) {
      throw new Error("Unacceptable Level: " + level);
    }

    queue.push({
      level: level,
      channel: channel,
      // Weird format for compatability with server
      messages: [{ message: message }],
      context: context
    });
  }

  /**
   * Makes sure queue gets flushed every second
   */
  function _setInterval() {
    interval = setInterval(function() {
      if (queue.length) {
        api.send();
      }
    }, 1000);
  }

  /**
   * Stops automatic queue sending
   */
  function _clearInterval() {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
  }

  api = {
    /**
     * Allows consumer to overload xhr
     */
    xhr: xhr,

    log: function(level, channel, message, context) {
      _push(level.toUpperCase(), channel, message, context);
      return this;
    },

    /**
     * Pushes a log item to queue
     *
     * @param {string} channel
     * @param {string} message
     * @param {Object} context
     *
     * @return {be/remoteLogger}
     */
    info: function(channel, message, context) {
      _push('INFO', channel, message, context);
      return this;
    },

    /**
     * Pushes a log item to queue
     *
     * @param {string} channel
     * @param {string} message
     * @param {Object} context
     *
     * @return {be/remoteLogger}
     */
    error: function(channel, message, context) {
      _push('ERROR', channel, message, context);
      return this;
    },

    /**
     * Sends queued logs to server
     *
     * @return {Promise}
     */
    send: function() {
      var logs = [],
          data, chain;

      // Ensure no sending can conflict with timer
      _clearInterval();

      while (queue.length) {
        data = queue.pop();
        logs.push(JSON.stringify(data));
      }

      chain = this.xhr({
        url: '/log',
        type: 'POST',
        data: {
          logs: logs
        }
      });

      chain.then(_setInterval, _setInterval);

      return chain;
    },

    /**
     * Returns currently queued items waiting to be sent
     *
     * @return {Array}
     */
    getQueue: function() {
      return queue;
    },

    /**
     * Gives back query string params without any values that are too long
     * Useful when wanting to log specific query string parameters in the context
     *
     * @return {Object}
     */
    getSafeSearch: function() {
      var params = win.getSearchObject();

      params = _truncateObject(params);

      return params;
    },

    /**
     * Kicks off automatic log sending
     */
    init: function() {
      _setInterval();
    },

    /**
     * Stops automatic log sending and resets queue
     */
    destroy: function() {
      _clearInterval();
      queue = [];
    }
  };

  return api;
});
