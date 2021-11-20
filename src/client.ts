import * as vscode from "vscode";
import * as lsp from "vscode-languageclient/node";
import * as path from "path";
import { existsSync } from "fs";
import { getLogger } from "./logger";

const languageId = "naniscript";
const dotnetRuntimeVersion = "6.0";
const extensionId = "Elringus.naninovel";
const packagedServerPath = "server/LanguageServer.dll";
const defaultMetadata = require("./metadata.xml");

export async function launchLanguageServiceWithProgressReport(
    context: vscode.ExtensionContext,
    outputChannel: vscode.OutputChannel): Promise<void> {
    await vscode.window.withProgress({
        title: "Launching Naninovel language service...",
        location: vscode.ProgressLocation.Notification
    }, async () => await launchLanguageService(context, outputChannel));
}

async function launchLanguageService(context: vscode.ExtensionContext,
                                     outputChannel: vscode.OutputChannel): Promise<void> {
    getLogger().info("Launching Naninovel language service...");

    const dotnetCommandPath = await ensureDotnetRuntimeInstalled();
    getLogger().debug(`Found dotnet command at '${dotnetCommandPath}'.`);

    const languageServerPath = ensureLanguageServerExists(context);
    getLogger().debug(`Found language server at '${languageServerPath}'.`);

    const serverExecutable: lsp.Executable = {
        command: dotnetCommandPath,
        args: [languageServerPath]
    };

    const serverOptions: lsp.ServerOptions = {
        run: serverExecutable,
        debug: serverExecutable
    };

    const clientOptions: lsp.LanguageClientOptions = {
        documentSelector: [{ language: languageId }],
        progressOnInitialization: true,
        outputChannel,
        synchronize: {
            fileEvents: vscode.workspace.createFileSystemWatcher("**/*.nani")
        }
    };

    const client = new lsp.LanguageClient(
        languageId,
        "NaniScript",
        serverOptions,
        clientOptions
    );

    context.subscriptions.push(client.start());
    getLogger().info("Naninovel language service started.");
    await client.onReady();

    client.sendNotification("naninovel/initializeMetadata", [defaultMetadata]);

    client.onNotification("naninovel/updatePlaybackStatus", updatePlaybackStatus);
    context.subscriptions.push(vscode.commands.registerCommand("naninovel.goto", () => goto(client)));

    getLogger().info("Naninovel language service ready.");
}

async function ensureDotnetRuntimeInstalled(): Promise<string> {
    const result = await vscode.commands.executeCommand<{ dotnetPath: string }>(
        "dotnet.acquire", { version: dotnetRuntimeVersion, requestingExtensionId: extensionId });
    if (!result) throw new Error(`Failed to install .NET runtime v${dotnetRuntimeVersion}.`);
    return path.resolve(result.dotnetPath);
}

function ensureLanguageServerExists(context: vscode.ExtensionContext): string {
    const languageServerPath = context.asAbsolutePath(packagedServerPath);
    if (!existsSync(languageServerPath))
        throw new Error(`Language server does not exist at '${languageServerPath}'.`);
    return path.resolve(languageServerPath);
}

async function updatePlaybackStatus(scriptName: string, lineIndex: number) {
    if (lineIndex < 0 || scriptName == undefined) return;
    const documentUri = buildScriptUri(scriptName);
    const document = await vscode.workspace.openTextDocument(documentUri);
    const options: vscode.TextDocumentShowOptions = {
        preserveFocus: false,
        preview: true,
        selection: new vscode.Range(lineIndex, 0, lineIndex, Number.MAX_SAFE_INTEGER)
    };
    await vscode.window.showTextDocument(document, options);
}

function buildScriptUri(scriptName: string): vscode.Uri {
    if (vscode.workspace.workspaceFolders == undefined)
        return vscode.Uri.file(`${scriptName}.nani`);
    const rootPath = vscode.workspace.workspaceFolders[0].uri.path;
    return vscode.Uri.file(`${rootPath}/${scriptName}.nani`);
}

function goto(client: lsp.LanguageClient) {
    const document = vscode.window.activeTextEditor?.document;
    const line = vscode.window.activeTextEditor?.selection.active.line;
    if (line == undefined || document == undefined) return;
    const scriptName = path.parse(document?.fileName).name;
    client.sendNotification("naninovel/goto", [scriptName, line]);
}
