import mongoose from 'mongoose';
import { MONGODB_URI, NODE_ENV } from '@shared/constants';

interface ConnectionOptions {
  maxPoolSize?: number;
  serverSelectionTimeoutMS?: number;
  socketTimeoutMS?: number;
  heartbeatFrequencyMS?: number;
  retryWrites?: boolean;
  w?: string | number;
}

class DatabaseConnection {
  private static instance: DatabaseConnection;
  private isConnected: boolean = false;
  private connectionAttempts: number = 0;
  private maxRetries: number = 5;
  private retryDelay: number = 5000; // 5 seconds

  private constructor() {
    this.setupConnectionHandlers();
  }

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  private setupConnectionHandlers(): void {
    mongoose.connection.on('connected', () => {
      console.log('MongoDB connected successfully');
      this.isConnected = true;
      this.connectionAttempts = 0;
    });

    mongoose.connection.on('error', (error) => {
      console.error('MongoDB connection error:', error);
      this.isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
      this.isConnected = false;
      
      if (NODE_ENV === 'production') {
        this.reconnect();
      }
    });

    // Handle application termination
    process.on('SIGINT', this.gracefulShutdown.bind(this));
    process.on('SIGTERM', this.gracefulShutdown.bind(this));
  }

  private getConnectionOptions(): ConnectionOptions {
    const options: ConnectionOptions = {
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      heartbeatFrequencyMS: 10000, // Send a ping every 10 seconds
      retryWrites: true,
      w: 'majority', // Write concern
    };

    return options;
  }

  public async connect(): Promise<void> {
    if (this.isConnected) {
      console.log('Already connected to MongoDB');
      return;
    }

    try {
      console.log('Connecting to MongoDB...');
      
      const options = this.getConnectionOptions();
      await mongoose.connect(MONGODB_URI, options);
      
      console.log('MongoDB connection established');
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error);
      throw new Error('Database connection failed');
    }
  }

  private async reconnect(): Promise<void> {
    if (this.connectionAttempts >= this.maxRetries) {
      console.error('Max reconnection attempts reached. Giving up.');
      return;
    }

    this.connectionAttempts++;
    console.log(`Attempting to reconnect to MongoDB (attempt ${this.connectionAttempts}/${this.maxRetries})`);

    setTimeout(async () => {
      try {
        await this.connect();
      } catch (error) {
        console.error('Reconnection failed:', error);
        this.reconnect();
      }
    }, this.retryDelay);
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      await mongoose.connection.close();
      console.log('MongoDB connection closed');
    } catch (error) {
      console.error('Error closing MongoDB connection:', error);
    }
  }

  private async gracefulShutdown(): Promise<void> {
    console.log('Received termination signal, closing MongoDB connection gracefully...');
    await this.disconnect();
    process.exit(0);
  }

  public isConnectionHealthy(): boolean {
    return this.isConnected && mongoose.connection.readyState === 1;
  }

  public getConnectionStatus(): {
    isConnected: boolean;
    readyState: string;
    host?: string;
    port?: number;
    name?: string;
  } {
    const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    
    return {
      isConnected: this.isConnected,
      readyState: states[mongoose.connection.readyState] || 'unknown',
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      name: mongoose.connection.name,
    };
  }

  public async healthCheck(): Promise<{
    status: 'healthy' | 'unhealthy';
    timestamp: Date;
    details: {
      connection: boolean;
      ping: number | null;
      error?: string;
    };
  }> {
    const timestamp = new Date();
    
    try {
      if (!this.isConnectionHealthy()) {
        return {
          status: 'unhealthy',
          timestamp,
          details: {
            connection: false,
            ping: null,
            error: 'Database not connected',
          },
        };
      }

      // Ping the database
      const startTime = Date.now();
      await mongoose.connection.db?.admin().ping();
      const pingTime = Date.now() - startTime;

      return {
        status: 'healthy',
        timestamp,
        details: {
          connection: true,
          ping: pingTime,
        },
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        timestamp,
        details: {
          connection: false,
          ping: null,
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      };
    }
  }
}

// Export singleton instance
export const dbConnection = DatabaseConnection.getInstance();

// Export connect function for easy use
export const connectDatabase = (): Promise<void> => dbConnection.connect();