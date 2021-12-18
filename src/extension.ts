// noinspection JSUnusedGlobalSymbols

import { window, ProgressLocation, Uri, ExtensionContext, OutputChannel, workspace } from "vscode";
import { bootLanguage } from "./language";
import { bootBridging } from "./bridging";
import { onWorkerPong, pingWorker } from "../../Editor";

export async function activate(context: ExtensionContext) {
    await bootServices(context);
    // await window.withProgress({
    //     title: `Launching Naninovel services...`,
    //     location: ProgressLocation.Notification
    // }, async (_, __) => bootServices(context));
}

async function bootServices(context: ExtensionContext) {
    const channel = window.createOutputChannel("Naninovel");
    const worker = bootWorker(context, channel);
    onWorkerPong(worker, m => channel.appendLine(m));
    pingWorker(worker, "Test worker ping.");
    // await bootLanguage(context, channel, worker);
    await bootBridging(context, worker);
}

function bootWorker(context: ExtensionContext, channel: OutputChannel): Worker {
    const uri = Uri.joinPath(context.extensionUri, "dist/worker.js");
    const worker = new Worker(uri.toString());
    worker.onerror = e => channel.appendLine(`Worker fatal error: ${e.message}`);
    worker.onmessageerror = e => channel.appendLine(`Worker message error: ${e}`);
    return worker;
}
