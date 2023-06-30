/* config-overrides.js */
const webpack = require('webpack');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = function override (config, env) {
    console.log('override')
    let loaders = config.resolve
    loaders.fallback = {
        "fs": false,
        "child_process": false,
        "path": require.resolve("path-browserify"),
        "crypto": require.resolve("crypto-browserify"),
        "os": require.resolve("os-browserify/browser"),
        "http": require.resolve("stream-http"),
        "stream": require.resolve("stream-browserify"),
        "util": require.resolve("util/")
    }
    loaders.alias = {
        "os": "os-browserify/browser",
    }

    config.plugins = [
        ...config.plugins,
        new webpack.ProvidePlugin({
            process: "process/browser.js",
        }),
        new NodePolyfillPlugin({
            excludeAliases: ['console'],
        }),
    ]

    return config
}
