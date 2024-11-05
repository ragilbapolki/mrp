const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const TerserPlugin = require('terser-webpack-plugin');

function resolve(dir) {
  return path.join(__dirname, '/resources/js', dir);
}

const rawArgv = process.argv.slice(2);
const report = rawArgv.includes('--report');

let plugins = [];
if (report) {
  plugins.push(new BundleAnalyzerPlugin({
    openAnalyzer: true,
  }));
}

module.exports = {
  mode: 'production', 
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      '@': resolve(''),
    },
  },
  module: {
    rules: [
      {
        test: /\.svg$/,
        loader: 'svg-sprite-loader',
        include: [resolve('icons')],
        options: {
          symbolId: 'icon-[name]',
        },
      },
    ],
  },
  plugins: plugins,
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
      terserOptions: {
        compress: { drop_console: true }, 
      },
    })],
    splitChunks: {
      chunks: 'all',
    },
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    publicPath: '/', 
    filename: 'js/[name].[contenthash:8].js',
    chunkFilename: 'js/[name].[contenthash:8].js',
  },
};
