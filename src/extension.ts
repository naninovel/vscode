import { window, ProgressLocation, ExtensionContext } from "vscode";
import backend from "backend";
import { bootLogger } from "./logger";
import { bootStorage } from "./storage";
import { bootLanguage } from "./language";
import { bootBridging } from "./bridging";
import { bridgingEnabled } from "./configuration";

// noinspection JSUnusedGlobalSymbols (invoked by vscode)
export async function activate(context: ExtensionContext) {
    await window.withProgress({
        title: "Launching Naninovel services...",
        location: ProgressLocation.Notification
    }, () => bootServices(context));
}

async function bootServices(context: ExtensionContext) {
    const channel = window.createOutputChannel("Naninovel");
    bootLogger(channel);
    bootStorage(context);
    await backend.boot();
    await bootLanguage(channel);
    if (bridgingEnabled) bootBridging(context);
}
