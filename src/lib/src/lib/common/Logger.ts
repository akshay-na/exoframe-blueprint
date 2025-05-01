// src/lib/logger.ts
import winston from "winston";
import DailyRotate from "winston-daily-rotate-file";

const { combine, timestamp, errors, json, colorize, printf } = winston.format;

/** Pretty console line for local dev */
const devFormat = printf(({ level, message, timestamp, stack }) => {
  return `[${timestamp}] ${level}: ${stack ?? message}`;
});

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL ?? "info",
  format: combine(
    timestamp(),
    errors({ stack: true }), // <-- show stack trace
    json() // base format, overridden by devFormat below
  ),
  transports: [
    new winston.transports.Console({
      level: process.env.CONSOLE_LOG_LEVEL ?? "debug",
      format: combine(
        colorize(),
        timestamp(),
        errors({ stack: true }),
        devFormat
      ),
    }),
    new DailyRotate({
      filename: "logs/app-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxFiles: "14d",
      level: "info",
    }),
  ],
});
