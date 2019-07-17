const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.l?js$/,
        include: [path.resolve(__dirname, 'src/pkg')],
        use: {
          loader: 'babel-loader',
          options: {},
        },
      },
    ],
  },
}
