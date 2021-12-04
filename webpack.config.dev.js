const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CompressionPlugin = require('compression-webpack-plugin');
const env = require('dotenv');
const webpack = require('webpack');
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const ReactRefreshTypeScript = require('react-refresh-typescript');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

env.config();

const PUBLIC_ = /^PUBLIC_/i;

const safeEnv = Object.keys(process.env)
  .filter((key) => PUBLIC_.test(key))
  .reduce((env, key) => {
    env[key] = process.env[key];
    return env;
  }, {});

const stringifiedEnv = (envs) => ({
  'process.browser': true,
  'process.env': Object.keys(envs).reduce((env, key) => {
    env[key] = JSON.stringify(envs[key]);
    return env;
  }, {})
});

const nonReactAppEnvs = {
  NODE_ENV: process.env.NODE_ENV || 'development'
};

const isAnalyze = typeof process.env.BUNDLE_ANALYZE !== 'undefined';
const isProduction = process.env.NODE_ENV === 'production';
const isNetlify = process.env.NETLIFY;

module.exports = {
  mode: isProduction ? 'production' : 'development',
  devtool: isProduction ? 'cheap-module-source-map' : 'source-map',
  entry: {
    main: {
      import: './src/index',
      dependOn: ['shared']
    },
    shared: ['react', 'react-dom']
  },

  output: {
    filename: 'js/[name].bundle.js',
    chunkFilename: 'js/[name].bundle.js',
    path: path.resolve(__dirname, 'dist/'),
    publicPath: '/'
  },
  devServer: {
    hot: true,
    static: {
      directory: path.resolve(__dirname, 'dist/'),
      watch: true,
      publicPath: '/'
    },
    historyApiFallback: true
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },
  resolve: {
    // fallback: {
    //   http: false,
    //   https: false,
    //   stream: false,
    //   crypto: false,
    //   constants: false,
    //   os: false,
    //   path: false,
    //   multicodec: false
    // },
    extensions: ['.tsx', '.ts', '.js'],
    // we need to alias any potential sub-dependencies (libraries require by other modules)
    alias: {
      next: path.resolve(__dirname, 'src/components/nextMock/'),
      '@components': path.resolve(__dirname, 'src/components/'),
      'bn.js': path.resolve(__dirname, './node_modules/bn.js'),
      ethers: path.resolve(__dirname, './node_modules/ethers'),
      'multicodec/src/base-table': 'multicodec/src/base-table.json'
    }
  },
  plugins: [
    // note module (not target) set to es2015 or later (not work with CommonJS currently
    new ReactRefreshPlugin(),
    new CleanWebpackPlugin(),
    new NodePolyfillPlugin(),
    new HtmlWebpackPlugin({
      filename: path.resolve('dist', 'index.html'),
      template: path.resolve('./src', 'index.ejs'),
      favicon: './src/favicon.ico',
      inject: false,
      hash: true
    }),
    new webpack.DefinePlugin(
      stringifiedEnv({ ...safeEnv, ...nonReactAppEnvs })
    ),
    isProduction ? new CompressionPlugin() : () => null,
    isAnalyze ? new BundleAnalyzerPlugin() : () => null
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.[jt]sx?$|json/,
        exclude: /node_modules/,
        use: [
          {
            loader: require.resolve('ts-loader'),
            options: {
              getCustomTransformers: () => ({
                before: [!isProduction && ReactRefreshTypeScript()].filter(
                  Boolean
                )
              }),
              projectReferences: true,
              transpileOnly: !isProduction,
              configFile: !isProduction
                ? 'tsconfig.json'
                : 'tsconfig.build.json'
            }
          }
        ]
      }
    ]
  }
};
