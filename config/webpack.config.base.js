const path = require("path");

const utils = require("./utils");
const nodeExternals = require("webpack-node-externals");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const webpack = require("webpack");

const webpackconfig = {
  target: "node",
  mode:
    process.env.NODE_ENV === "production" || process.env.NODE_ENV === "prod"
      ? "production"
      : "development",
  entry: {
    server: path.join(utils.APP_PATH, "index.js"),
  },
  output: {
    filename: "[name].bundle.js",
    path: utils.DIST_PATH,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: {
          loader: "babel-loader",
        },
        exclude: [path.join(__dirname, "node_modules")], // Correct property
      },
    ],
  },
  externals: [nodeExternals()],
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      // Creating global variables
      "process.env.NODE_ENV": JSON.stringify(
        process.env.NODE_ENV === "production" || process.env.NODE_ENV === "prod"
          ? "production"
          : "development"
      ),
    }),
  ],
  stats: {
    children: false,
    warnings: false,
  },
};

module.exports = webpackconfig;
