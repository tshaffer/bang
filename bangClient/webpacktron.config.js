var webpack = require('webpack');

module.exports = {

    entry: './scripts/index.js',
    output: {
        path: './build',
        filename: 'bundletron.js'
    },
    devtool: "source-map",
    target: 'electron',
    plugins: [
        new webpack.IgnorePlugin(/vertx/),
    ],
    module: {
        loaders: [{
            test: /\.jsx?$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
            query: {
                presets: ['react', 'es2015']
            }
        },
            {
        test: /\.json?$/,
        loader: 'json'
        }]
    }
}