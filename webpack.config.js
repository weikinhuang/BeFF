/* eslint-env node */

var hgn = require('hgn-loader');
var path = require('path');
var pkg = require('./package.json');
var Notifier = require('webpack-notifier');
hgn.prefix = 'template/';

module.exports = {
  externals: { jquery: 'jQuery' },
  devtool: 'eval',
  target: 'web',
  module: {
    preLoaders: [{
      test: /(fine-uploader).*\.js$/,
      loader: 'imports?jQuery=jquery'
    }]
  },
  resolve: {
    root: __dirname,
    alias: {
      // local paths
      template: path.join(__dirname, 'template'),

      // vendor
      fineuploader: 'fine-uploader/dist',
      jqueryui: 'jquery-ui/ui',
      ractive$: 'ractive',

      fixtures: 'test/fixtures',
      mocks: 'test/mocks'
    },
    extensions: ['', '.js', '.mustache']
  },
  resolveLoader: {
    alias: {
      text$: 'raw',
      hgn$: 'hgn'
    }
  },
  plugins: [
    new Notifier({ title: pkg.name })
  ]
};
