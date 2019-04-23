module.exports = {
  context: __dirname + '/app',
  entry: './index',
  output: {
    path: __dirname + '/public/javascripts',
    filename: 'bundle-index.js'
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['env']
        }
      }
    }]
  }
};
