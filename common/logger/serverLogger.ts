import prisma from 'common/prisma/prisma';

interface LoggerStrategy {
	log(level: string, path: string, message: string): Promise<void>;
}

export class Logger {
	constructor(
		private loggerFormatters: LoggerStrategy[],
		private path = ''
	) {}

	to(path: string) {
		return new Logger(this.loggerFormatters, !this.path ? path : `${this.path}:${path}`);
	}

	private async log(level: string, message: (string | number | boolean | object | unknown | Error)[]) {
		for (const logger of this.loggerFormatters) {
			try {
				const stringifiedMessages = JSON.stringify(message.map(this.formatMessage));
				await logger.log(level, this.path, stringifiedMessages);
			} catch (error) {
				console.error(`Error in logger: ${error}. ${JSON.stringify({level, path: this.path, message})}`);
			}
		}
	}

	async info(...message: (string | number | boolean | object | unknown | Error)[]) {
		return this.log('info', message);
	}

	async warn(...message: (string | number | boolean | object | unknown | Error)[]) {
		return this.log('warn', message);
	}

	async error(...message: (string | number | boolean | object | unknown | Error)[]) {
		return this.log('error', message);
	}

	private formatMessage(message: string | number | boolean | object | unknown | Error) {
		if (message instanceof Error) {
			return {message: message.message, stack: message.stack};
		}

		return message;
	}
}

class StdoutLogger implements LoggerStrategy {
	async log(level: string, path: string, message: string) {
		let messageString = `[${new Date().toISOString()}] [${level.toUpperCase()}]`;

		if (path) {
			messageString += ` [${path}]`;
		}

		messageString += ` ${message}`;

		switch (level) {
			case 'info':
				console.info(messageString);
				break;
			case 'warn':
				console.warn(messageString);
				break;
			case 'error':
				console.error(messageString);
				break;
			default:
				// eslint-disable-next-line no-console
				console.log(messageString);
		}
	}
}

class DatabaseLogger implements LoggerStrategy {
	async log(level: string, path: string, message: string) {
		await prisma.server_logs.create({
			data: {
				path,
				level,
				message,
			},
		});
	}
}

const serverLogger = new Logger([new StdoutLogger(), new DatabaseLogger()]);
export default serverLogger;
