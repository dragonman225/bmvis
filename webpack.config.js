const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: './src/index.ts',
  devtool: 'inline-source-map',
  target: 'web',
  module: {
    rules: [
      {
        /** .ts and .tsx */
        test: /\.tsx?$/,
        use: 'ts-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js'
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 3000
  },
  plugins: [
    new CopyPlugin([
      {
        from: path.join(__dirname, 'static'),
        to: path.join(__dirname, 'dist')
      }
    ])
  ]
}