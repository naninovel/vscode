import * as vsc from "vscode";
import * as lsp from "vscode-languageclient/node";
import { parse } from "path";

export function registerBridgingEvents(client: lsp.LanguageClient, context: vsc.ExtensionContext) {
    client.onNotification("naninovel/updatePlaybackStatus", updatePlaybackStatus);
    context.subscriptions.push(vsc.commands.registerCommand("naninovel.goto", () => goto(client)));
}

async function updatePlaybackStatus(scriptName: string, lineIndex: number) {
    if (lineIndex < 0 || scriptName == undefined) return;
    const documentUri = buildScriptUri(scriptName);
    const document = await vsc.workspace.openTextDocument(documentUri);
    const options: vsc.TextDocumentShowOptions = {
        preserveFocus: false,
        preview: true,
        selection: new vsc.Range(lineIndex, 0, lineIndex, Number.MAX_SAFE_INTEGER)
    };
    await vsc.window.showTextDocument(document, options);
}

function buildScriptUri(scriptName: string): vsc.Uri {
    if (vsc.workspace.workspaceFolders == undefined)
        return vsc.Uri.file(`${scriptName}.nani`);
    const rootPath = vsc.workspace.workspaceFolders[0].uri.path;
    return vsc.Uri.file(`${rootPath}/${scriptName}.nani`);
}

function goto(client: lsp.LanguageClient) {
    const document = vsc.window.activeTextEditor?.document;
    const line = vsc.window.activeTextEditor?.selection.active.line;
    if (line == undefined || document == undefined) return;
    const scriptName = parse(document?.fileName).name;
    client.sendNotification("naninovel/goto", [scriptName, line]);
}
