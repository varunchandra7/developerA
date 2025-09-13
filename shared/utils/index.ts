import { ApiResponse } from '../types';

/**
 * Creates a standardized API response
 */
export function createApiResponse<T>(
  success: boolean,
  data?: T,
  error?: string,
  message?: string
): ApiResponse<T> {
  return {
    success,
    data,
    error,
    message,
    timestamp: new Date(),
    requestId: generateRequestId(),
  };
}

/**
 * Generates a unique request ID
 */
export function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Validates email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Sanitizes user input by removing potentially harmful characters
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>\"']/g, '') // Remove HTML/script injection characters
    .trim();
}

/**
 * Validates MongoDB ObjectId format
 */
export function isValidObjectId(id: string): boolean {
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  return objectIdRegex.test(id);
}

/**
 * Calculates pagination metadata
 */
export function calculatePagination(page: number, limit: number, total: number) {
  const totalPages = Math.ceil(total / limit);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  return {
    page,
    limit,
    total,
    totalPages,
    hasNext,
    hasPrev,
  };
}

/**
 * Delays execution for specified milliseconds
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retries a function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        break;
      }

      const delayMs = initialDelay * Math.pow(2, attempt);
      await delay(delayMs);
    }
  }

  throw lastError!;
}

/**
 * Safely parses JSON with error handling
 */
export function safeJsonParse<T>(jsonString: string, defaultValue: T): T {
  try {
    return JSON.parse(jsonString) as T;
  } catch {
    return defaultValue;
  }
}

/**
 * Formats date to ISO string with timezone
 */
export function formatDateToISO(date: Date): string {
  return date.toISOString();
}

/**
 * Checks if a value is empty (null, undefined, empty string, empty array, empty object)
 */
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) {
    return true;
  }

  if (typeof value === 'string') {
    return value.trim().length === 0;
  }

  if (Array.isArray(value)) {
    return value.length === 0;
  }

  if (typeof value === 'object') {
    return Object.keys(value).length === 0;
  }

  return false;
}

/**
 * Deep clones an object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)) as T;
}

/**
 * Generates a random string of specified length
 */
export function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Capitalizes the first letter of a string
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Converts camelCase to snake_case
 */
export function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

/**
 * Converts snake_case to camelCase
 */
export function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Calculates molecular weight from molecular formula
 */
export function calculateMolecularWeight(formula: string): number {
  // Simplified calculation - in real implementation, use a proper chemistry library
  const atomicWeights: Record<string, number> = {
    H: 1.008, C: 12.011, N: 14.007, O: 15.999, P: 30.974, S: 32.065,
    F: 18.998, Cl: 35.453, Br: 79.904, I: 126.904,
  };

  let weight = 0;
  const regex = /([A-Z][a-z]?)(\d*)/g;
  let match;

  while ((match = regex.exec(formula)) !== null) {
    const element = match[1];
    const count = parseInt(match[2] || '1', 10);
    const atomicWeight = atomicWeights[element];
    
    if (atomicWeight) {
      weight += atomicWeight * count;
    }
  }

  return Math.round(weight * 1000) / 1000; // Round to 3 decimal places
}

/**
 * Validates SMILES string format (basic validation)
 */
export function isValidSmiles(smiles: string): boolean {
  // Basic SMILES validation - check for valid characters
  const smilesRegex = /^[A-Za-z0-9@+\-\[\]()=#\\/.%:]+$/;
  return smilesRegex.test(smiles) && smiles.length > 0;
}