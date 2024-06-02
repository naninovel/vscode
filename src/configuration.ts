import { workspace } from "vscode";

const root = workspace.getConfiguration("naninovel");
if (root == null) throw Error("Failed to access workspace configuration.");

export const bridgingEnabled = root.get<boolean>("bridgingEnabled") ?? true;
export const bridgingPort = root.get<number>("bridgingPort") ?? 41016;
export const updateMetadata = root.get<boolean>("updateMetadata") ?? true;
export const cacheMetadata = root.get<boolean>("cacheMetadata") ?? true;
export const highlightPlayedLines = root.get<boolean>("highlightPlayedLines") ?? true;
export const loadAllScripts = root.get<boolean>("loadAllScripts") ?? true;
export const diagnoseSyntax = root.get<boolean>("diagnoseSyntax") ?? true;
export const diagnoseSemantics = root.get<boolean>("diagnoseSemantics") ?? true;
export const diagnoseNavigation = root.get<boolean>("diagnoseNavigation") ?? true;
export const debounceDelay = root.get<number>("debounceDelay") ?? 500;
