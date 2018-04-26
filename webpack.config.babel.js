const path = require('path');

export default () => ({
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, './lib'),
    filename: 'dtmf.js',
    libraryTarget: 'this',
    library: 'DTMF'
  },
  module: {
    rules: [{
      test: /\.(js)$/,
      exclude: /(node_modules)/,
      use: 'babel-loader'
    }]
  }
});
