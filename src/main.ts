import * as vscode from "vscode";
import { createLogger } from "./logger";
import { launchLanguageServiceWithProgressReport } from "./client";
import { createAzExtOutputChannel } from "vscode-azureextensionui";

export async function activate(context: vscode.ExtensionContext): Promise<void> {
  const outputChannel = createAzExtOutputChannel("NaniScript", "naniscript");
  createLogger(context, outputChannel);
  await launchLanguageServiceWithProgressReport(context, outputChannel);
}

export function deactivate(): void { }
