/* eslint-env node */

var hgn = require('@behance/hgn-loader');
var path = require('path');
var pkg = require('./package.json');
var Notifier = require('webpack-notifier');
hgn.prefix = 'template/';

module.exports = {
  externals: { jquery: 'jQuery' },
  devtool: 'eval',
  target: 'web',
  module: {
    rules: [{
      enforce: 'pre',
      test: /(@behance\/fine-uploader).*\.js$/,
      loader: 'imports-loader?jQuery=jquery'
    }]
  },
  resolve: {
    modules: [
      __dirname,
      'node_modules'
    ],
    alias: {
      // local paths
      template: path.join(__dirname, 'template'),

      // vendor
      jqueryui: '@behance/jquery-ui/ui',
      ractive$: 'ractive',

      fixtures: 'test/fixtures',
      mocks: 'test/mocks'
    },
    extensions: ['.js', '.mustache']
  },
  resolveLoader: {
    alias: {
      text$: 'raw-loader',
      'hgn-loader': '@behance/hgn-loader'
    }
  },
  plugins: [
    new Notifier({ title: pkg.name })
  ]
};
