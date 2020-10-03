const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require('path');

module.exports = {
  entry: './client/index.js',
  output: {   // The Webpack build process, after it runs, will make a file in the `build` folder called `bundle.js`.
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
},
  module: {
    rules: [
      {
        test: /\.jsx?$/i, // Allows to transpile JSX
        exclude: /(node_modules)/, // Exclude them from compilation because they are already in JS
        use: {
          loader: 'babel-loader', // package name
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader"
          }
        ]
      },
      {
        test: /.(css|scss)$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader','sass-loader'],
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./client/index.html",
      filename: "./index.html"
    })
  ],
  devServer: {
    publicPath: '/build',
      proxy: {
        '/api': 'http://localhost:3001', // !!!CHECK FOR THE PORTS
      },
  }
};