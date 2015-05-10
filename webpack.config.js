var webpack = require('webpack'),
    path = require('path');

module.exports = {
    entry: {
        app: "./src/entry.js"
    },
    output: {
        path: path.join(__dirname, '/public'),
        publicPath: '/',
        filename: 'bundle.js'
    },
    resolve: {
        modulesDirectories: [
            "web_modules",
            "node_modules",
            "bower_components",
            "styles"
        ]
    },
    module: {
        loaders: [
            {
                test: /\.scss$/,
                loader: "style!css!sass"
            }
        ]
    }
};