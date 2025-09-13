"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = void 0;
const logger_1 = __importDefault(require("../utils/logger"));
/**
 * Express middleware for logging HTTP requests
 * Logs request details including method, URL, IP, and response time
 */
const requestLogger = (req, res, next) => {
    const startTime = Date.now();
    const { method, originalUrl, ip } = req;
    // Log the incoming request
    logger_1.default.info(`${method} ${originalUrl} - IP: ${ip || 'unknown'}`);
    // Capture the original end function
    const originalEnd = res.end;
    // Override the end function to log response details
    res.end = function (chunk, encoding, cb) {
        const responseTime = Date.now() - startTime;
        const { statusCode } = res;
        // Log the response
        logger_1.default.info(`${method} ${originalUrl} - ${statusCode} - ${responseTime}ms`);
        // Call the original end function
        return originalEnd.call(this, chunk, encoding, cb);
    };
    next();
};
exports.requestLogger = requestLogger;
exports.default = exports.requestLogger;
