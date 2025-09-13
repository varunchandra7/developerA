import winston from 'winston';
import { NODE_ENV } from '@shared/constants';

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define different colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Tell winston that you want to link the colors defined above to the severity levels
winston.addColors(colors);

// Choose the aspect of your log customizing the log format
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info['timestamp']} ${info['level']}: ${info['message']}`
  )
);

// Define which transports the logger must use to print out messages
const transports = [
  // Allow console logging
  new winston.transports.Console(),
  // Allow file logging for errors
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
  }),
  // Allow file logging for all levels
  new winston.transports.File({ filename: 'logs/all.log' }),
];

// Create the logger instance that has to be exported and used to log messages
const logger = winston.createLogger({
  level: NODE_ENV === 'development' ? 'debug' : 'warn',
  levels,
  format,
  transports,
});

export default logger;