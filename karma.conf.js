/* eslint-env node */

var webpackConfig = require('./webpack.config.js');
var reporters = ['progress'];

// Only run coverage report during `npm test`
if (process.env.npm_lifecycle_event === 'test') {
  webpackConfig.module.postLoaders = [{
    test: /\.js$/,
    exclude: /(test|node_modules)\//,
    loader: 'istanbul-instrumenter'
  }];
  reporters.push('coverage');
}

module.exports = function(config) {
  config.set({

    basePath: __dirname,

    frameworks: ['jasmine-ajax', 'jasmine'],

    files: [
      'node_modules/jquery/dist/jquery.js',
      'node_modules/jasmine-fixture/dist/jasmine-fixture.js',
      'test/index.js',
      { pattern: 'test/fixtures/**/*', included: false },
      { pattern: '**/*.js', included: false }
    ],

    webpack: webpackConfig,

    webpackMiddleware: {
      noInfo: true
    },

    preprocessors: {
      'test/index.js': ['webpack']
    },

    reporters: reporters,

    coverageReporter: {
      type: 'text',
      dir: 'test/coverage/'
    },
    mochaReporter: {
      ignoreSkipped: true
    },
    port: 9876,
    runnerPort: 9100,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['PhantomJS'],
    captureTimeout: 60000,
    singleRun: false
  });
};
