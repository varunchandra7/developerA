"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const agents_1 = require("./agents");
const database_1 = require("./config/database");
const middleware_1 = require("./middleware");
const health_1 = __importDefault(require("./routes/health"));
const constants_1 = require("./utils/constants");
const logger_1 = __importDefault(require("./utils/logger"));
class Server {
    app;
    port;
    coordinator;
    constructor() {
        this.app = (0, express_1.default)();
        this.port = constants_1.PORT;
        this.coordinator = new agents_1.AgentCoordinator();
        this.initializeMiddleware();
        this.initializeRoutes();
        this.initializeErrorHandling();
    }
    initializeMiddleware() {
        // Security middleware
        this.app.use((0, helmet_1.default)({
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    styleSrc: ["'self'", "'unsafe-inline'"],
                    scriptSrc: ["'self'"],
                    imgSrc: ["'self'", "data:", "https:"],
                },
            },
            crossOriginEmbedderPolicy: false,
        }));
        // CORS
        this.app.use((0, cors_1.default)(middleware_1.corsOptions));
        // Request logging and ID
        this.app.use(middleware_1.requestId);
        this.app.use(middleware_1.requestLogger);
        // Rate limiting
        this.app.use(middleware_1.apiLimiter);
        // Body parsing middleware
        this.app.use(express_1.default.json({ limit: '10mb' }));
        this.app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
        // Trust proxy for deployment behind load balancers
        this.app.set('trust proxy', 1);
    }
    initializeRoutes() {
        // Health check routes (before API base path)
        this.app.use('/api/v1', health_1.default);
        // API routes will be added here
        // this.app.use(`${API_BASE_URL}/users`, userRoutes);
        // this.app.use(`${API_BASE_URL}/herbs`, herbRoutes);
        // this.app.use(`${API_BASE_URL}/agents`, agentRoutes);
        // Root endpoint
        this.app.get('/', (req, res) => {
            res.json({
                message: 'AyurDiscovery AI Platform API',
                version: '1.0.0',
                environment: constants_1.NODE_ENV,
                documentation: '/api/v1/docs',
                health: '/api/v1/health',
            });
        });
    }
    initializeErrorHandling() {
        // 404 handler (must be after all routes)
        this.app.use(middleware_1.notFoundHandler);
        // Global error handler (must be last)
        this.app.use(middleware_1.errorHandler);
    }
    async start() {
        try {
            // Connect to database
            await (0, database_1.connectDatabase)();
            logger_1.default.info('Database connected successfully');
            // Start server
            this.app.listen(this.port, () => {
                logger_1.default.info(`🚀 AyurDiscovery AI server running on port ${this.port} in ${constants_1.NODE_ENV} mode`);
                logger_1.default.info(`📚 API Documentation: http://localhost:${this.port}/api/v1/docs`);
                logger_1.default.info(`❤️  Health Check: http://localhost:${this.port}/api/v1/health`);
            });
        }
        catch (error) {
            logger_1.default.error('Failed to start server:', error);
            process.exit(1);
        }
    }
    getApp() {
        return this.app;
    }
}
// Create and start server if this file is run directly
if (require.main === module) {
    const server = new Server();
    server.start().catch((error) => {
        logger_1.default.error('Server startup failed:', error);
        process.exit(1);
    });
}
exports.default = Server;
