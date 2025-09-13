import { NextFunction, Request, Response } from 'express';
export interface AppError extends Error {
    statusCode: number;
    isOperational: boolean;
}
export declare class CustomError extends Error implements AppError {
    readonly statusCode: number;
    readonly isOperational: boolean;
    constructor(message: string, statusCode?: number);
}
export declare const errorHandler: (error: AppError, req: Request, res: Response, _next: NextFunction) => void;
export declare const notFoundHandler: (req: Request, res: Response, next: NextFunction) => void;
export declare const asyncHandler: (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => (req: Request, res: Response, next: NextFunction) => void;
