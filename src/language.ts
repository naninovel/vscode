import { workspace, OutputChannel, ExtensionContext } from "vscode";
import { LanguageClientOptions, Message, Emitter, BaseLanguageClient } from "vscode-languageclient/browser";
import { LanguageMessageReader, LanguageMessageWriter, bootLanguageServer, applyCustomMetadata, loadScriptDocument } from "@naninovel/language";
import { cacheMetadata, loadAllScripts } from "./configuration";
import { getCachedMetadata } from "./storage";

const languageId = "naniscript";
const serverReader = new Emitter<Message>();
const serverWriter = new Emitter<Message>();
const decoder = new TextDecoder("utf-8");

export async function bootLanguage(context: ExtensionContext, channel: OutputChannel) {
    bootLanguageServer(serverReader, serverWriter);
    if (cacheMetadata) applyCachedMetadata();
    const client = new LanguageClient(createClientOptions(channel));
    await client.start();
    if (loadAllScripts) await findAndLoadAllScripts();
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

async function findAndLoadAllScripts() {
    const uris = await workspace.findFiles("*.nani");
    await Promise.all(uris.map(uri => workspace.fs.readFile(uri).then(f => loadScriptDocument(uri.path, decoder.decode(f)))));
}

class LanguageClient extends BaseLanguageClient {
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
