import { workspace } from "vscode";

const root = workspace.getConfiguration("naninovel");
if (root == null) throw Error("Failed to access workspace configuration.");

export const bridgingEnabled = root.get<boolean>("bridgingEnabled")!;
export const bridgingPort = root.get<number>("bridgingPort")!;
export const updateMetadata = root.get<boolean>("updateMetadata")!;
export const highlightPlayedLines = root.get<boolean>("highlightPlayedLines")!;
