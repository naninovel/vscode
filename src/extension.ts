// noinspection JSUnusedGlobalSymbols

import { window, ProgressLocation, ExtensionContext } from "vscode";
import { bootDotNet, injectLogger } from "naninovel-editor";
import { bootLanguage } from "./language";
import { bootBridging } from "./bridging";
import { bridgingEnabled } from "./configuration";

export async function activate(context: ExtensionContext) {
    await window.withProgress({
        title: `Launching Naninovel services...`,
        location: ProgressLocation.Notification
    }, () => bootServices(context));
}

async function bootServices(context: ExtensionContext) {
    const channel = window.createOutputChannel("Naninovel");
    injectLogger(channel.appendLine);
    await bootDotNet();
    await bootLanguage(context, channel);
    if (bridgingEnabled) await bootBridging(context);
}
