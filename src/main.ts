// noinspection JSUnusedGlobalSymbols

import * as vsc from "vscode";
import { launchClientWithProgressReport } from "./client";

export async function activate(context: vsc.ExtensionContext) {
    const channel = vsc.window.createOutputChannel("NaniScript");
    await launchClientWithProgressReport(context, channel);
}

export function deactivate() { }
