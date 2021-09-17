import * as vscode from "vscode";

import { createLogger } from "./logger";
import { launchLanguageServiceWithProgressReport } from "./client";
import { activateWithTelemetryAndErrorHandling } from "./telemetry";
import { createAzExtOutputChannel } from "vscode-azureextensionui";

export async function activate(context: vscode.ExtensionContext): Promise<void> {
  const outputChannel = createAzExtOutputChannel("NaniScript", "naniscript");
  await activateWithTelemetryAndErrorHandling(context, outputChannel,
    async () => {
      createLogger(context, outputChannel);
      await launchLanguageServiceWithProgressReport(context, outputChannel);
    });
}

export function deactivate(): void { }
