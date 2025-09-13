"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = exports.notFoundHandler = exports.errorHandler = exports.CustomError = void 0;
const constants_1 = require("@shared/constants");
const utils_1 = require("@shared/utils");
const logger_1 = __importDefault(require("../utils/logger"));
class CustomError extends Error {
    statusCode;
    isOperational;
    constructor(message, statusCode = constants_1.HTTP_STATUS.INTERNAL_SERVER_ERROR) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.CustomError = CustomError;
const errorHandler = (error, req, res, _next) => {
    const { statusCode = constants_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, message } = error;
    logger_1.default.error(`Error ${statusCode}: ${message} - URL: ${req.originalUrl} - Method: ${req.method} - IP: ${req.ip}`);
    const response = (0, utils_1.createApiResponse)(false, null, message, 'An error occurred while processing your request');
    res.status(statusCode).json(response);
};
exports.errorHandler = errorHandler;
const notFoundHandler = (req, res, next) => {
    const error = new CustomError(`Route ${req.originalUrl} not found`, constants_1.HTTP_STATUS.NOT_FOUND);
    next(error);
};
exports.notFoundHandler = notFoundHandler;
// Async error wrapper for route handlers
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
