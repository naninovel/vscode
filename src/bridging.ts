import { window, workspace, commands, TextDocumentShowOptions, ExtensionContext, Range, Uri } from "vscode";
import { connectToBridgingServer, onPlaybackStatusUpdated, requestGoto } from "naninovel-editor";

export async function bootBridging(context: ExtensionContext) {
    await connectToBridgingServer(41016);
    onPlaybackStatusUpdated(updatePlaybackStatus);
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

function buildScriptUri(scriptName: string): Uri {
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
    requestGoto(scriptName, line);
}

function getFileNameWithoutExtension(path: string) {
    const name = path.split("/").pop()?.split("\\").pop() ?? path;
    return name.substring(0, name.lastIndexOf("."));
}
