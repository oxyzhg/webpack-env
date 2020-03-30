const { smart } = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const webpackConfig = require('./webpack.config.js');
const paths = require('./paths');

module.exports = smart(webpackConfig, {
  mode: 'production',
  plugins: [
    new CopyWebpackPlugin([
      {
        from: paths.appPublic,
        to: paths.appDist
      }
    ]),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
      chunkFilename: 'css/[id].[hash:8].css'
    })
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          parser: {
            ecma: 8
          },
          compress: {
            ecma: 5,
            warnings: false
          },
          output: {
            ecma: 5,
            comments: false
          },
          ie8: false,
          warnings: false
        }
      }), // 压缩 js
      new OptimizeCSSAssetsPlugin({}) // 压缩 css
    ],
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        libs: {
          name: 'chunk-libs',
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          chunks: 'initial' // 只打包初始时依赖的第三方
        },
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
