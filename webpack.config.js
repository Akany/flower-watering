const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const WorkboxPlugin = require('workbox-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')

module.exports = {
    entry: {
        app: './app/main.js'
    },
    output: {
        filename: './[name].bundle.js'
    },

    devServer: {
        compress: true,
        port: 3000,
        proxy: {
            '/api': 'http://localhost:3010',
            '/push': 'http://localhost:3010'
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
        new FaviconsWebpackPlugin({
            logo: './app/assets/flower-icon.png'
        }),
        new CleanWebpackPlugin(['dist']),
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
        }),
        new WorkboxPlugin.InjectManifest({
            swSrc: './app/sw.js'
        })
    ]
};