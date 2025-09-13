// Environment configuration
export const NODE_ENV = process.env['NODE_ENV'] || 'development';
export const PORT = process.env['PORT'] || 3001;
export const MONGODB_URI = process.env['MONGODB_URI'] || 'mongodb://localhost:27017/ayurdiscovery';
export const REDIS_URL = process.env['REDIS_URL'] || 'redis://localhost:6379';
export const JWT_SECRET = process.env['JWT_SECRET'] || 'your-secret-key';
export const JWT_EXPIRES_IN = process.env['JWT_EXPIRES_IN'] || '7d';

// API Configuration
export const API_VERSION = 'v1';
export const API_BASE_URL = `/api/${API_VERSION}`;

// Rate limiting
export const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
export const RATE_LIMIT_MAX_REQUESTS = 100;

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// File upload limits
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

// Cache TTL (Time To Live) in seconds
export const CACHE_TTL = {
  SHORT: 300, // 5 minutes
  MEDIUM: 3600, // 1 hour
  LONG: 86400, // 24 hours
  VERY_LONG: 604800, // 7 days
};

// Agent configuration
export const AGENT_CONFIG = {
  MAX_CONCURRENT_TASKS: 10,
  TASK_TIMEOUT_MS: 300000, // 5 minutes
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY_MS: 1000,
};

// Database collection names
export const COLLECTIONS = {
  USERS: 'users',
  HERBS: 'herbs',
  COMPOUNDS: 'compounds',
  TARGETS: 'targets',
  AGENTS: 'agents',
  TASKS: 'tasks',
  REFERENCES: 'references',
} as const;

// Ayurvedic constants
export const AYURVEDIC_CONCEPTS = {
  RASAS: ['madhura', 'amla', 'lavana', 'katu', 'tikta', 'kashaya'],
  VIRYNAS: ['ushna', 'sheeta'],
  VIPAKAS: ['madhura', 'amla', 'katu'],
  DOSHAS: ['vata', 'pitta', 'kapha'],
  GUNAS: [
    'guru', 'laghu', 'sheeta', 'ushna', 'snigdha', 'ruksha',
    'manda', 'tikshna', 'sthira', 'sara', 'mridu', 'kathina',
    'vishada', 'picchila', 'slakshna', 'khara', 'sthula', 'sukshma'
  ],
} as const;

// Chemical property ranges for drug-likeness
export const DRUG_LIKENESS_RANGES = {
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
} as const;

// Logging levels
export const LOG_LEVELS = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
} as const;

// HTTP status codes
export const HTTP_STATUS = {
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
} as const;