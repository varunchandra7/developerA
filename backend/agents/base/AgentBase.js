"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentBase = void 0;
const events_1 = require("events");
const types_1 = require("../../../shared/types");
const logger_1 = __importDefault(require("../../utils/logger"));
/**
 * Abstract base class for all agents in the AyurDiscovery AI system
 * Provides common functionality for task processing, error handling, and metrics
 */
class AgentBase extends events_1.EventEmitter {
    constructor(agentId, agentName, agentType, description, capabilities, config = {}) {
        super();
        // Initialize Agent interface properties
        this.id = agentId;
        this.name = agentName;
        this.type = agentType;
        this.description = description;
        this.capabilities = capabilities;
        this.configuration = config;
        this.createdAt = new Date();
        this.updatedAt = new Date();
        // Initialize internal properties
        this.agentId = agentId;
        this.agentName = agentName;
        this.status = types_1.AgentStatus.INACTIVE;
        this.activeTasks = new Map();
        this.config = {
            maxConcurrentTasks: 5,
            timeoutMs: 300000, // 5 minutes
            retryAttempts: 3,
            enableLogging: true,
            ...config,
        };
        this.metrics = {
            totalTasks: 0,
            successfulTasks: 0,
            failedTasks: 0,
            averageExecutionTime: 0,
            accuracy: 0,
            lastExecuted: new Date(),
        };
        this.setupEventHandlers();
    }
    /**
     * Validates input data before processing
     * Override in concrete agents for specific validation logic
     */
    validateInput(input) {
        return !!(input.taskId && input.data);
    }
    /**
     * Post-processes the output before returning
     * Override in concrete agents for specific post-processing logic
     */
    postProcessOutput(output) {
        return output;
    }
    /**
     * Main entry point for task execution
     */
    async executeTask(input) {
        const startTime = Date.now();
        try {
            // Validate input
            if (!this.validateInput(input)) {
                throw new Error('Invalid input data provided');
            }
            // Check if agent can accept more tasks
            if (this.activeTasks.size >= this.config.maxConcurrentTasks) {
                throw new Error('Agent at maximum capacity');
            }
            // Create task record
            const task = {
                id: input.taskId,
                type: 'GENERIC', // Will be overridden by concrete agents
                agentId: this.agentId,
                input: input.data,
                status: types_1.TaskStatus.IN_PROGRESS,
                priority: 'MEDIUM',
                progress: 0,
                startedAt: new Date(),
                metadata: input.metadata || {},
            };
            this.activeTasks.set(input.taskId, task);
            this.emit('taskStarted', { agentId: this.agentId, taskId: input.taskId });
            if (this.config.enableLogging) {
                logger_1.default.info(`Agent ${this.agentName} started task ${input.taskId}`);
            }
            // Execute the task with timeout
            const output = await this.executeWithTimeout(input);
            // Post-process output
            const finalOutput = this.postProcessOutput(output);
            // Update metrics and status
            const executionTime = Date.now() - startTime;
            this.updateMetricsOnSuccess(executionTime);
            // Update task status
            task.status = types_1.TaskStatus.COMPLETED;
            task.completedAt = new Date();
            task.output = finalOutput.result;
            task.progress = 100;
            this.activeTasks.delete(input.taskId);
            this.emit('taskCompleted', {
                agentId: this.agentId,
                taskId: input.taskId,
                output: finalOutput
            });
            if (this.config.enableLogging) {
                logger_1.default.info(`Agent ${this.agentName} completed task ${input.taskId} in ${executionTime}ms`);
            }
            return finalOutput;
        }
        catch (error) {
            const _executionTime = Date.now() - startTime;
            this.updateMetricsOnFailure();
            // Update task status
            const task = this.activeTasks.get(input.taskId);
            if (task) {
                task.status = types_1.TaskStatus.FAILED;
                task.error = error instanceof Error ? error.message : 'Unknown error';
                task.completedAt = new Date();
                this.activeTasks.delete(input.taskId);
            }
            this.emit('taskFailed', {
                agentId: this.agentId,
                taskId: input.taskId,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            if (this.config.enableLogging) {
                logger_1.default.error(`Agent ${this.agentName} failed task ${input.taskId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
            throw error;
        }
    }
    /**
     * Executes the task with a timeout wrapper
     */
    async executeWithTimeout(input) {
        return new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                reject(new Error(`Task ${input.taskId} timed out after ${this.config.timeoutMs}ms`));
            }, this.config.timeoutMs);
            this.processTask(input)
                .then((output) => {
                clearTimeout(timeoutId);
                resolve(output);
            })
                .catch((error) => {
                clearTimeout(timeoutId);
                reject(error);
            });
        });
    }
    /**
     * Updates metrics on successful task completion
     */
    updateMetricsOnSuccess(executionTime) {
        this.metrics.totalTasks++;
        this.metrics.successfulTasks++;
        this.metrics.lastExecuted = new Date();
        // Update average execution time
        const totalTime = this.metrics.averageExecutionTime * (this.metrics.totalTasks - 1) + executionTime;
        this.metrics.averageExecutionTime = totalTime / this.metrics.totalTasks;
        // Update accuracy
        this.metrics.accuracy = this.metrics.successfulTasks / this.metrics.totalTasks;
    }
    /**
     * Updates metrics on task failure
     */
    updateMetricsOnFailure() {
        this.metrics.totalTasks++;
        this.metrics.failedTasks++;
        this.metrics.lastExecuted = new Date();
        // Update accuracy
        this.metrics.accuracy = this.metrics.successfulTasks / this.metrics.totalTasks;
    }
    /**
     * Sets up event handlers for agent lifecycle
     */
    setupEventHandlers() {
        this.on('taskStarted', () => {
            if (this.status === types_1.AgentStatus.INACTIVE) {
                this.status = types_1.AgentStatus.ACTIVE;
            }
        });
        this.on('taskCompleted', () => {
            if (this.activeTasks.size === 0) {
                this.status = types_1.AgentStatus.INACTIVE;
            }
        });
        this.on('taskFailed', () => {
            if (this.activeTasks.size === 0) {
                this.status = types_1.AgentStatus.INACTIVE;
            }
        });
    }
    /**
     * Starts the agent
     */
    start() {
        this.status = types_1.AgentStatus.ACTIVE;
        this.emit('agentStarted', { agentId: this.agentId });
        if (this.config.enableLogging) {
            logger_1.default.info(`Agent ${this.agentName} started`);
        }
    }
    /**
     * Stops the agent gracefully
     */
    async stop() {
        this.status = types_1.AgentStatus.INACTIVE;
        // Wait for active tasks to complete or timeout
        const stopTimeout = 30000; // 30 seconds
        const startTime = Date.now();
        while (this.activeTasks.size > 0 && (Date.now() - startTime) < stopTimeout) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        // Force cancel remaining tasks
        for (const [taskId, task] of this.activeTasks) {
            task.status = types_1.TaskStatus.CANCELLED;
            this.activeTasks.delete(taskId);
        }
        this.emit('agentStopped', { agentId: this.agentId });
        if (this.config.enableLogging) {
            logger_1.default.info(`Agent ${this.agentName} stopped`);
        }
    }
    /**
     * Gets current agent status and metrics
     */
    getStatus() {
        return {
            id: this.agentId,
            name: this.agentName,
            status: this.status,
            metrics: { ...this.metrics },
            activeTasks: this.activeTasks.size,
        };
    }
    /**
     * Gets active tasks
     */
    getActiveTasks() {
        return Array.from(this.activeTasks.values());
    }
    /**
     * Health check for the agent
     */
    healthCheck() {
        return {
            healthy: this.status !== types_1.AgentStatus.ERROR,
            status: this.status,
            activeTasks: this.activeTasks.size,
            lastExecuted: this.metrics.lastExecuted,
        };
    }
}
exports.AgentBase = AgentBase;
