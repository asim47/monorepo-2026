type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class Logger {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private formatMessage(level: LogLevel, message: string, ..._args: any[]): string {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    return `${prefix} ${message}`;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  info(message: string, ..._args: any[]): void {
    // eslint-disable-next-line no-console
    console.log(this.formatMessage('info', message), ..._args);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  warn(message: string, ...args: any[]): void {
    console.warn(this.formatMessage('warn', message), ...args);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error(message: string, error?: Error | unknown, ...args: any[]): void {
    const errorDetails = error instanceof Error ? error.stack : error;
    console.error(this.formatMessage('error', message), errorDetails, ...args);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  debug(message: string, ..._args: any[]): void {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.debug(this.formatMessage('debug', message), ..._args);
    }
  }
}

export const logger = new Logger();
