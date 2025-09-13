"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = exports.dbConnection = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const constants_1 = require("../utils/constants");
class DatabaseConnection {
    static instance;
    isConnected = false;
    connectionAttempts = 0;
    maxRetries = 5;
    retryDelay = 5000; // 5 seconds
    constructor() {
        this.setupConnectionHandlers();
    }
    static getInstance() {
        if (!DatabaseConnection.instance) {
            DatabaseConnection.instance = new DatabaseConnection();
        }
        return DatabaseConnection.instance;
    }
    setupConnectionHandlers() {
        mongoose_1.default.connection.on('connected', () => {
            console.log('MongoDB connected successfully');
            this.isConnected = true;
            this.connectionAttempts = 0;
        });
        mongoose_1.default.connection.on('error', (error) => {
            console.error('MongoDB connection error:', error);
            this.isConnected = false;
        });
        mongoose_1.default.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
            this.isConnected = false;
            if (constants_1.NODE_ENV === 'production') {
                this.reconnect();
            }
        });
        // Handle application termination
        process.on('SIGINT', this.gracefulShutdown.bind(this));
        process.on('SIGTERM', this.gracefulShutdown.bind(this));
    }
    getConnectionOptions() {
        const options = {
            maxPoolSize: 10, // Maintain up to 10 socket connections
            serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
            heartbeatFrequencyMS: 10000, // Send a ping every 10 seconds
            retryWrites: true,
            w: 'majority', // Write concern
        };
        return options;
    }
    async connect() {
        if (this.isConnected) {
            console.log('Already connected to MongoDB');
            return;
        }
        try {
            console.log('Connecting to MongoDB...');
            const options = this.getConnectionOptions();
            await mongoose_1.default.connect(constants_1.MONGODB_URI, options);
            console.log('MongoDB connection established');
        }
        catch (error) {
            console.error('Failed to connect to MongoDB:', error);
            throw new Error('Database connection failed');
        }
    }
    async reconnect() {
        if (this.connectionAttempts >= this.maxRetries) {
            console.error('Max reconnection attempts reached. Giving up.');
            return;
        }
        this.connectionAttempts++;
        console.log(`Attempting to reconnect to MongoDB (attempt ${this.connectionAttempts}/${this.maxRetries})`);
        setTimeout(async () => {
            try {
                await this.connect();
            }
            catch (error) {
                console.error('Reconnection failed:', error);
                this.reconnect();
            }
        }, this.retryDelay);
    }
    async disconnect() {
        if (!this.isConnected) {
            return;
        }
        try {
            await mongoose_1.default.connection.close();
            console.log('MongoDB connection closed');
        }
        catch (error) {
            console.error('Error closing MongoDB connection:', error);
        }
    }
    async gracefulShutdown() {
        console.log('Received termination signal, closing MongoDB connection gracefully...');
        await this.disconnect();
        process.exit(0);
    }
    isConnectionHealthy() {
        return this.isConnected && mongoose_1.default.connection.readyState === 1;
    }
    getConnectionStatus() {
        const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
        return {
            isConnected: this.isConnected,
            readyState: states[mongoose_1.default.connection.readyState] || 'unknown',
            host: mongoose_1.default.connection.host,
            port: mongoose_1.default.connection.port,
            name: mongoose_1.default.connection.name,
        };
    }
    async healthCheck() {
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
            await mongoose_1.default.connection.db?.admin().ping();
            const pingTime = Date.now() - startTime;
            return {
                status: 'healthy',
                timestamp,
                details: {
                    connection: true,
                    ping: pingTime,
                },
            };
        }
        catch (error) {
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
exports.dbConnection = DatabaseConnection.getInstance();
// Export connect function for easy use
const connectDatabase = () => exports.dbConnection.connect();
exports.connectDatabase = connectDatabase;
