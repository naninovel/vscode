import { window, workspace, commands, TextDocumentShowOptions, ExtensionContext, Range, Uri } from "vscode";
import { onPlaybackStatusUpdated, requestGoto, pingWorker } from "naninovel-editor";

let workerRef: Worker;

export function bootBridging(context: ExtensionContext, worker: Worker) {
    workerRef = worker;
    onPlaybackStatusUpdated(worker, updatePlaybackStatus);
    context.subscriptions.push(commands.registerCommand("naninovel.goto", () => goto(worker)));
    pingWorker(workerRef, "Registered goto command.");
}

async function updatePlaybackStatus(status: any) {
    pingWorker(workerRef, "updatePlaybackStatus");
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

function goto(worker: Worker) {
    pingWorker(workerRef, "goto");
    const document = window.activeTextEditor?.document;
    const line = window.activeTextEditor?.selection.active.line;
    if (line == null || document == null) return;
    const scriptName = getFileNameWithoutExtension(document.fileName);
    requestGoto(worker, scriptName, line);
    window.showInformationMessage(`goto: ${scriptName}#${line}`);
}

function getFileNameWithoutExtension(path: string) {
    const name = path.split("/").pop()?.split("\\").pop() ?? path;
    return name.substring(0, name.lastIndexOf("."));
}
