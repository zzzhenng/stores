const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const javascript = {
  test: /\.(js)$/,
  use: {
    loader: 'babel-loader',
    options: { presets: ['env'] },
  },
};

const postcss = {
  loader: 'postcss-loader',
  options: {
    plugins() { return [autoprefixer({ browsers: 'last 3 version' })]; },
  },
};

const styles = {
  test: /\.(scss)$/,
  use: ExtractTextPlugin.extract([
    { loader: 'css-loader', options: { sourceMap: true } },
    postcss,
    { loader: 'sass-loader', options: { sourceMap: true } },
  ]),
};

const uglify = new webpack.optimize.UglifyJsPlugin({ // eslint-disable-line
  compress: { warnings: false },
});

const config = {
  entry: {
    App: './public/javascript/delicious-app.js',
  },
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'public', 'dist'),
    filename: '[name].bundle.js',
  },
  module: {
    rules: [javascript, styles],
  },
  plugins: [
    // output css to a separate file
    new ExtractTextPlugin('style.css'),
    // new UglifyJsPlugin(),
  ],
};

// process.noDeprecation = true;

module.exports = config;
