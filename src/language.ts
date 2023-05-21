import { workspace, OutputChannel, ExtensionContext, Uri } from "vscode";
import { LanguageClientOptions, Message, Emitter, BaseLanguageClient } from "vscode-languageclient/browser";
import { LanguageMessageReader, LanguageMessageWriter, bootLanguageServer, applyCustomMetadata, upsertDocuments, configure } from "@naninovel/language";
import { cacheMetadata, loadAllScripts, diagnoseSyntax, diagnoseSemantics, diagnoseNavigation } from "./configuration";
import { getCachedMetadata } from "./storage";

const languageId = "naniscript";
const serverReader = new Emitter<Message>();
const serverWriter = new Emitter<Message>();
const decoder = new TextDecoder("utf-8");

export async function bootLanguage(context: ExtensionContext, channel: OutputChannel) {
    bootLanguageServer(serverReader, serverWriter);
    configure({ diagnoseSyntax, diagnoseSemantics, diagnoseNavigation });
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
    const scripts: { uri: string, text: string }[] = await Promise.all(uris.map(readScript));
    upsertDocuments(scripts);
}

async function readScript(uri: Uri) {
    return workspace.fs.readFile(uri).then(f => ({ uri: uri.path, text: decoder.decode(f) }));
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
