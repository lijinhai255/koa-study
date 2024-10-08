const path = require("path");

const utils = require("./utils");
const webpack = require("webpack");
const nodeExcternals = require("webpack-node-externals");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const webpackconfig = {
  target: "node",
  entry: {
    server: path.join(utils.APP_PATH, "index.js"),
  },
  resolve: {
    ...utils.getWebpackResolveConfig(),
  },
  output: {
    filename: "[name].bundle.js",
    path: utils.DIST_PATH,
    libraryTarget: "commonjs2", // Ensure output is in CommonJS format
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: {
          loader: "babel-loader",
        },
        exclude: [path.join(__dirname, "/node_modules")],
      },
    ],
  },
  externals: [nodeExcternals()],
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.EnvironmentPlugin(["NODE_ENV"]),
  ],
  node: {
    global: true,
    __filename: true,
    __dirname: true,
  },
};

// console.log(webpackconfig)

module.exports = webpackconfig;
