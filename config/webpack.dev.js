const webapck = require('webpack');
const { smart } = require('webpack-merge');

const webpackConfig = require('./webpack.config.js');

module.exports = smart(webpackConfig, {
  mode: 'development',
  devServer: {
    port: 7001,
    progress: false,
    compress: true,
    contentBase: '../dist/',
    open: false,
    hot: true
  },
  plugins:[
    new webapck.HotModuleReplacementPlugin()
  ],
  devtool: 'source-map',
  watch: true,
  watchOptions: {
    poll: 1000,
    aggregateTimeout: 500, // debounce
    ignored: /node_modules/
  }
});
