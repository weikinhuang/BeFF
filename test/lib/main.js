var TEST_REGEXP = /^\/base\/test\/specs\/.*\.js$/i;

var pathToModule = function(path) {
  return path.replace(/^\/base\//, '').replace(/\.js$/, '');
};

var allTestFiles = Object.keys(window.__karma__.files)
.filter(function(file) { return TEST_REGEXP.test(file); })
.map(pathToModule);

require.config({
  // Karma serves files under /base, which is the basePath from your config file
  baseUrl: '/base',

  paths: {
    'jquery': 'bower_components/jquery/dist/jquery',
    'nbd': 'bower_components/nbd',
  },

  // dynamically load all test files
  deps: ['test/lib/es5-shim'].concat(allTestFiles),

  // we have to kickoff jasmine, as it is asynchronous
  callback: window.__karma__.start
});
