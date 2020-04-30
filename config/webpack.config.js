const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const safePostCssParser = require('postcss-safe-parser');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const PreloadWebpackPlugin = require('preload-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const paths = require('./paths');

const isEnvProduction = true;
const isEnvDevelopment = false;
const shouldUseSourceMap = false;
const shouldUseBundleAnalyzer = false;

/**
 * common function to get style loaders
 * @param {object} cssOptions css-loader -> options
 * @param {string} preProcessor 预处理器
 * @returns {array}
 */
const getStyleLoaders = (cssOptions, preProcessor) => {
  const loaders = [
    isEnvDevelopment && require.resolve('style-loader'),
    isEnvProduction && {
      loader: MiniCssExtractPlugin.loader,
      options: {},
    },
    {
      loader: require.resolve('css-loader'),
      options: cssOptions,
    },
    {
      loader: require.resolve('postcss-loader'),
      options: {},
    },
    {
      loader: require.resolve('sass-loader'),
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

module.exports = {
  mode: 'production',
  devtool: isEnvProduction ? (shouldUseSourceMap ? 'source-map' : false) : isEnvProduction && 'cheap-module-source-map',
  entry: {
    main: paths.appIndex,
  },
  output: {
    path: paths.appDist,
    filename: 'static/js/[name].[contenthash:8].js',
  },
  optimization: {
    minimize: isEnvProduction,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          parse: {
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            comparisons: false,
            inline: 2,
          },
          // Added for profiling in devtools
          keep_classnames: false,
          keep_fnames: false,
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true,
          },
        },
        sourceMap: shouldUseSourceMap,
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          parser: safePostCssParser,
          map: shouldUseSourceMap && {
            inline: false,
            annotation: true,
          },
        },
        cssProcessorPluginOptions: {
          preset: [
            'default',
            {
              minifyFontValues: {
                removeQuotes: false,
              },
            },
          ],
        },
      }),
    ],
    splitChunks: {
      chunks: 'all',
      name: false,
    },
    runtimeChunk: {
      name: entrypoint => `runtime-${entrypoint.name}`,
    },
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
        include: paths.appSrc,
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
            include: paths.appSrc,
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
              sourceMaps: shouldUseSourceMap,
              inputSourceMap: shouldUseSourceMap,
            },
          },
          {
            test: /\.css$/,
            use: getStyleLoaders({
              sourceMap: isEnvProduction && shouldUseSourceMap,
              importLoaders: 1,
            }),
            sideEffects: true,
          },
          {
            test: /\.(sa|sc)ss$/,
            use: getStyleLoaders(
              {
                sourceMap: isEnvProduction && shouldUseSourceMap,
                importLoaders: 3,
              },
              'sass-loader'
            ),
            sideEffects: true,
          },
          {
            loader: require.resolve('file-loader'),
            exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
            options: {
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new FriendlyErrorsWebpackPlugin({
      clearConsole: true,
    }),
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appIndexTemplate,

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
    new PreloadWebpackPlugin(),

    isEnvProduction &&
      new MiniCssExtractPlugin({
        filename: 'static/css/[name].[contenthash:8].css',
        chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
      }),

    isEnvDevelopment && new webpack.HotModuleReplacementPlugin(),

    isEnvProduction &&
      new ManifestPlugin({
        fileName: 'asset-manifest.json',
        publicPath: paths.appPublic,
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

    shouldUseBundleAnalyzer && new BundleAnalyzerPlugin(),

    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ].filter(Boolean),

  performance: false,
};
