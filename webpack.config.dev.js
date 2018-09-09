const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
// const webpack = require('webpack');

var path = require('path');

module.exports = {
  entry: {
    main: './src/index.js',
  },
  output: {
    path: path.resolve(__dirname, 'dev'),
    filename: 'index.js',
  },
  devServer: {
    port: 9000,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  },
  devtool: 'inline-source-map',
  plugins: [
    new CleanWebpackPlugin(['dev']),
    new HtmlWebpackPlugin({
      title: 'Meme Lordz'
    }),
    // new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.js$/,
        // include: path.resolve(__dirname, 'src'),
        exclude: /(node_modules|bower_components|build)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env'],
            plugins: [
              require('babel-plugin-transform-runtime'),
              require('babel-plugin-transform-es2015-arrow-functions'),
              require('babel-plugin-transform-object-rest-spread'),
              require('babel-plugin-transform-class-properties'),
              require('babel-plugin-transform-react-jsx'),
              require('react-hot-loader/babel'),
            ]
          }
        }
      }
    ]
  },
};
