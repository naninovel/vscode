import { ExtensionContext, commands } from "vscode";
import { Metadata } from "backend";

const metadataKey = "metadata";
let thisContext: ExtensionContext;

export function bootStorage(context: ExtensionContext) {
    thisContext = context;
    context.subscriptions.push(commands.registerCommand("naninovel.purge", purgeCachedMetadata));
}

export function getCachedMetadata(): Metadata.Project | undefined {
    return thisContext.globalState.get<Metadata.Project>(metadataKey);
}

export function setCachedMetadata(metadata: Metadata.Project) {
    void thisContext.globalState.update(metadataKey, metadata);
}

function purgeCachedMetadata() {
    void thisContext.globalState.update(metadataKey, {});
}
