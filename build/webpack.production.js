const webpackMerge = require("webpack-merge");
const baseConfig = require("./webpack.base.js");

module.exports = webpackMerge(baseConfig, {
  mode: "development",
  watch: true,
  output: {
    filename: "[name].[chunkhash:8].js"
  }
});
