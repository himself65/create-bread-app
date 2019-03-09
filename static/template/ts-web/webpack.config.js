const path = require('path')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')

const isProd = process.env.NODE_ENV === 'production'
const extractCSS = isProd || process.env.TARGET === 'development'

const cssLoaders = [
  // https://github.com/webpack-contrib/mini-css-extract-plugin#user-content-advanced-configuration-example
  // TODO: remove style-loader: https://github.com/webpack-contrib/mini-css-extract-plugin/issues/34
  extractCSS ? MiniCssExtractPlugin.loader : 'style-loader',
  { loader: 'css-loader', options: { sourceMap: !isProd } },
  { loader: 'postcss-loader', options: { sourceMap: !isProd } },
  { loader: 'stylus-loader', options: { sourceMap: !isProd } }
]

module.exports = {
  entry: path.resolve(__dirname, 'src', 'index.ts'),
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/static/'
  },
  mode: isProd ? 'production' : 'development',
  resolve: {
    extensions: ['*', '.js', '.json', '.vue', '.ts']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'happypack/loader?id=ts',
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        use: 'happypack/loader?id=js',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: 'img/[name].[hash:7].[ext]'
            }
          }
        ]
      },
      {
        test: /\.styl(us)?$/,
        use: cssLoaders
      }
    ]
  },
  plugins: [
    new FriendlyErrorsWebpackPlugin(),
    new ForkTsCheckerWebpackPlugin({
      checkSyntacticErrors: true,
      tsconfig: path.resolve(__dirname, '../tsconfig.json')
    })
  ],
  performance: {
    hints: false
  },
  stats: { children: false }
}
