const path = require('path');

const webpack = require('webpack');
const HtmlWebpackPlugin =require('html-webpack-plugin');

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// const MinifyPlugin = require('babel-minify-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const BUILD_DIR = path.resolve(__dirname, './dist');
const SRC_DIR = path.resolve(__dirname, './src');
const PORT = 8000;

// const process.env['CI_ENVIRONMENT_NAME']
// const BASE_URL = CI_ENVIRONMENT_URL

module.exports = env => {
  const devMode = env.prod !== true;
  console.log('mode', devMode ? 'dev' : 'prod');

  const envConfigName = env.config ? env.config : devMode ? 'dev' : 'test';
  console.log('config', envConfigName);

  const config = require(`./src/common/env/config.${envConfigName}`)
  const constants = {
    'process.env.DEV_MODE': JSON.stringify(devMode),
  };

  for (let [key, val] of Object.entries(config)) {
    constants[`CONFIG.${key}`] = JSON.stringify(val)
  }

  // console.log('constants', constants);

  return {
    entry: path.join(SRC_DIR, 'index.js'),
    optimization: {
      minimizer: [new OptimizeCSSAssetsPlugin({})],
      splitChunks: {
        cacheGroups: {
          default: false,
          vendors: false,
          // vendor chunk
          vendor: {
            // sync + async chunks
            chunks: 'all',
            name: 'vendor',
            // import file path containing node_modules
            test: /node_modules/,
            maxSize: 2097152,
          },
        },
      },
    },
    output: {
      path: BUILD_DIR,
      chunkFilename: `chunk.[chunkhash].js`,
      // filename:`[id].[chunkhash].js`
      filename: 'index.bundle.js',
    },
    mode: devMode ? 'development' : 'production',
    resolve: {
      modules: [SRC_DIR, 'node_modules'],
    },
    devServer: {
      contentBase: SRC_DIR,
      port: PORT,
      host: 'localhost',
    },
    plugins: [
      new webpack.DefinePlugin(constants),
      new CopyWebpackPlugin([{from: './src/assets/img', to: 'assets/img'}]),
      new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en|ru|ky|tr/),

      new HtmlWebpackPlugin({
        template: path.join(SRC_DIR, 'index.html'),
      }),

      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: devMode ? '[name].css' : 'index.[hash].css',
        chunkFilename: devMode ? '[id].css' : 'css.[chunkhash].css',
      }),
      // new MinifyPlugin(),

      new BundleAnalyzerPlugin({analyzerMode: 'static', openAnalyzer: false}),
    ],
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: ['babel-loader'],
        },
        // {
        //   test: /\.(css|scss)$/,
        //   use: [
        //     "style-loader",
        //     "css-loader",
        //     "sass-loader"
        //   ]
        // },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
            'css-loader',
            'sass-loader',
          ],
        },
        {
          test: /\.(jpg|jpeg|png|gif|mp3|svg)$/,
          loaders: ['file-loader'],
        },
        {
          test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'file-loader',
          options: {
            name: './fonts/[name].[hash].[ext]',
          },
        },
      ],
    },
  };
};
