export declare const NODE_ENV: string;
export declare const PORT: string | number;
export declare const MONGODB_URI: string;
export declare const REDIS_URL: string;
export declare const JWT_SECRET: string;
export declare const JWT_EXPIRES_IN: string;
export declare const API_VERSION = "v1";
export declare const API_BASE_URL = "/api/v1";
export declare const RATE_LIMIT_WINDOW_MS: number;
export declare const RATE_LIMIT_MAX_REQUESTS = 100;
export declare const DEFAULT_PAGE_SIZE = 20;
export declare const MAX_PAGE_SIZE = 100;
export declare const MAX_FILE_SIZE: number;
export declare const ALLOWED_FILE_TYPES: string[];
export declare const CACHE_TTL: {
    SHORT: number;
    MEDIUM: number;
    LONG: number;
    VERY_LONG: number;
};
export declare const AGENT_CONFIG: {
    MAX_CONCURRENT_TASKS: number;
    TASK_TIMEOUT_MS: number;
    RETRY_ATTEMPTS: number;
    RETRY_DELAY_MS: number;
};
export declare const COLLECTIONS: {
    readonly USERS: "users";
    readonly HERBS: "herbs";
    readonly COMPOUNDS: "compounds";
    readonly TARGETS: "targets";
    readonly AGENTS: "agents";
    readonly TASKS: "tasks";
    readonly REFERENCES: "references";
};
export declare const AYURVEDIC_CONCEPTS: {
    readonly RASAS: readonly ["madhura", "amla", "lavana", "katu", "tikta", "kashaya"];
    readonly VIRYNAS: readonly ["ushna", "sheeta"];
    readonly VIPAKAS: readonly ["madhura", "amla", "katu"];
    readonly DOSHAS: readonly ["vata", "pitta", "kapha"];
    readonly GUNAS: readonly ["guru", "laghu", "sheeta", "ushna", "snigdha", "ruksha", "manda", "tikshna", "sthira", "sara", "mridu", "kathina", "vishada", "picchila", "slakshna", "khara", "sthula", "sukshma"];
};
export declare const DRUG_LIKENESS_RANGES: {
    readonly LIPINSKI: {
        readonly MOLECULAR_WEIGHT: {
            readonly min: 0;
            readonly max: 500;
        };
        readonly LOGP: {
            readonly min: -2;
            readonly max: 5;
        };
        readonly HBD: {
            readonly min: 0;
            readonly max: 5;
        };
        readonly HBA: {
            readonly min: 0;
            readonly max: 10;
        };
    };
    readonly VEBER: {
        readonly ROTATABLE_BONDS: {
            readonly min: 0;
            readonly max: 10;
        };
        readonly PSA: {
            readonly min: 0;
            readonly max: 140;
        };
    };
};
export declare const LOG_LEVELS: {
    readonly ERROR: "error";
    readonly WARN: "warn";
    readonly INFO: "info";
    readonly DEBUG: "debug";
};
export declare const HTTP_STATUS: {
    readonly OK: 200;
    readonly CREATED: 201;
    readonly NO_CONTENT: 204;
    readonly BAD_REQUEST: 400;
    readonly UNAUTHORIZED: 401;
    readonly FORBIDDEN: 403;
    readonly NOT_FOUND: 404;
    readonly CONFLICT: 409;
    readonly UNPROCESSABLE_ENTITY: 422;
    readonly TOO_MANY_REQUESTS: 429;
    readonly INTERNAL_SERVER_ERROR: 500;
    readonly SERVICE_UNAVAILABLE: 503;
};
