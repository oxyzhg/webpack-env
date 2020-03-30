const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// 自定义配置
const paths = require('./paths');
const devMode = process.env.NODE_ENV === 'development';

module.exports = {
  entry: {
    main: paths.appIndex
  },
  output: {
    path: paths.appDist,
    filename: 'js/[name].[hash:8].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          'babel-loader', // babel
          'eslint-loader' // eslint
        ],
        exclude: /node_modules/,
        include: paths.appSrc
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: devMode ? 'style-loader' : MiniCssExtractPlugin.loader
          },
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/i, // 图片文件
        use: {
          loader: 'url-loader',
          options: {
            limit: 10240,
            fallback: {
              loader: 'file-loader',
              options: {
                name: 'images/[name].[hash:8].[ext]'
              }
            }
          }
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/, //媒体文件
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10240,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'media/[name].[hash:8].[ext]'
                }
              }
            }
          }
        ]
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10240,
            fallback: {
              loader: 'file-loader',
              options: {
                name: 'fonts/[name].[hash:8].[ext]'
              }
            }
          }
        }
      },
      {
        test: /\.html$/,
        use: 'html-withimg-loader'
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'webpack env',
      filename: 'index.html',
      template: paths.appIndexTemplate,
      hash: true,
      minify: {
        collapseWhitespace: true, // 折叠空白
        removeComments: true, // 删除注释
        removeRedundantAttributes: true, // 删除多余属性
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true // 短文档类型
      }
    }),
    // new MiniCssExtractPlugin({
    //   filename: devMode ? '[name].css' : '[name].[hash:8].css',
    //   chunkFilename: devMode ? '[id].css' : '[id].[hash:8].css'
    // }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    })
  ],
  resolve: {
    alias: {
      '@': paths.appSrc,
      '@components': path.resolve(paths.appSrc, './components')
    },
    extensions: ['*', '.js', 'jsx', '.ts', '.vue', 'json', '.css', '.scss']
  }
};
