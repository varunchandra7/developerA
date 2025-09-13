import { HTTP_STATUS } from '@shared/constants';
import { ApiResponse } from '@shared/types';
import { createApiResponse } from '@shared/utils';
import { NextFunction, Request, Response } from 'express';
import logger from '../utils/logger';

export interface AppError extends Error {
  statusCode: number;
  isOperational: boolean;
}

export class CustomError extends Error implements AppError {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const { statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, message } = error;

  logger.error(
    `Error ${statusCode}: ${message} - URL: ${req.originalUrl} - Method: ${req.method} - IP: ${req.ip}`
  );

  const response: ApiResponse<null> = createApiResponse(
    false,
    null,
    message,
    'An error occurred while processing your request'
  );

  res.status(statusCode).json(response);
};

export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
  const error = new CustomError(`Route ${req.originalUrl} not found`, HTTP_STATUS.NOT_FOUND);
  next(error);
};

// Async error wrapper for route handlers
export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};