const path = require("path");
const rd = require('rd');
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const { PanoramaManifestPlugin, PanoramaTargetPlugin } = require("webpack-panorama");

/** @type {import('webpack').Configuration} */
module.exports = {
    mode: "development",
    context: path.resolve(__dirname, "src"),

    entry: () => {
        const entries = {};
        let index = 0;
        const dir = path.resolve(__dirname, 'src');

        rd.eachFileFilterSync(dir,
            (filename) => path.extname(filename) == '.xml',
            (filename, stats) => {
                entries[index++] = {
                    filename: filename.replace(dir + '\\', '').replace(/\\/gi, '/'),
                    import: '.' + filename.replace(dir, '').replace(/\\/gi, '/')
                };
            });

        return entries;
    },

    output: {
        path: path.resolve(__dirname, "layout/custom_game"),
        publicPath: "file://{resources}/layout/custom_game/",
    },

    resolve: {
        extensions: [".ts", ".tsx", "..."],
        symlinks: false,
    },

    module: {
        rules: [
            { test: /\.xml$/, loader: "webpack-panorama/lib/layout-loader" },
            { test: /\.[jt]sx?$/, issuer: /\.xml$/, loader: "webpack-panorama/lib/entry-loader" },
            { test: /\.tsx?$/, loader: "ts-loader", options: { transpileOnly: true } },
            {
                test: /\.css$/,
                issuer: /\.xml$/,
                loader: "file-loader",
                options: { name: "[path][name].css", esModule: false },
            },
        ],
    },

    plugins: [
        new PanoramaTargetPlugin(),
       
        new ForkTsCheckerWebpackPlugin({
            typescript: {
                configFile: path.resolve(__dirname, "tsconfig.json"),
            },
        }),
    ],
};
