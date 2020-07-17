require('dotenv').config()
const path = require('path')
const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  mode: (process.env.SERVER_MODE === 'dev' ? 'development' : 'production'),
  devtool: (process.env.SERVER_MODE === 'dev' ? 'inline-source-map' : 'source-map'),
  performance: {
    hints: false
  },
  optimization: {
    minimize: (process.env.SERVER_MODE === 'dev' ? false : true),
    minimizer: [new TerserPlugin({
      sourceMap: true
    })],
  },
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    port: process.env.DEV_PORT,
    host: process.env.DEV_HOST
  },
  entry: {
    app: [
      path.join(__dirname, 'src', 'client', 'app.js')
    ]
  },
  output: {
    path: path.join(__dirname, 'public', 'dist'),
    publicPath: '/dist/',
    filename: 'app.js'
  },
  module: {
    rules: [{
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  'modules': false,
                  'useBuiltIns': 'usage',
                  'targets': '> 0.25%, not dead',
                  'corejs': 3
                }
              ]
            ]
          }
        }]
      },
      {
        test: /\.(scss)$/,
        use: [{
          loader: 'style-loader',
        }, {
          loader: 'css-loader',
        }, {
          loader: 'postcss-loader',
          options: {
            plugins: function() {
              return [
                require('precss'),
                require('autoprefixer')
              ];
            }
          }
        }, {
          loader: 'sass-loader'
        }]
      }
    ]
  },
  resolve: {
    alias: {}
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]
}
