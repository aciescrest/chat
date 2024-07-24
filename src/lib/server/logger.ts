import pino from "pino";
import { dev } from "$app/environment";
import { LOG_LEVEL } from "$env/static/private";

let options: pino.LoggerOptions = {};

if (dev) {
	options = {
		transport: {
			target: "pino-pretty",
			options: {
				colorize: true,
			},
		},
	};
}

export const logger = pino({ ...options, level: LOG_LEVEL ?? "info" });
