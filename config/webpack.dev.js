const { smart } = require('webpack-merge');
const base = require('./webpack.config.js');
const webapck = require('webpack');

module.exports = smart(base, {
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
    new Webpack.HotModuleReplacementPlugin()
  ],
  devtool: 'source-map',
  watch: true,
  watchOptions: {
    poll: 1000,
    aggregateTimeout: 500, // debounce
    ignored: /node_modules/
  }
});
