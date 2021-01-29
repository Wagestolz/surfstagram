const path = require("path");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");
if (process.env.NODE_ENV !== "production") {
    // Already set on heroku production
    process.env.API_KEY = require("./secrets.json").API_KEY;
    process.env.OWM_KEY = require("./secrets.json").OWM_KEY;
    process.env.STORMGLASS_KEY = require("./secrets.json").STORMGLASS_KEY;
}

module.exports = () => ({
    entry: [
        "@babel/polyfill",
        path.join(__dirname, "client", "style.css"),
        path.join(__dirname, "client", "src", "start.js"),
    ],
    output: {
        path: path.join(__dirname, "client", "public"),
        filename: "bundle.js",
    },
    performance: {
        hints: false,
    },
    devServer: {
        contentBase: path.join(__dirname, "client", "public"),
        proxy: {
            "/": {
                target: "http://localhost:3001",
            },
            "/socket.io": {
                target: "http://localhost:3001",
                ws: true,
            },
        },
        port: "3000",
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: "babel-loader",
            },
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader"],
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin(),
        new webpack.EnvironmentPlugin(["API_KEY", "OWM_KEY", "STORMGLASS_KEY"]),
        // new webpack.EnvironmentPlugin(["OWM_KEY"]),
    ],
});
