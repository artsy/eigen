const path = require("path");
const webpack = require("webpack");

const {
  OccurenceOrderPlugin,
  includePaths,
  excludePaths
} = require("@storybook/react-native/dist/server/config/utils");

module.exports = {
  devtool: "#inline-source-map", // Otherwise getting errors about e.g. `Relay` not being defined.
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"]
  },
  module: {
    loaders: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loaders: [
          "awesome-typescript-loader?configFileName=./tsconfig.json&silent=true&transpileOnly=true&target=es6&useBabel=true&useCache=true"
        ]
      }
    ]
  },
  plugins: [
    new OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
};
