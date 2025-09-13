import { Application } from 'express';
declare class Server {
    private app;
    private port;
    private coordinator;
    constructor();
    private initializeMiddleware;
    private initializeRoutes;
    private initializeErrorHandling;
    start(): Promise<void>;
    getApp(): Application;
}
export default Server;
