import { JSLogger } from "backend";
import { OutputChannel } from "vscode";
import { injectLogger } from "@naninovel/common";

let thisChannel: OutputChannel;

export function bootLogger(channel: OutputChannel) {
    thisChannel = channel;
    injectLogger(JSLogger, log);
}

export function log(message: string) {
    thisChannel.appendLine(message);
}
