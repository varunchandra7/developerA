import { NODE_ENV, PORT } from './utils/constants';
import cors from 'cors';
import express, { Application } from 'express';
import helmet from 'helmet';
import { connectDatabase } from './config/database';
import {
    apiLimiter,
    corsOptions,
    errorHandler,
    notFoundHandler,
    requestId,
    requestLogger
} from './middleware';
import healthRoutes from './routes/health';
import { AgentCoordinator } from './agents';
import logger from './utils/logger';

class Server {
  private app: Application;
  private port: number | string;
  private coordinator: AgentCoordinator;

  constructor() {
    this.app = express();
    this.port = PORT;
    this.coordinator = new AgentCoordinator();
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddleware(): void {
    // Security middleware
    this.app.use(helmet({
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
    this.app.use(cors(corsOptions));

    // Request logging and ID
    this.app.use(requestId);
    this.app.use(requestLogger);

    // Rate limiting
    this.app.use(apiLimiter);

    // Body parsing middleware
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Trust proxy for deployment behind load balancers
    this.app.set('trust proxy', 1);
  }

  private initializeRoutes(): void {
    // Health check routes (before API base path)
    this.app.use('/api/v1', healthRoutes);

    // API routes will be added here
    // this.app.use(`${API_BASE_URL}/users`, userRoutes);
    // this.app.use(`${API_BASE_URL}/herbs`, herbRoutes);
    // this.app.use(`${API_BASE_URL}/agents`, agentRoutes);

    // Root endpoint
    this.app.get('/', (req, res) => {
      res.json({
        message: 'AyurDiscovery AI Platform API',
        version: '1.0.0',
        environment: NODE_ENV,
        documentation: '/api/v1/docs',
        health: '/api/v1/health',
      });
    });
  }

  private initializeErrorHandling(): void {
    // 404 handler (must be after all routes)
    this.app.use(notFoundHandler);

    // Global error handler (must be last)
    this.app.use(errorHandler);
  }

  public async start(): Promise<void> {
    try {
      // Connect to database
      await connectDatabase();
      logger.info('Database connected successfully');

      // Start server
      this.app.listen(this.port, () => {
        logger.info(`🚀 AyurDiscovery AI server running on port ${this.port} in ${NODE_ENV} mode`);
        logger.info(`📚 API Documentation: http://localhost:${this.port}/api/v1/docs`);
        logger.info(`❤️  Health Check: http://localhost:${this.port}/api/v1/health`);
      });
    } catch (error) {
      logger.error('Failed to start server:', error);
      process.exit(1);
    }
  }

  public getApp(): Application {
    return this.app;
  }
}

// Create and start server if this file is run directly
if (require.main === module) {
  const server = new Server();
  server.start().catch((error) => {
    logger.error('Server startup failed:', error);
    process.exit(1);
  });
}

export default Server;