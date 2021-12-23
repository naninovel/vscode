// noinspection JSUnusedGlobalSymbols

import { window, ProgressLocation, Uri, ExtensionContext, OutputChannel } from "vscode";
import { bootLanguage } from "./language";
import { bootBridging } from "./bridging";
import { onWorkerPong } from "naninovel-editor";

export async function activate(context: ExtensionContext) {
    await window.withProgress({
        title: `Launching Naninovel services...`,
        location: ProgressLocation.Notification
    }, async (_, __) => bootServices(context));
}

async function bootServices(context: ExtensionContext) {
    const channel = window.createOutputChannel("Naninovel");
    const worker = bootWorker(context, channel);
    await bootLanguage(context, channel, worker);
    bootBridging(context, worker);
}

function bootWorker(context: ExtensionContext, channel: OutputChannel): Worker {
    const uri = Uri.joinPath(context.extensionUri, "dist/worker.js");
    const worker = new Worker(uri.toString());
    worker.onerror = e => channel.appendLine(`Worker error: ${e.message}`);
    worker.onmessageerror = e => channel.appendLine(`Worker message error: ${e}`);
    onWorkerPong(worker, m => channel.appendLine(m));
    return worker;
}
