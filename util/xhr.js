define(['jquery', 'nbd/Promise'], function($, Promise) {
  'use strict';

  /**
  * Returns a promise wrapping jQuery.ajax()
  * This is so we can get proper error reporting
  */
  return function xhr() {
    var thenable,
        p = new Promise(),
        req = $.ajax.apply($, arguments);

    p.resolve(req);

    thenable = p.thenable();
    thenable.abort = req.abort;
    return thenable;
  };

});
