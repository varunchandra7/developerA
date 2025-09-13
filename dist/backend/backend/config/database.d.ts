declare class DatabaseConnection {
    private static instance;
    private isConnected;
    private connectionAttempts;
    private maxRetries;
    private retryDelay;
    private constructor();
    static getInstance(): DatabaseConnection;
    private setupConnectionHandlers;
    private getConnectionOptions;
    connect(): Promise<void>;
    private reconnect;
    disconnect(): Promise<void>;
    private gracefulShutdown;
    isConnectionHealthy(): boolean;
    getConnectionStatus(): {
        isConnected: boolean;
        readyState: string;
        host?: string;
        port?: number;
        name?: string;
    };
    healthCheck(): Promise<{
        status: 'healthy' | 'unhealthy';
        timestamp: Date;
        details: {
            connection: boolean;
            ping: number | null;
            error?: string;
        };
    }>;
}
export declare const dbConnection: DatabaseConnection;
export declare const connectDatabase: () => Promise<void>;
export {};
