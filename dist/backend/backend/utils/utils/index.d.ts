import { ApiResponse } from '../types';
/**
 * Creates a standardized API response
 */
export declare function createApiResponse<T>(success: boolean, data?: T, error?: string, message?: string): ApiResponse<T>;
/**
 * Generates a unique request ID
 */
export declare function generateRequestId(): string;
/**
 * Validates email format
 */
export declare function isValidEmail(email: string): boolean;
/**
 * Sanitizes user input by removing potentially harmful characters
 */
export declare function sanitizeInput(input: string): string;
/**
 * Validates MongoDB ObjectId format
 */
export declare function isValidObjectId(id: string): boolean;
/**
 * Calculates pagination metadata
 */
export declare function calculatePagination(page: number, limit: number, total: number): {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
};
/**
 * Delays execution for specified milliseconds
 */
export declare function delay(ms: number): Promise<void>;
/**
 * Retries a function with exponential backoff
 */
export declare function retryWithBackoff<T>(fn: () => Promise<T>, maxRetries?: number, initialDelay?: number): Promise<T>;
/**
 * Safely parses JSON with error handling
 */
export declare function safeJsonParse<T>(jsonString: string, defaultValue: T): T;
/**
 * Formats date to ISO string with timezone
 */
export declare function formatDateToISO(date: Date): string;
/**
 * Checks if a value is empty (null, undefined, empty string, empty array, empty object)
 */
export declare function isEmpty(value: unknown): boolean;
/**
 * Deep clones an object
 */
export declare function deepClone<T>(obj: T): T;
/**
 * Generates a random string of specified length
 */
export declare function generateRandomString(length: number): string;
/**
 * Capitalizes the first letter of a string
 */
export declare function capitalize(str: string): string;
/**
 * Converts camelCase to snake_case
 */
export declare function camelToSnake(str: string): string;
/**
 * Converts snake_case to camelCase
 */
export declare function snakeToCamel(str: string): string;
/**
 * Calculates molecular weight from molecular formula
 */
export declare function calculateMolecularWeight(formula: string): number;
/**
 * Validates SMILES string format (basic validation)
 */
export declare function isValidSmiles(smiles: string): boolean;
