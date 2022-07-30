const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
module.exports = (env) => {
  return {
    devtool: "eval-source-map",
    entry: "./src/index.ts",
    mode: "development",
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: "ts-loader",
          include: [path.resolve(__dirname, "src")],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "src/index.html",
      }),
      new webpack.DefinePlugin({
        "process.env": {
          exercise: JSON.stringify(Object.keys(env)[1]),
        },
      }),
    ],
    resolve: {
      extensions: [".ts", ".js"],
    },
    devServer: {
      hot: false,
    },
    output: {
      publicPath: "/",
      filename: "bundle.js",
      path: path.resolve(__dirname, "public"),
    },
  };
};
