import { window, workspace, commands, TextDocumentShowOptions, ExtensionContext, Range, Uri } from "vscode";
import { applyCustomMetadata, Bridging, Metadata } from "editor";
import { bridgingPort, highlightPlayedLines, updateMetadata, cacheMetadata } from "./configuration";
import { setCachedMetadata } from "./storage";

export function bootBridging(context: ExtensionContext) {
    Bridging.OnMetadataUpdated = updateMetadata ? cacheAndApplyMetadata : _ => {};
    Bridging.OnPlaybackStatusUpdated = highlightPlayedLines ? updatePlaybackStatus : _ => {};
    Bridging.ConnectToServerInLoop(bridgingPort);
    context.subscriptions.push(commands.registerCommand("naninovel.goto", goto));
}

function cacheAndApplyMetadata(metadata: Metadata.Project) {
    if (cacheMetadata) setCachedMetadata(metadata);
    applyCustomMetadata(metadata);
}

async function updatePlaybackStatus(status: Bridging.PlaybackStatus) {
    if (!status.playing) return;
    const lineIndex = status.playedSpot.lineIndex;
    const documentUri = buildScriptUri(status.playedSpot.scriptName);
    const document = await workspace.openTextDocument(documentUri);
    const options: TextDocumentShowOptions = {
        preserveFocus: false,
        preview: true,
        selection: new Range(lineIndex, 0, lineIndex, Number.MAX_SAFE_INTEGER)
    };
    await window.showTextDocument(document, options);
}

function goto() {
    const document = window.activeTextEditor?.document;
    const line = window.activeTextEditor?.selection.active.line;
    if (line == null || document == null) return;
    const scriptName = getFileNameWithoutExtension(document.fileName);
    Bridging.RequestGoto(scriptName, line);
}

function buildScriptUri(scriptName: string) {
    if (workspace.workspaceFolders == null)
        return Uri.file(`${scriptName}.nani`);
    const rootPath = workspace.workspaceFolders[0].uri.path;
    return Uri.file(`${rootPath}/${scriptName}.nani`);
}

function getFileNameWithoutExtension(path: string) {
    const name = path.split("/").pop()?.split("\\").pop() ?? path;
    return name.substring(0, name.lastIndexOf("."));
}
