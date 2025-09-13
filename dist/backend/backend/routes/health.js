"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("@shared/constants");
const utils_1 = require("@shared/utils");
const express_1 = require("express");
const database_1 = require("../config/database");
const middleware_1 = require("../middleware");
const router = (0, express_1.Router)();
/**
 * GET /api/v1/health
 * Health check endpoint
 */
router.get('/health', (0, middleware_1.asyncHandler)(async (req, res) => {
    const dbHealth = await database_1.dbConnection.healthCheck();
    const memoryUsage = process.memoryUsage();
    const totalMemory = memoryUsage.heapTotal;
    const usedMemory = memoryUsage.heapUsed;
    const healthData = {
        status: dbHealth.status,
        timestamp: new Date(),
        uptime: process.uptime(),
        version: process.env['npm_package_version'] || '1.0.0',
        environment: process.env['NODE_ENV'] || 'development',
        services: {
            database: {
                status: dbHealth.status,
                details: dbHealth.details,
            },
            memory: {
                used: usedMemory,
                total: totalMemory,
                percentage: Math.round((usedMemory / totalMemory) * 100),
            },
        },
    };
    const statusCode = healthData.status === 'healthy' ? constants_1.HTTP_STATUS.OK : constants_1.HTTP_STATUS.SERVICE_UNAVAILABLE;
    res.status(statusCode).json((0, utils_1.createApiResponse)(healthData.status === 'healthy', healthData, undefined, `Service is ${healthData.status}`));
}));
/**
 * GET /api/v1/health/ready
 * Readiness probe for Kubernetes
 */
router.get('/health/ready', (0, middleware_1.asyncHandler)(async (req, res) => {
    const dbHealth = await database_1.dbConnection.healthCheck();
    if (dbHealth.status === 'healthy') {
        res.status(constants_1.HTTP_STATUS.OK).json((0, utils_1.createApiResponse)(true, { ready: true }, undefined, 'Service is ready'));
    }
    else {
        res.status(constants_1.HTTP_STATUS.SERVICE_UNAVAILABLE).json((0, utils_1.createApiResponse)(false, { ready: false }, 'Database connection is unhealthy', 'Service is not ready'));
    }
}));
/**
 * GET /api/v1/health/live
 * Liveness probe for Kubernetes
 */
router.get('/health/live', (req, res) => {
    res.status(constants_1.HTTP_STATUS.OK).json((0, utils_1.createApiResponse)(true, { alive: true }, undefined, 'Service is alive'));
});
exports.default = router;
