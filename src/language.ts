import { workspace, OutputChannel, ExtensionContext } from "vscode";
import { LanguageClient, LanguageClientOptions } from "vscode-languageclient/browser";

const languageId = "naniscript";

export async function bootLanguage(context: ExtensionContext, channel: OutputChannel, worker: Worker) {
    const options: LanguageClientOptions = {
        documentSelector: [{ language: languageId }],
        initializationOptions: {},
        progressOnInitialization: true,
        outputChannel: channel,
        synchronize: { fileEvents: workspace.createFileSystemWatcher("**/*.nani") }
    };
    const client = new LanguageClient(languageId, "NaniScript", options, worker);
    context.subscriptions.push(client.start());
    await client.onReady();
}
