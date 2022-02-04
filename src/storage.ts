import { ExtensionContext } from "vscode";
import { Project } from "editor";

const metadataKey = "metadata";
let thisContext: ExtensionContext;

export function bootStorage(context: ExtensionContext) {
    thisContext = context;
}

export function getCachedMetadata(): Project | undefined {
    return thisContext.globalState.get<Project>(metadataKey);
}

export function setCachedMetadata(metadata: Project) {
    thisContext.globalState.update(metadataKey, metadata);
}
