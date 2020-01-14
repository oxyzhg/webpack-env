const { smart } = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const base = require('./webpack.config.js');

module.exports = smart(base, {
  mode: 'production',
  devtool:'cheap-module-source-map',
  plugins: [
    new CleanWebpackPlugin()
    // new MiniCssExtractPlugin({
    //   filename: '[name].[hash:8].css',
    //   chunkFilename: '[id].css'
    // })
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserJSPlugin({}), // 压缩 js
      new OptimizeCSSAssetsPlugin({}) // 压缩 css
    ],
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  }
});
