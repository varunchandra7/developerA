import { EventEmitter } from 'events';
import { Agent, AgentStatus, AgentMetrics, Task, AgentType } from '../../../shared/types';
export interface AgentInput {
    taskId: string;
    data: Record<string, unknown>;
    metadata?: Record<string, unknown>;
}
export interface AgentOutput {
    taskId: string;
    result: Record<string, unknown>;
    confidence: number;
    metadata: Record<string, unknown>;
    executionTime: number;
}
export interface AgentConfig {
    maxConcurrentTasks: number;
    timeoutMs: number;
    retryAttempts: number;
    enableLogging: boolean;
}
/**
 * Abstract base class for all agents in the AyurDiscovery AI system
 * Provides common functionality for task processing, error handling, and metrics
 */
export declare abstract class AgentBase extends EventEmitter implements Agent {
    readonly id: string;
    readonly name: string;
    readonly type: AgentType;
    readonly description: string;
    readonly capabilities: string[];
    readonly configuration: Record<string, unknown>;
    readonly createdAt: Date;
    updatedAt: Date;
    protected agentId: string;
    protected agentName: string;
    status: AgentStatus;
    metrics: AgentMetrics;
    protected config: AgentConfig;
    protected activeTasks: Map<string, Task>;
    constructor(agentId: string, agentName: string, agentType: AgentType, description: string, capabilities: string[], config?: Partial<AgentConfig>);
    /**
     * Abstract method that must be implemented by all concrete agents
     * Contains the core processing logic for the specific agent type
     */
    protected abstract processTask(input: AgentInput): Promise<AgentOutput>;
    /**
     * Validates input data before processing
     * Override in concrete agents for specific validation logic
     */
    protected validateInput(input: AgentInput): boolean;
    /**
     * Post-processes the output before returning
     * Override in concrete agents for specific post-processing logic
     */
    protected postProcessOutput(output: AgentOutput): AgentOutput;
    /**
     * Main entry point for task execution
     */
    executeTask(input: AgentInput): Promise<AgentOutput>;
    /**
     * Executes the task with a timeout wrapper
     */
    private executeWithTimeout;
    /**
     * Updates metrics on successful task completion
     */
    private updateMetricsOnSuccess;
    /**
     * Updates metrics on task failure
     */
    private updateMetricsOnFailure;
    /**
     * Sets up event handlers for agent lifecycle
     */
    private setupEventHandlers;
    /**
     * Starts the agent
     */
    start(): void;
    /**
     * Stops the agent gracefully
     */
    stop(): Promise<void>;
    /**
     * Gets current agent status and metrics
     */
    getStatus(): {
        id: string;
        name: string;
        status: AgentStatus;
        metrics: AgentMetrics;
        activeTasks: number;
    };
    /**
     * Gets active tasks
     */
    getActiveTasks(): Task[];
    /**
     * Health check for the agent
     */
    healthCheck(): {
        healthy: boolean;
        status: AgentStatus;
        activeTasks: number;
        lastExecuted: Date;
    };
}
