var webpack = require('webpack');
const path = require('path');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const WebpackMd5Hash = require('webpack-md5-hash');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = {
    // context: path.resolve(__dirname, "app"),
    entry: {'fennix-ui-app':'./fennix-ui-app/main.ts'},
    output: {
        path: path.resolve(__dirname, 'public/js/app'),
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['.js', '.ts']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [
                    {loader: 'awesome-typescript-loader', options: {
                            transpileOnly: true
                        }},
                    {loader: 'angular2-template-loader'}
                    // {loader: 'angular-router-loader'}
                ]
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader",
                        options: {minimize: true}
                    }
                ]
            },
            {
                test: /\.scss$/,
                use: ['raw-loader', MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
            }
        ],
    },
    plugins: [
        // new CleanWebpackPlugin('dist', {}),
        new MiniCssExtractPlugin({
            filename: 'style.css',
        }),
        // new HtmlWebpackPlugin({
        //     inject: false,
        //     hash: true,
        //     template: './src/index.html',
        //     filename: 'index.html'
        // }),
        // new WebpackMd5Hash()
    ]
};