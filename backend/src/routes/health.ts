import { Router, Request, Response } from 'express';
import { dbConnection } from '../config/database';
import { createApiResponse } from '@shared/utils';
import { HTTP_STATUS } from '@shared/constants';
import { asyncHandler } from '../middleware';

const router = Router();

interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: Date;
  uptime: number;
  version: string;
  environment: string;
  services: {
    database: {
      status: 'healthy' | 'unhealthy';
      details: unknown;
    };
    memory: {
      used: number;
      total: number;
      percentage: number;
    };
  };
}

/**
 * GET /api/v1/health
 * Health check endpoint
 */
router.get('/health', asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const dbHealth = await dbConnection.healthCheck();
  const memoryUsage = process.memoryUsage();
  const totalMemory = memoryUsage.heapTotal;
  const usedMemory = memoryUsage.heapUsed;
  
  const healthData: HealthCheckResponse = {
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

  const statusCode = healthData.status === 'healthy' ? HTTP_STATUS.OK : HTTP_STATUS.SERVICE_UNAVAILABLE;
  
  res.status(statusCode).json(createApiResponse(
    healthData.status === 'healthy',
    healthData,
    undefined,
    `Service is ${healthData.status}`
  ));
}));

/**
 * GET /api/v1/health/ready
 * Readiness probe for Kubernetes
 */
router.get('/health/ready', asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const dbHealth = await dbConnection.healthCheck();
  
  if (dbHealth.status === 'healthy') {
    res.status(HTTP_STATUS.OK).json(createApiResponse(
      true,
      { ready: true },
      undefined,
      'Service is ready'
    ));
  } else {
    res.status(HTTP_STATUS.SERVICE_UNAVAILABLE).json(createApiResponse(
      false,
      { ready: false },
      'Database connection is unhealthy',
      'Service is not ready'
    ));
  }
}));

/**
 * GET /api/v1/health/live
 * Liveness probe for Kubernetes
 */
router.get('/health/live', (req: Request, res: Response): void => {
  res.status(HTTP_STATUS.OK).json(createApiResponse(
    true,
    { alive: true },
    undefined,
    'Service is alive'
  ));
});

export default router;