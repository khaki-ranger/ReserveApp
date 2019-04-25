module.exports = {
  context: __dirname + '/app',
  entry: {
    common: './common',
    index: './index',
    mypage: './mypage'
  },
  output: {
    path: __dirname + '/public/javascripts',
    filename: '[name].bundle.js'
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
