// noinspection JSUnusedGlobalSymbols

import { window, ExtensionContext, ProgressLocation, Uri } from "vscode";
import { bootLanguage } from "./language";
import { bootBridging } from "./bridging";

export async function activate(context: ExtensionContext) {
    const channel = window.createOutputChannel("Naninovel");
    const worker = await withProgress("worker", () => bootWorker(context));
    await withProgress("language", () => bootLanguage(context, channel, worker));
    await withProgress("bridging", () => bootBridging(context, worker));
}

function bootWorker(context: ExtensionContext): Worker {
    const uri = Uri.joinPath(context.extensionUri, "dist/worker.js");
    return new Worker(uri.toString());
}

async function withProgress<T>(title: string, task: () => T): Promise<T> {
    const options = {
        tile: `Launching Naninovel ${title} service...`,
        location: ProgressLocation.Notification
    };
    return window.withProgress(options, task as any);
}
