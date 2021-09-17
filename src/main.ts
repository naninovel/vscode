import * as vscode from "vscode";
import { createLogger } from "./logger";
import { launchLanguageServiceWithProgressReport } from "./client";

export async function activate(context: vscode.ExtensionContext): Promise<void> {
  const outputChannel = vscode.window.createOutputChannel("NaniScript");
  createLogger(context, outputChannel);
  await launchLanguageServiceWithProgressReport(context, outputChannel);
}

export function deactivate(): void { }
