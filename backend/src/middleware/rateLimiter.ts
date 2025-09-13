import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';
import { RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX_REQUESTS } from '@shared/constants';
import { createApiResponse } from '@shared/utils';
import logger from '../utils/logger';

export const apiLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: RATE_LIMIT_MAX_REQUESTS,
  message: {
    ...createApiResponse(
      false,
      null,
      'Too many requests',
      'You have exceeded the maximum number of requests. Please try again later.'
    ),
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip} - URL: ${req.originalUrl}`);
    res.status(429).json(createApiResponse(
      false,
      null,
      'Too many requests',
      'You have exceeded the maximum number of requests. Please try again later.'
    ));
  },
  skip: (req: Request) => {
    // Skip rate limiting for health checks
    return req.originalUrl === '/api/v1/health';
  },
});

// Stricter rate limiting for authentication endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    ...createApiResponse(
      false,
      null,
      'Too many authentication attempts',
      'Too many authentication attempts from this IP, please try again after 15 minutes.'
    ),
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    logger.warn(`Auth rate limit exceeded for IP: ${req.ip} - URL: ${req.originalUrl}`);
    res.status(429).json(createApiResponse(
      false,
      null,
      'Too many authentication attempts',
      'Too many authentication attempts from this IP, please try again after 15 minutes.'
    ));
  },
});