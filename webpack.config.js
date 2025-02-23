const path = require('path');
const TerserPlugin = require('terser-webpack-plugin'); // Minifies JS code
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin'); // Minifies CSS code
const HtmlMinimizerPlugin = require('html-minimizer-webpack-plugin'); // Minifies HTML files
const CopyWebpackPlugin = require('copy-webpack-plugin'); // Copies static assets
const ESLintPlugin = require('eslint-webpack-plugin');
const { HotModuleReplacementPlugin } = require('webpack');

module.exports = (env, argv) => ({
    entry: {
        options: './src/options/options.ts',
        popup: './src/popup/popup.ts'
    },
    output: {
        // Для каждого входа будет сгенерирован свой bundle, который попадёт в соответствующую папку.
        filename: '[name]/bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    devtool: argv.mode === 'development' ? 'source-map' : false,
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
          },
        hot: true, // включение hot reload
        open: false, // автоматически открыть браузер
      },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: 'src/options/*.html', to: 'options/[name][ext]' },
                { from: 'src/options/*.css', to: 'options/[name][ext]' },
                { from: 'src/popup/*.html', to: 'popup/[name][ext]' },
                { from: 'src/popup/*.css', to: 'popup/[name][ext]' },
                { from: 'src/manifest.json', to: 'manifest.json' },
            ]
        }),
        new ESLintPlugin({
            configType: "flat",
            extensions: ["ts"],
            overrideConfigFile: path.resolve(__dirname, "eslint.config.mjs"),
            formatter: "stylish",
        }),
        ...(argv.mode === 'development' ? [new HotModuleReplacementPlugin()] : []),
    ],
    // Optimization settings including code minification
    optimization: {
        minimize: true, // Enable minimization of the output bundle
        minimizer: [
            new TerserPlugin({
                parallel: true, // Use parallel processing to speed up the minification process on multi-core systems
                extractComments: false, // Do not extract comments into a separate file
                terserOptions: {
                    // Terser-specific options
                    compress: {
                        drop_console: true, // Remove all console statements (e.g., console.log) from the output code
                    },
                    mangle: true, // Enable name mangling for variables and functions to reduce the code size
                    format: {
                        comments: false, // Remove all comments from the output code
                    },
                },
            }),
            // Minify CSS using CssMinimizerPlugin with recommended options
            new CssMinimizerPlugin({
                minimizerOptions: {
                    preset: [
                        'default', // Use the default cssnano preset
                        {
                            discardComments: { removeAll: true }, // Remove all comments from CSS files
                        }
                    ],
                },
            }),
            // Minify HTML using HtmlMinimizerPlugin with recommended options
            new HtmlMinimizerPlugin({
                minimizerOptions: {
                    collapseWhitespace: true, // Collapse unnecessary white spaces in HTML
                    removeComments: true, // Remove HTML comments
                    removeRedundantAttributes: false, // Remove attributes when value matches default
                    removeScriptTypeAttributes: true, // Remove type="text/javascript" from script tags
                    removeStyleLinkTypeAttributes: true, // Remove type="text/css" from style and link tags
                    minifyJS: true, // Minify inline JavaScript within HTML
                    minifyCSS: true, // Minify inline CSS within HTML
                },
            }),
        ],
    },
});
