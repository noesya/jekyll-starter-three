/* eslint-disable no-undef */
const path = require('path');
// webpack = require('webpack'),
// BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin,
// ImageminWebpWebpackPlugin = require('imagemin-webp-webpack-plugin');

module.exports = [{
    mode: 'development',
    watch: false,
    entry: path.join(__dirname, '_js', 'main'),
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'assets/js')
    },
    module: {
        rules: [
            {
                test: /.js$/,
                exclude: [
                    path.resolve(__dirname, 'node_modules'),
                    path.resolve(__dirname, 'bower_components')
                ],
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    },
    resolve: {
        extensions: ['.json', '.js']
    }
}
];
