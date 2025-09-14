import { NextFunction, Request, Response } from 'express';
import logger from '../utils/logger';

/**
 * Express middleware for logging HTTP requests
 * Logs request details including method, URL, IP, and response time
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now();
  const { method, originalUrl, ip } = req;
  
  // Log the incoming request
  logger.info(`${method} ${originalUrl} - IP: ${ip || 'unknown'}`);
  
  // Capture the original end function
  const originalEnd = res.end;
  
  // Override the end function to log response details
  res.end = function(chunk?: any, encoding?: BufferEncoding | (() => void), cb?: () => void): Response {
    const responseTime = Date.now() - startTime;
    const { statusCode } = res;
    
    // Log the response
    logger.info(`${method} ${originalUrl} - ${statusCode} - ${responseTime}ms`);
    
    // Call the original end function
    return originalEnd.call(this, chunk, encoding as BufferEncoding, cb);
  };
  
  next();
};

export default requestLogger;