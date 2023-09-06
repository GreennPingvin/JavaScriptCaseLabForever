const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const mode = process.env.NODE_ENV || "development";
const isDev = mode === "development";
const target = isDev ? "web" : "browserslist";
const devtool = isDev ? "source-map" : undefined;

const getFileName = (ext) =>
  isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`;

module.exports = {
  mode,
  target,
  devtool,
  entry: path.resolve(__dirname, "src/ts/index.ts"),
  output: {
    filename: getFileName("js"),
    path: path.resolve(__dirname, "dist"),
    assetModuleFilename: "images/[hash][ext][query]",
    clean: true,
  },
  devServer: {
    port: 3000,
    open: true,
    hot: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src/index.html"),
    }),
    new webpack.ProgressPlugin(),
    new MiniCssExtractPlugin({
      filename: "css/[name].[contenthash].css",
    }),
    new CopyPlugin({
      patterns: [{ from: "src/assets", to: "assets" }],
    }),
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
      {
        test: /\.(c|sc|sa)ss$/i,
        use: [
          isDev ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  [
                    require("postcss-preset-env"),
                    {
                      // Options
                    },
                  ],
                ],
              },
            },
          },
          "sass-loader",
        ],
      },
      {
        test: /\.(png|jpg)/,
        type: "asset/resource",
      },
      {
        test: /\.(woff|woff2|ttf)/,
        type: "asset/resource",
        generator: {
          filename: "fonts/[hash][ext][query]",
        },
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      // {
      // 	test : /\.(?:js|mjs|cjs)$/,
      // 	exclude : /node_modules/,
      // 	use : {
      // 		loader : "babel-loader",
      // 		options : {
      // 			presets : [["@babel/preset-env", { targets : "defaults" }]],
      // 		},
      // 	},
      // },
    ],
  },
  stats: {
    children: true,
  },
};
