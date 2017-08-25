/* eslint-env node */

var webpackConfig = require('./webpack.config.js');
var reporters = ['mocha'];

// Run coverage when `COVERAGE=true` is present in CLI
if (process.env.COVERAGE === 'true') {
  webpackConfig.module.rules.push({
    test: /\.js$/,
    exclude: /(test|node_modules)\//,
    loader: 'istanbul-instrumenter-loader',
    enforce: 'post'
  });
  reporters.push('coverage');
}

module.exports = function(config) {
  config.set({

    basePath: __dirname,

    frameworks: ['jasmine-ajax', 'jasmine'],

    files: [
      'node_modules/babel-polyfill/dist/polyfill.js',
      'node_modules/jquery/dist/jquery.js',
      'node_modules/jquery-simulate/jquery.simulate.js',
      'node_modules/jasmine-fixture/dist/jasmine-fixture.js',
      'node_modules/jasmine-jquery/lib/jasmine-jquery.js',
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
