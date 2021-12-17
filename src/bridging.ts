import { window, workspace, commands, TextDocumentShowOptions, ExtensionContext, Range, Uri } from "vscode";
import { onPlaybackStatusUpdated } from "naninovel-editor";

export function bootBridging(context: ExtensionContext, worker: Worker) {
    onPlaybackStatusUpdated(worker, updatePlaybackStatus);
    context.subscriptions.push(commands.registerCommand("naninovel.goto", () => goto(worker)));
}

async function updatePlaybackStatus(status: any) {
    if (status.lineIndex < 0 || status.scriptName == undefined) return;
    const documentUri = buildScriptUri(status.scriptName);
    const document = await workspace.openTextDocument(documentUri);
    const options: TextDocumentShowOptions = {
        preserveFocus: false,
        preview: true,
        selection: new Range(status.lineIndex, 0, status.lineIndex, Number.MAX_SAFE_INTEGER)
    };
    await window.showTextDocument(document, options);
}

function buildScriptUri(scriptName: string): Uri {
    if (workspace.workspaceFolders == undefined)
        return Uri.file(`${scriptName}.nani`);
    const rootPath = workspace.workspaceFolders[0].uri.path;
    return Uri.file(`${rootPath}/${scriptName}.nani`);
}

function goto(worker: Worker) {
    const document = window.activeTextEditor?.document;
    const line = window.activeTextEditor?.selection.active.line;
    if (line == undefined || document == undefined) return;
    window.showInformationMessage(`Goto is not yet implemented (via ${worker})`);
    // const scriptName = parse(document?.fileName).name;
    // client.sendNotification("naninovel/goto", [scriptName, line]);
}
