// noinspection JSUnusedGlobalSymbols

import * as vsc from "vscode";
import * as editor from "../../WebEditor/dist/naninovel-editor";

export async function activate(context: vsc.ExtensionContext) {
    const channel = vsc.window.createOutputChannel("NaniScript");
}

export function deactivate() { }
