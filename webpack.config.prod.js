const webpack = require('webpack');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: {
    main: './src/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': 'production'
    }),
    new UglifyJsPlugin(),
    new webpack.optimize.AggressiveMergingPlugin()
  ],
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src'),
        exclude: /(node_modules|bower_components|build)/,
        loader: 'babel-loader',
        options: {
          presets: ['env'],
          plugins: [
            require('babel-plugin-transform-runtime'),
            require('babel-plugin-transform-es2015-arrow-functions'),
            require('babel-plugin-transform-object-rest-spread'),
            require('babel-plugin-transform-class-properties'),
            require('babel-plugin-transform-react-jsx'),
            require('react-hot-loader/babel')
          ]
        }
      }
    ]
  }
};
