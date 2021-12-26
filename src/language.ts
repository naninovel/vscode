import { workspace, OutputChannel, ExtensionContext } from "vscode";
import { LanguageClientOptions, MessageTransports, Message, CommonLanguageClient, Emitter } from "vscode-languageclient/browser";
import { LanguageMessageReader, LanguageMessageWriter, bootLanguageServer } from "naninovel-editor";

const languageId = "naniscript";
const serverReader = new Emitter<Message>();
const serverWriter = new Emitter<Message>();

export async function bootLanguage(context: ExtensionContext, channel: OutputChannel) {
    bootLanguageServer(serverReader, serverWriter);
    const client = new LanguageClient(createClientOptions(channel));
    context.subscriptions.push(client.start());
    await client.onReady();
}

function createClientOptions(channel: OutputChannel): LanguageClientOptions {
    return {
        documentSelector: [{ language: languageId }],
        initializationOptions: {},
        progressOnInitialization: true,
        outputChannel: channel,
        synchronize: { fileEvents: workspace.createFileSystemWatcher("**/*.nani") }
    };
}

class LanguageClient extends CommonLanguageClient {
    constructor(options: LanguageClientOptions) {
        super(languageId, "NaniScript", options);
    }

    protected createMessageTransports(_encoding: string): Promise<MessageTransports> {
        const clientReader = new LanguageMessageReader(serverWriter);
        const clientWriter = new LanguageMessageWriter(serverReader);
        return Promise.resolve({ reader: clientReader, writer: clientWriter });
    }

    protected getLocale(): string {
        return "en";
    }
}
