import * as vscode from "vscode";
import * as lsp from "vscode-languageclient/node";
import * as path from "path";
import { existsSync } from "fs";
import { getLogger } from "./logger";

const languageId = "naniscript";
const dotnetRuntimeVersion = "3.1";
const extensionId = "Elringus.naninovel";
const packagedServerPath = "server/LanguageServer.dll";

export async function launchLanguageServiceWithProgressReport(
  context: vscode.ExtensionContext,
  outputChannel: vscode.OutputChannel): Promise<void> {
  await vscode.window.withProgress({
    title: "Launching Naninovel language service...",
    location: vscode.ProgressLocation.Notification,
  }, async () => await launchLanguageService(context, outputChannel));
}

async function launchLanguageService(context: vscode.ExtensionContext,
  outputChannel: vscode.OutputChannel): Promise<void> {
  getLogger().info("Launching Naninovel language service...");

  const dotnetCommandPath = await ensureDotnetRuntimeInstalled();
  getLogger().debug(`Found dotnet command at '${dotnetCommandPath}'.`);

  const languageServerPath = ensureLanguageServerExists(context);
  getLogger().debug(`Found language server at '${languageServerPath}'.`);

  const serverExecutable: lsp.Executable = {
    command: dotnetCommandPath,
    args: [languageServerPath]
  };

  const serverOptions: lsp.ServerOptions = {
    run: serverExecutable,
    debug: serverExecutable,
  };

  const clientOptions: lsp.LanguageClientOptions = {
    documentSelector: [{ language: languageId }],
    progressOnInitialization: true,
    outputChannel,
    synchronize: {
      fileEvents: vscode.workspace.createFileSystemWatcher("**/*.nani"),
    },
  };

  const client = new lsp.LanguageClient(
    languageId,
    "NaniScript",
    serverOptions,
    clientOptions
  );

  context.subscriptions.push(client.start());
  getLogger().info("Naninovel language service started.");
  await client.onReady();
  getLogger().info("Naninovel language service ready.");
}

async function ensureDotnetRuntimeInstalled(): Promise<string> {
  const result = await vscode.commands.executeCommand<{ dotnetPath: string }>(
    "dotnet.acquire", { version: dotnetRuntimeVersion, requestingExtensionId: extensionId });
  if (!result) throw new Error(`Failed to install .NET runtime v${dotnetRuntimeVersion}.`);
  return path.resolve(result.dotnetPath);
}

function ensureLanguageServerExists(context: vscode.ExtensionContext): string {
  const languageServerPath = context.asAbsolutePath(packagedServerPath);
  if (!existsSync(languageServerPath))
    throw new Error(`Language server does not exist at '${languageServerPath}'.`);
  return path.resolve(languageServerPath);
}