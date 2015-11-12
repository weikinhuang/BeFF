define(function() {
  'use strict';

  return function(services, url, service) {
    url = url.trim();
    url = url.replace(/https?:\/\//, '');
    url = url.replace('www.', '');

    Object.keys(services).forEach(function(key) {
      var domain = services[key].domain;
      var prefix = services[key].prefix;

      if (!(service in services) || key === service) {
        url = url.replace(prefix, '');
        url = url.replace(domain, '');
      }
    });

    return url;
  };
});
