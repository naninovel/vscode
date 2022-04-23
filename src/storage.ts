import { ExtensionContext } from "vscode";
import { Metadata } from "bindings";

const metadataKey = "metadata";
let thisContext: ExtensionContext;

export function bootStorage(context: ExtensionContext) {
    thisContext = context;
}

export function getCachedMetadata(): Metadata.Project | undefined {
    return thisContext.globalState.get<Metadata.Project>(metadataKey);
}

export function setCachedMetadata(metadata: Metadata.Project) {
    thisContext.globalState.update(metadataKey, metadata);
}
