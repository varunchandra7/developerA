"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authLimiter = exports.apiLimiter = void 0;
const constants_1 = require("@shared/constants");
const utils_1 = require("@shared/utils");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const logger_1 = __importDefault(require("../utils/logger"));
exports.apiLimiter = (0, express_rate_limit_1.default)({
    windowMs: constants_1.RATE_LIMIT_WINDOW_MS,
    max: constants_1.RATE_LIMIT_MAX_REQUESTS,
    message: {
        ...(0, utils_1.createApiResponse)(false, null, 'Too many requests', 'You have exceeded the maximum number of requests. Please try again later.'),
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        logger_1.default.warn(`Rate limit exceeded for IP: ${req.ip} - URL: ${req.originalUrl}`);
        res.status(429).json((0, utils_1.createApiResponse)(false, null, 'Too many requests', 'You have exceeded the maximum number of requests. Please try again later.'));
    },
    skip: (req) => {
        // Skip rate limiting for health checks
        return req.originalUrl === '/api/v1/health';
    },
});
// Stricter rate limiting for authentication endpoints
exports.authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: {
        ...(0, utils_1.createApiResponse)(false, null, 'Too many authentication attempts', 'Too many authentication attempts from this IP, please try again after 15 minutes.'),
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        logger_1.default.warn(`Auth rate limit exceeded for IP: ${req.ip} - URL: ${req.originalUrl}`);
        res.status(429).json((0, utils_1.createApiResponse)(false, null, 'Too many authentication attempts', 'Too many authentication attempts from this IP, please try again after 15 minutes.'));
    },
});
