const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: "development",
    devtool: "cheap-module-source-map",
    entry: {
        popup: path.resolve('src', 'popup', 'popup.tsx'),
        background: path.resolve('background.ts'),
    },
    module: {
        rules: [
            {
                use: "ts-loader",
                test: /\.(tsx|ts)$/,
                exclude: /node_modules/
            },
            {
                use: ["style-loader", "css-loader"],
                test: /\.css$/i
            }
        ]
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve('src', 'static'),
                    to: path.resolve('dist')
                },
                {
                    from: path.resolve('src', 'assets'),
                    to: path.resolve('dist')
                }
            ],
        }),
        new HtmlWebpackPlugin({
            title: "Twitch Companion",
            filename: "popup.html",
            chunks: ["popup"]
        })
    ],
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.css']
    },
    output: {
        filename: "[name].js"
    }
}