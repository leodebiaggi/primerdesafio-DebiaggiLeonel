import winston, { createLogger, format, transports } from 'winston';
import config from '../config.js';

const logLevels = {
  fatal: 0,
  error: 1,
  warning: 2,
  info: 3,
  http: 4,
  debug: 5,
};

winston.addColors({
  fatal: 'red',
  error: 'red',
  warning: 'yellow',
  info: 'blue',
  http: 'cyan',
  debug: 'green',
});

export let logger;

const commonFormats = [
  format.colorize(),
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.printf(({ timestamp, level, message }) => `[${timestamp}] ${level}: ${message}`),
];

if (config.environment === 'production') {
  logger = createLogger({
    levels: logLevels,
    format: format.combine(...commonFormats),
    transports: [
      new transports.Console({ level: 'info' }),
      new transports.File({ filename: '../error.log', level: 'error' }),
    ],
  });
} else {
  logger = createLogger({
    levels: logLevels,
    format: format.combine(...commonFormats),
    transports: [
      new transports.Console({ level: 'debug' }),
    ],
  });
}

export default logger;
