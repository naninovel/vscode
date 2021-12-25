// noinspection JSUnusedGlobalSymbols

import { window, ProgressLocation, Uri, ExtensionContext } from "vscode";
import { bootEditor } from "naninovel-editor";
import { bootLanguage } from "./language";
import { bootBridging } from "./bridging";

export async function activate(context: ExtensionContext) {
    await window.withProgress({
        title: `Launching Naninovel services...`,
        location: ProgressLocation.Notification
    }, () => bootServices(context));
}

async function bootServices(context: ExtensionContext) {
    const channel = window.createOutputChannel("Naninovel");
    const workerUri = Uri.joinPath(context.extensionUri, "dist/worker.js");
    const worker = await bootEditor(workerUri.toString(), channel.appendLine);
    await bootLanguage(context, channel, worker);
    await bootBridging(context);
}
