"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTP_STATUS = exports.LOG_LEVELS = exports.DRUG_LIKENESS_RANGES = exports.AYURVEDIC_CONCEPTS = exports.COLLECTIONS = exports.AGENT_CONFIG = exports.CACHE_TTL = exports.ALLOWED_FILE_TYPES = exports.MAX_FILE_SIZE = exports.MAX_PAGE_SIZE = exports.DEFAULT_PAGE_SIZE = exports.RATE_LIMIT_MAX_REQUESTS = exports.RATE_LIMIT_WINDOW_MS = exports.API_BASE_URL = exports.API_VERSION = exports.JWT_EXPIRES_IN = exports.JWT_SECRET = exports.REDIS_URL = exports.MONGODB_URI = exports.PORT = exports.NODE_ENV = void 0;
// Environment configuration
exports.NODE_ENV = process.env['NODE_ENV'] || 'development';
exports.PORT = process.env['PORT'] || 3002;
exports.MONGODB_URI = process.env['MONGODB_URI'] || 'mongodb://localhost:27017/ayurdiscovery';
exports.REDIS_URL = process.env['REDIS_URL'] || 'redis://localhost:6379';
exports.JWT_SECRET = process.env['JWT_SECRET'] || 'your-secret-key';
exports.JWT_EXPIRES_IN = process.env['JWT_EXPIRES_IN'] || '7d';
// API Configuration
exports.API_VERSION = 'v1';
exports.API_BASE_URL = `/api/${exports.API_VERSION}`;
// Rate limiting
exports.RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
exports.RATE_LIMIT_MAX_REQUESTS = 100;
// Pagination defaults
exports.DEFAULT_PAGE_SIZE = 20;
exports.MAX_PAGE_SIZE = 100;
// File upload limits
exports.MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
exports.ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];
// Cache TTL (Time To Live) in seconds
exports.CACHE_TTL = {
    SHORT: 300, // 5 minutes
    MEDIUM: 3600, // 1 hour
    LONG: 86400, // 24 hours
    VERY_LONG: 604800, // 7 days
};
// Agent configuration
exports.AGENT_CONFIG = {
    MAX_CONCURRENT_TASKS: 10,
    TASK_TIMEOUT_MS: 300000, // 5 minutes
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY_MS: 1000,
};
// Database collection names
exports.COLLECTIONS = {
    USERS: 'users',
    HERBS: 'herbs',
    COMPOUNDS: 'compounds',
    TARGETS: 'targets',
    AGENTS: 'agents',
    TASKS: 'tasks',
    REFERENCES: 'references',
};
// Ayurvedic constants
exports.AYURVEDIC_CONCEPTS = {
    RASAS: ['madhura', 'amla', 'lavana', 'katu', 'tikta', 'kashaya'],
    VIRYNAS: ['ushna', 'sheeta'],
    VIPAKAS: ['madhura', 'amla', 'katu'],
    DOSHAS: ['vata', 'pitta', 'kapha'],
    GUNAS: [
        'guru', 'laghu', 'sheeta', 'ushna', 'snigdha', 'ruksha',
        'manda', 'tikshna', 'sthira', 'sara', 'mridu', 'kathina',
        'vishada', 'picchila', 'slakshna', 'khara', 'sthula', 'sukshma'
    ],
};
// Chemical property ranges for drug-likeness
exports.DRUG_LIKENESS_RANGES = {
    LIPINSKI: {
        MOLECULAR_WEIGHT: { min: 0, max: 500 },
        LOGP: { min: -2, max: 5 },
        HBD: { min: 0, max: 5 }, // Hydrogen bond donors
        HBA: { min: 0, max: 10 }, // Hydrogen bond acceptors
    },
    VEBER: {
        ROTATABLE_BONDS: { min: 0, max: 10 },
        PSA: { min: 0, max: 140 }, // Polar surface area
    },
};
// Logging levels
exports.LOG_LEVELS = {
    ERROR: 'error',
    WARN: 'warn',
    INFO: 'info',
    DEBUG: 'debug',
};
// HTTP status codes
exports.HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
};
