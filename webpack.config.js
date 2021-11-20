module.exports = () => ({
    target: "node",
    entry: "./src/main.ts",
    resolve: { extensions: [".ts", ".js"] },
    module: {
        rules: [
            { test: /\.ts/, loader: "ts-loader" },
            { test: /\.xml/, type: "asset/source" }
        ]
    },
    externals: { vscode: "commonjs vscode" },
    output: {
        filename: "main.js",
        library: { type: "commonjs" },
        clean: true
    }
});
