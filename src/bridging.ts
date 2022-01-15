import { window, workspace, commands, TextDocumentShowOptions, ExtensionContext, Range, Uri } from "vscode";
import { Bridging, applyCustomMetadata } from "naninovel-editor";
import { bridgingPort, highlightPlayedLines, updateMetadata, cacheMetadata } from "./configuration";
import { setCachedMetadata } from "./storage";
import { ProjectMetadata } from "../../Editor/bindings/Bindings/bin/dotnet";

export function bootBridging(context: ExtensionContext) {
    Bridging.OnMetadataUpdated = updateMetadata ? cacheAndApplyMetadata : _ => {};
    Bridging.OnPlaybackStatusUpdated = highlightPlayedLines ? updatePlaybackStatus : _ => {};
    Bridging.ConnectToServerInLoop(bridgingPort);
    context.subscriptions.push(commands.registerCommand("naninovel.goto", goto));
}

async function updatePlaybackStatus(status: any) {
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

function cacheAndApplyMetadata(metadata: ProjectMetadata) {
    if (cacheMetadata) setCachedMetadata(metadata);
    applyCustomMetadata(metadata);
}

function buildScriptUri(scriptName: string) {
    if (workspace.workspaceFolders == null)
        return Uri.file(`${scriptName}.nani`);
    const rootPath = workspace.workspaceFolders[0].uri.path;
    return Uri.file(`${rootPath}/${scriptName}.nani`);
}

function goto() {
    const document = window.activeTextEditor?.document;
    const line = window.activeTextEditor?.selection.active.line;
    if (line == null || document == null) return;
    const scriptName = getFileNameWithoutExtension(document.fileName);
    Bridging.RequestGoto(scriptName, line);
}

function getFileNameWithoutExtension(path: string) {
    const name = path.split("/").pop()?.split("\\").pop() ?? path;
    return name.substring(0, name.lastIndexOf("."));
}
