import * as vscode from "vscode";
import {
  registerUIExtensionVariables,
  AzureUserInput,
  callWithTelemetryAndErrorHandling,
  IActionContext,
  IAzExtOutputChannel,
} from "vscode-azureextensionui";

export async function activateWithTelemetryAndErrorHandling(
  context: vscode.ExtensionContext,
  outputChannel: IAzExtOutputChannel,
  activateCallback: () => Promise<void>
): Promise<void> {
  const startTime = Date.now();
  registerUIExtensionVariables({
    context,
    outputChannel,
    ui: new AzureUserInput(context.globalState),
  });

  await callWithTelemetryAndErrorHandling(
    "naniscript.activate",
    async (activateContext: IActionContext) => {
      activateContext.telemetry.properties.isActivationEvent = "true";

      await activateCallback();

      activateContext.telemetry.measurements.extensionLoad =
        (Date.now() - startTime) / 1000;
    }
  );
}
