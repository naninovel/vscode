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
    module: { rules: [{ test: /\.ts/, loader: "ts-loader" }] },
    externals: { vscode: "commonjs vscode" },
    performance: { hints: false }
};
