import { workspace, OutputChannel, ExtensionContext } from "vscode";
import { LanguageClientOptions, Message, CommonLanguageClient, Emitter } from "vscode-languageclient/browser";
import { LanguageMessageReader, LanguageMessageWriter, bootLanguageServer, applyCustomMetadata } from "@naninovel/common";
import { cacheMetadata } from "./configuration";
import { getCachedMetadata } from "./storage";

const languageId = "naniscript";
const serverReader = new Emitter<Message>();
const serverWriter = new Emitter<Message>();

export async function bootLanguage(context: ExtensionContext, channel: OutputChannel) {
    bootLanguageServer(serverReader, serverWriter);
    if (cacheMetadata) applyCachedMetadata();
    const client = new LanguageClient(createClientOptions(channel));
    context.subscriptions.push(client.start());
    await client.onReady();
}

function applyCachedMetadata() {
    const cachedMetadata = getCachedMetadata();
    if (cachedMetadata != null)
        applyCustomMetadata(cachedMetadata);
}

function createClientOptions(channel: OutputChannel) {
    return {
        documentSelector: [{ language: languageId }],
        progressOnInitialization: true,
        outputChannel: channel,
        synchronize: { fileEvents: workspace.createFileSystemWatcher("**/*.nani") }
    } as LanguageClientOptions;
}

class LanguageClient extends CommonLanguageClient {
    constructor(options: LanguageClientOptions) {
        super(languageId, "NaniScript", options);
    }

    protected createMessageTransports(encoding: string) {
        const clientReader = new LanguageMessageReader(serverWriter);
        const clientWriter = new LanguageMessageWriter(serverReader);
        return Promise.resolve({ reader: clientReader, writer: clientWriter });
    }

    protected getLocale(): string {
        return "en";
    }
}
