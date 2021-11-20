import * as vsc from "vscode";
import * as lsp from "vscode-languageclient/node";
import { resolve } from "path";
import { existsSync } from "fs";
import { registerBridgingEvents } from "./bridging";

const languageId = "naniscript";
const dotnetRuntimeVersion = "6.0";
const packagedServerPath = "server/LanguageServer.dll";

export async function launchClientWithProgressReport(context: vsc.ExtensionContext, channel: vsc.OutputChannel) {
    await vsc.window.withProgress({
        title: "Launching Naninovel extension...",
        location: vsc.ProgressLocation.Notification
    }, async () => await launchClient(context, channel));
}

async function launchClient(context: vsc.ExtensionContext, channel: vsc.OutputChannel) {
    const client = await createClient(context, channel);
    context.subscriptions.push(client.start());
    await client.onReady();
    registerBridgingEvents(client, context);
}

async function createClient(context: vsc.ExtensionContext, channel: vsc.OutputChannel): Promise<lsp.LanguageClient> {
    const dotnetCommandPath = await ensureDotnetRuntimeInstalled();
    const languageServerPath = ensureLanguageServerExists(context);
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
        outputChannel: channel,
        synchronize: { fileEvents: vsc.workspace.createFileSystemWatcher("**/*.nani") }
    };
    return new lsp.LanguageClient(languageId, "NaniScript", serverOptions, clientOptions);
}

async function ensureDotnetRuntimeInstalled(): Promise<string> {
    const result = await vsc.commands.executeCommand<{ dotnetPath: string }>(
        "dotnet.acquire", { version: dotnetRuntimeVersion, requestingExtensionId: "elringus.naninovel" });
    if (!result) throw new Error(`Failed to install .NET runtime v${dotnetRuntimeVersion}.`);
    return resolve(result.dotnetPath);
}

function ensureLanguageServerExists(context: vsc.ExtensionContext): string {
    const languageServerPath = context.asAbsolutePath(packagedServerPath);
    if (!existsSync(languageServerPath))
        throw new Error(`Language server does not exist at '${languageServerPath}'.`);
    return resolve(languageServerPath);
}
