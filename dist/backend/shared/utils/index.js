"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApiResponse = createApiResponse;
exports.generateRequestId = generateRequestId;
exports.isValidEmail = isValidEmail;
exports.sanitizeInput = sanitizeInput;
exports.isValidObjectId = isValidObjectId;
exports.calculatePagination = calculatePagination;
exports.delay = delay;
exports.retryWithBackoff = retryWithBackoff;
exports.safeJsonParse = safeJsonParse;
exports.formatDateToISO = formatDateToISO;
exports.isEmpty = isEmpty;
exports.deepClone = deepClone;
exports.generateRandomString = generateRandomString;
exports.capitalize = capitalize;
exports.camelToSnake = camelToSnake;
exports.snakeToCamel = snakeToCamel;
exports.calculateMolecularWeight = calculateMolecularWeight;
exports.isValidSmiles = isValidSmiles;
/**
 * Creates a standardized API response
 */
function createApiResponse(success, data, error, message) {
    const response = {
        success,
        timestamp: new Date(),
        requestId: generateRequestId(),
    };
    if (data !== undefined) {
        response.data = data;
    }
    if (error !== undefined) {
        response.error = error;
    }
    if (message !== undefined) {
        response.message = message;
    }
    return response;
}
/**
 * Generates a unique request ID
 */
function generateRequestId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
/**
 * Validates email format
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
/**
 * Sanitizes user input by removing potentially harmful characters
 */
function sanitizeInput(input) {
    return input
        .replace(/[<>"']/g, '') // Remove HTML/script injection characters
        .trim();
}
/**
 * Validates MongoDB ObjectId format
 */
function isValidObjectId(id) {
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    return objectIdRegex.test(id);
}
/**
 * Calculates pagination metadata
 */
function calculatePagination(page, limit, total) {
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
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
/**
 * Retries a function with exponential backoff
 */
async function retryWithBackoff(fn, maxRetries = 3, initialDelay = 1000) {
    let lastError;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        }
        catch (error) {
            lastError = error;
            if (attempt === maxRetries) {
                break;
            }
            const delayMs = initialDelay * Math.pow(2, attempt);
            await delay(delayMs);
        }
    }
    throw lastError;
}
/**
 * Safely parses JSON with error handling
 */
function safeJsonParse(jsonString, defaultValue) {
    try {
        return JSON.parse(jsonString);
    }
    catch {
        return defaultValue;
    }
}
/**
 * Formats date to ISO string with timezone
 */
function formatDateToISO(date) {
    return date.toISOString();
}
/**
 * Checks if a value is empty (null, undefined, empty string, empty array, empty object)
 */
function isEmpty(value) {
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
function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}
/**
 * Generates a random string of specified length
 */
function generateRandomString(length) {
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
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
/**
 * Converts camelCase to snake_case
 */
function camelToSnake(str) {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}
/**
 * Converts snake_case to camelCase
 */
function snakeToCamel(str) {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}
/**
 * Calculates molecular weight from molecular formula
 */
function calculateMolecularWeight(formula) {
    // Simplified calculation - in real implementation, use a proper chemistry library
    const atomicWeights = {
        H: 1.008, C: 12.011, N: 14.007, O: 15.999, P: 30.974, S: 32.065,
        F: 18.998, Cl: 35.453, Br: 79.904, I: 126.904,
    };
    let weight = 0;
    const regex = /([A-Z][a-z]?)(\d*)/g;
    let match;
    while ((match = regex.exec(formula)) !== null) {
        const element = match[1];
        const count = parseInt(match[2] || '1', 10);
        const atomicWeight = element ? atomicWeights[element] : undefined;
        if (atomicWeight) {
            weight += atomicWeight * count;
        }
    }
    return Math.round(weight * 1000) / 1000; // Round to 3 decimal places
}
/**
 * Validates SMILES string format (basic validation)
 */
function isValidSmiles(smiles) {
    // Basic SMILES validation - check for valid characters
    const smilesRegex = /^[A-Za-z0-9@+\-[\]()=#\\/.%:]+$/;
    return smilesRegex.test(smiles) && smiles.length > 0;
}
