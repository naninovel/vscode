import { ExtensionContext } from "vscode";
import { ProjectMetadata } from "editor";

const metadataKey = "metadata";
let thisContext: ExtensionContext;

export function bootStorage(context: ExtensionContext) {
    thisContext = context;
}

export function getCachedMetadata(): ProjectMetadata | undefined {
    return thisContext.globalState.get<ProjectMetadata>(metadataKey);
}

export function setCachedMetadata(metadata: ProjectMetadata) {
    thisContext.globalState.update(metadataKey, metadata);
}
