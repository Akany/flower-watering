const path = require('path');
const uniqid = require('uniqid');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');

const uid = uniqid();

module.exports = {
    entry: {
        app: './app/main.js',
        sw: './app/sw.js'
    },
    output: {
        filename: './[name].bundle.js'
    },

    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 3000,
        proxy: {
            '/api': 'http://localhost:3010'
        }
    },

    devtool: 'source-map',

    module: {
        rules: [
            { test: /\.css$/, use: ['style-loader', 'css-loader'] }
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            chunks: ['app'],
            meta: {
                viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no'
            }
        }),
        new CleanWebpackPlugin(['dist']),
        new webpack.DefinePlugin({
            SW_VERSION: JSON.stringify(uid)
        }),
        new WebpackPwaManifest({
            name: 'Flower Watering',
            short_name: 'fWatering',
            description: 'Its important!',
            background_color: '#ffffff',
            display: 'standalone',
            start_url: '.',
            icons: [{
              src: path.resolve('app/assets/flower-icon.png'),
              sizes: [36, 48, 72, 96, 144, 192, 512],
              destination: path.join('icons', 'android')
            }]
        })
    ]
};