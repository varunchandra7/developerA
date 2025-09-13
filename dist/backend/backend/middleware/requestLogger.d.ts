import { Request, Response, NextFunction } from 'express';
/**
 * Express middleware for logging HTTP requests
 * Logs request details including method, URL, IP, and response time
 */
export declare const requestLogger: (req: Request, res: Response, next: NextFunction) => void;
export default requestLogger;
