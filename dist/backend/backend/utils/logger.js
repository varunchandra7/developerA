"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../shared/constants");
const winston_1 = __importDefault(require("winston"));
// Simple constants without importing from shared
const LOG_LEVELS = {
    ERROR: 'error',
    WARN: 'warn',
    INFO: 'info',
    DEBUG: 'debug'
};
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
winston_1.default.addColors(colors);
// Choose the aspect of your log customizing the log format
const format = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }), winston_1.default.format.colorize({ all: true }), winston_1.default.format.printf((info) => `${info['timestamp']} ${info['level']}: ${info['message']}`));
// Define which transports the logger must use to print out messages
const transports = [
    // Allow console logging
    new winston_1.default.transports.Console(),
    // Allow file logging for errors
    new winston_1.default.transports.File({
        filename: 'logs/error.log',
        level: 'error',
    }),
    // Allow file logging for all levels
    new winston_1.default.transports.File({ filename: 'logs/all.log' }),
];
// Create the logger instance that has to be exported and used to log messages
const logger = winston_1.default.createLogger({
    level: constants_1.NODE_ENV === 'development' ? 'debug' : 'warn',
    levels,
    format,
    transports,
});
exports.default = logger;
