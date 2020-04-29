const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

/**
 * Generate style loaders
 * @param {object} cssOptions css-loader -> options
 * @param {string} preProcessor 预处理器
 * @returns {array}
 */
const getStyleLoaders = (cssOptions, preProcessor) => {
  const loaders = [
    { loader: 'style-loader' },
    {
      loader: 'css-loader',
      options: cssOptions,
    },
    {
      loader: 'postcss-loader',
      options: {},
    },
    {
      loader: 'sass-loader',
    },
  ].filter(Boolean);

  if (preProcessor) {
    loaders.push({
      loader: preProcessor,
      options: {
        sourceMap: true,
      },
    });
  }

  return loaders;
};

const isEnvProduction = true;
const isEnvDevelopment = false;

module.exports = {
  entry: {
    main: path.resolve(__dirname, '../src'),
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'static/js/[name].[contenthash:8].js',
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        parser: { requireEnsure: false },
      },
      {
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        enforce: 'pre',
        use: [
          {
            loader: require.resolve('eslint-loader'),
            options: {
              cache: true,
              formatter: require.resolve('eslint-friendly-formatter'),
              eslintPath: require.resolve('eslint'),
              resolvePluginsRelativeTo: __dirname,
            },
          },
        ],
        include: path.resolve(__dirname, '../src'),
      },
      {
        oneOf: [
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: require.resolve('url-loader'),
            options: {
              limit: 10000,
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
          {
            test: /\.(js|jsx|ts|tsx)$/,
            include: path.resolve(__dirname, '../src'),
            loader: require.resolve('babel-loader'),
            options: {
              cacheDirectory: true,
              cacheCompression: false,
              compact: false,
            },
          },
          {
            test: /\.js$/,
            exclude: /@babel(?:\/|\\{1,2})runtime/,
            loader: require.resolve('babel-loader'),
            options: {
              // babelrc: false,
              // configFile: false,
              // presets: [],
              // plugins: [],
              // compact: false,
              cacheDirectory: true,
              cacheCompression: false,
              sourceMaps: false,
              inputSourceMap: false,
            },
          },
          {
            test: /\.css$/,
            use: [
              { loader: 'style-loader' },
              {
                loader: 'css-loader',
                options: {
                  sourceMap: false,
                  importLoaders: 1,
                },
              },
              {
                loader: 'postcss-loader',
                options: {},
              },
            ],
            sideEffects: true,
          },
          {
            test: /\.(sa|sc)ss$/,
            use: [
              { loader: 'style-loader' },
              {
                loader: 'css-loader',
                options: {
                  sourceMap: false,
                  importLoaders: 1,
                },
              },
              {
                loader: 'postcss-loader',
                options: {},
              },
              {
                loader: 'sass-loader',
                options: {
                  sourceMap: true,
                },
              },
            ],
            sideEffects: true,
          },
          {
            loader: require.resolve('file-loader'),
            exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
            options: {
              name: 'static/media[name].[hash:8].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve(__dirname, '../public/index.html'),

      // Production
      ...(isEnvProduction && {
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
        },
      }),
    }),

    isEnvProduction &&
      new MiniCssExtractPlugin({
        filename: 'static/css/[name].[contenthash:8].css',
        chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
      }),

    isEnvDevelopment && new webpack.HotModuleReplacementPlugin(),

    isEnvProduction &&
      new ManifestPlugin({
        fileName: 'asset-manifest.json',
        publicPath: path.resolve(__dirname, '../dist'),
        generate: (seed, files, entrypoints) => {
          const manifestFiles = files.reduce((manifest, file) => {
            manifest[file.name] = file.path;
            return manifest;
          }, seed);
          const entrypointFiles = entrypoints.main.filter(fileName => !fileName.endsWith('.map'));

          return {
            files: manifestFiles,
            entrypoints: entrypointFiles,
          };
        },
      }),

    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ].filter(Boolean),
  performance: false,
};
