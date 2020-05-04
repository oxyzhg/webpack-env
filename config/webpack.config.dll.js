const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const paths = require('./paths');

module.exports = {
  mode: 'production',
  entry: {
    vendor: ['react', 'react-dom', 'antd'],
  },
  output: {
    path: path.resolve(paths.appDist, 'dll'),
    filename: '[name].dll.js',
    library: '[name]_library',
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.resolve(paths.appDist, 'dll', 'vendor-manifest.json'),
      name: '[name]_library',
      context: __dirname,
    }),
    new CopyWebpackPlugin([
      {
        from: paths.appDist,
        to: paths.appDist,
      },
    ]),
  ],
};
