const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "production",
  entry: {
    devtools: "./src/devtools/devtools.ts",
    popup: "./src/popup/popup.ts",
    panel: "./src/panel/panel.ts",
    settings: "./src/settings/settings.ts",
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "manifest.json", to: "manifest.json" },
        { from: "src/devtools/devtools.html", to: "devtools.html" },
        { from: "src/popup/popup.html", to: "popup.html" },
        { from: "src/panel/panel.html", to: "panel.html" },
        { from: "src/settings/settings.html", to: "settings.html" },
        { from: "src/img", to: "img" },
      ],
    }),
  ],
};
