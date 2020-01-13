const { smart } = require('webpack-merge');
const base = require('./webpack.config.js');

module.exports = smart(base, {
  mode: 'development',
  devServer: {
    port: 7001,
    progress: false,
    contentBase: '../dist/',
    compress: true,
    open: false
  },
  devtool: 'source-map',
  watch: true,
  watchOptions: {
    poll: 1000,
    aggregateTimeout: 500, // debounce
    ignored: /node_modules/
  }
});
