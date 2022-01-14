// noinspection JSUnusedGlobalSymbols

import { window, ProgressLocation, ExtensionContext } from "vscode";
import { bootDotNet } from "naninovel-editor";
import { bootLogger } from "./logger";
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
    bootLogger(channel);
    await bootDotNet();
    await bootLanguage(context, channel);
    if (bridgingEnabled) await bootBridging(context);
}
