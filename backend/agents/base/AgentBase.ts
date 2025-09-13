import { EventEmitter } from 'events';
import { Agent, AgentStatus, AgentMetrics, Task, TaskStatus, AgentType } from '../../../shared/types';
import logger from '../../utils/logger';

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
export abstract class AgentBase extends EventEmitter implements Agent {
  public readonly id: string;
  public readonly name: string;
  public readonly type: AgentType;
  public readonly description: string;
  public readonly capabilities: string[];
  public readonly configuration: Record<string, unknown>;
  public readonly createdAt: Date;
  public updatedAt: Date;
  
  protected agentId: string;
  protected agentName: string;
  public status: AgentStatus;
  public metrics: AgentMetrics;
  protected config: AgentConfig;
  protected activeTasks: Map<string, Task>;

  constructor(
    agentId: string,
    agentName: string,
    agentType: AgentType,
    description: string,
    capabilities: string[],
    config: Partial<AgentConfig> = {}
  ) {
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
    this.status = AgentStatus.INACTIVE;
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
   * Abstract method that must be implemented by all concrete agents
   * Contains the core processing logic for the specific agent type
   */
  protected abstract processTask(input: AgentInput): Promise<AgentOutput>;

  /**
   * Validates input data before processing
   * Override in concrete agents for specific validation logic
   */
  protected validateInput(input: AgentInput): boolean {
    return !!(input.taskId && input.data);
  }

  /**
   * Post-processes the output before returning
   * Override in concrete agents for specific post-processing logic
   */
  protected postProcessOutput(output: AgentOutput): AgentOutput {
    return output;
  }

  /**
   * Main entry point for task execution
   */
  public async executeTask(input: AgentInput): Promise<AgentOutput> {
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
      const task: Task = {
        id: input.taskId,
        type: 'GENERIC' as any, // Will be overridden by concrete agents
        agentId: this.agentId,
        input: input.data,
        status: TaskStatus.IN_PROGRESS,
        priority: 'MEDIUM' as any,
        progress: 0,
        startedAt: new Date(),
        metadata: input.metadata || {},
      };

      this.activeTasks.set(input.taskId, task);
      this.emit('taskStarted', { agentId: this.agentId, taskId: input.taskId });

      if (this.config.enableLogging) {
        logger.info(`Agent ${this.agentName} started task ${input.taskId}`);
      }

      // Execute the task with timeout
      const output = await this.executeWithTimeout(input);
      
      // Post-process output
      const finalOutput = this.postProcessOutput(output);
      
      // Update metrics and status
      const executionTime = Date.now() - startTime;
      this.updateMetricsOnSuccess(executionTime);
      
      // Update task status
      task.status = TaskStatus.COMPLETED;
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
        logger.info(`Agent ${this.agentName} completed task ${input.taskId} in ${executionTime}ms`);
      }

      return finalOutput;

    } catch (error) {
      const _executionTime = Date.now() - startTime;
      this.updateMetricsOnFailure();
      
      // Update task status
      const task = this.activeTasks.get(input.taskId);
      if (task) {
        task.status = TaskStatus.FAILED;
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
        logger.error(`Agent ${this.agentName} failed task ${input.taskId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }

      throw error;
    }
  }

  /**
   * Executes the task with a timeout wrapper
   */
  private async executeWithTimeout(input: AgentInput): Promise<AgentOutput> {
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
  private updateMetricsOnSuccess(executionTime: number): void {
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
  private updateMetricsOnFailure(): void {
    this.metrics.totalTasks++;
    this.metrics.failedTasks++;
    this.metrics.lastExecuted = new Date();
    
    // Update accuracy
    this.metrics.accuracy = this.metrics.successfulTasks / this.metrics.totalTasks;
  }

  /**
   * Sets up event handlers for agent lifecycle
   */
  private setupEventHandlers(): void {
    this.on('taskStarted', () => {
      if (this.status === AgentStatus.INACTIVE) {
        this.status = AgentStatus.ACTIVE;
      }
    });

    this.on('taskCompleted', () => {
      if (this.activeTasks.size === 0) {
        this.status = AgentStatus.INACTIVE;
      }
    });

    this.on('taskFailed', () => {
      if (this.activeTasks.size === 0) {
        this.status = AgentStatus.INACTIVE;
      }
    });
  }

  /**
   * Starts the agent
   */
  public start(): void {
    this.status = AgentStatus.ACTIVE;
    this.emit('agentStarted', { agentId: this.agentId });
    
    if (this.config.enableLogging) {
      logger.info(`Agent ${this.agentName} started`);
    }
  }

  /**
   * Stops the agent gracefully
   */
  public async stop(): Promise<void> {
    this.status = AgentStatus.INACTIVE;
    
    // Wait for active tasks to complete or timeout
    const stopTimeout = 30000; // 30 seconds
    const startTime = Date.now();
    
    while (this.activeTasks.size > 0 && (Date.now() - startTime) < stopTimeout) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Force cancel remaining tasks
    for (const [taskId, task] of this.activeTasks) {
      task.status = TaskStatus.CANCELLED;
      this.activeTasks.delete(taskId);
    }

    this.emit('agentStopped', { agentId: this.agentId });
    
    if (this.config.enableLogging) {
      logger.info(`Agent ${this.agentName} stopped`);
    }
  }

  /**
   * Gets current agent status and metrics
   */
  public getStatus(): {
    id: string;
    name: string;
    status: AgentStatus;
    metrics: AgentMetrics;
    activeTasks: number;
  } {
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
  public getActiveTasks(): Task[] {
    return Array.from(this.activeTasks.values());
  }

  /**
   * Health check for the agent
   */
  public healthCheck(): {
    healthy: boolean;
    status: AgentStatus;
    activeTasks: number;
    lastExecuted: Date;
  } {
    return {
      healthy: this.status !== AgentStatus.ERROR,
      status: this.status,
      activeTasks: this.activeTasks.size,
      lastExecuted: this.metrics.lastExecuted,
    };
  }
}