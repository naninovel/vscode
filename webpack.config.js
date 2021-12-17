const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    target: "webworker",
    entry: "./src/extension.ts",
    resolve: {
        extensions: [".ts", ".js"],
        mainFields: ["browser", "module", "main"],
        fallback: { path: require.resolve("path-browserify") }
    },
    output: {
        filename: "extension.js",
        library: { type: "commonjs" },
        clean: true
    },
    plugins: [
        new CopyPlugin({ patterns: [{ from: "../Editor/dist/worker/naninovel-editor-worker.js", to: "worker.js" }] })
    ],
    module: { rules: [{ test: /\.ts/, loader: "ts-loader" }] },
    externals: { vscode: "commonjs vscode" },
    performance: { hints: false }
};
