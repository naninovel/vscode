import vscode from "vscode";
import * as winston from "winston";
import { format } from "logform";
import Transport from "winston-transport";
import { MESSAGE } from "triple-beam";

export interface Logger extends vscode.Disposable {
    debug(message: string): void;
    info(message: string): void;
    warn(message: string): void;
    error(message: string): void;
    error(error: Error): void;
}

export type LogLevel = keyof Logger;

let logger: Logger | undefined;

export class WinstonLogger implements Logger {
    private readonly logger: winston.Logger;
    private disposed = false;

    constructor(outputChannel: vscode.OutputChannel, logLevel: LogLevel) {
        this.logger = winston.createLogger({
            level: logLevel,
            format: format.combine(
                format.timestamp(),
                format.errors({ stack: true }),
                format.printf((entry) =>
                    entry.stack
                        ? `${entry.timestamp} ${entry.level}: ${entry.message} - ${entry.stack}`
                        : `${entry.timestamp} ${entry.level}: ${entry.message}`
                )
            ),
            transports: [new OutputChannelTransport(outputChannel)]
        });
    }

    dispose(): void {
        if (!this.disposed) {
            this.logger.clear();
            this.logger.close();
            this.disposed = true;
        }
    }

    debug(message: string): void {
        this.logger.log("debug", message);
    }

    info(message: string): void {
        this.logger.log("info", message);
    }

    warn(message: string): void {
        this.logger.log("warn", message);
    }

    error(message: string | Error): void {
        this.logger.log("error", message);
    }
}

class OutputChannelTransport extends Transport {
    constructor(private readonly outputChannel: vscode.OutputChannel) {
        super();
    }

    public log(entry: { [MESSAGE]: string }, next: () => void) {
        setImmediate(() => this.outputChannel.appendLine(entry[MESSAGE]));
        next();
    }
}

export function createLogger(
    context: vscode.ExtensionContext,
    outputChannel: vscode.OutputChannel): Logger {
    const winstonLogger = new WinstonLogger(outputChannel, "debug");
    logger = winstonLogger;
    logger.info("Current log level: debug.");
    context.subscriptions.push(winstonLogger);
    return logger;
}

export function getLogger(): Logger {
    if (!logger) throw new Error("Logger is undefined. Make sure to call createLogger() first.");
    return logger;
}

export function resetLogger(): void {
    logger = undefined;
}
