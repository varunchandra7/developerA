import { EventEmitter } from 'events';
import { AgentBase, AgentInput, AgentOutput } from '../base/AgentBase';
import { LiteratureAgent } from '../literature/LiteratureAgent';
import { CompoundAgent } from '../compound/CompoundAgent';
import { AgentStatus, TaskType, TaskStatus, TaskPriority } from '../../../shared/types';
import logger from '../../utils/logger';

export interface CoordinatedTask {
  id: string;
  type: 'ayurveda_research' | 'compound_discovery' | 'literature_review' | 'cross_validation';
  priority: TaskPriority;
  input: Record<string, unknown>;
  requiredAgents: string[];
  workflow: WorkflowStep[];
  status: TaskStatus;
  results: Map<string, AgentOutput>;
  finalResult?: CoordinatedOutput;
  startedAt: Date;
  completedAt?: Date;
  error?: string;
}

export interface WorkflowStep {
  stepId: string;
  agentType: string;
  input: Record<string, unknown>;
  dependencies: string[];
  parallel: boolean;
  optional: boolean;
}

export interface CoordinatedOutput {
  taskId: string;
  type: string;
  synthesis: SynthesizedResult;
  agentResults: Record<string, AgentOutput>;
  confidence: number;
  metadata: {
    totalExecutionTime: number;
    agentsUsed: string[];
    workflow: string[];
    qualityScore: number;
  };
}

export interface SynthesizedResult {
  primaryFindings: string[];
  supportingEvidence: Evidence[];
  recommendations: Recommendation[];
  conflictingInformation: Conflict[];
  reliabilityScore: number;
}

export interface Evidence {
  source: string;
  type: 'traditional' | 'scientific' | 'computational';
  content: string;
  confidence: number;
  agentSource: string;
}

export interface Recommendation {
  category: string;
  description: string;
  confidence: number;
  supportingEvidence: string[];
  risks: string[];
}

export interface Conflict {
  sources: string[];
  description: string;
  resolution?: string;
  severity: 'low' | 'medium' | 'high';
}

/**
 * Agent Coordinator manages the multi-agent system for AyurDiscovery AI
 * Orchestrates workflows, synthesizes results, and ensures quality
 */
export class AgentCoordinator extends EventEmitter {
  private agents: Map<string, AgentBase>;
  private activeTasks: Map<string, CoordinatedTask>;
  private taskQueue: CoordinatedTask[];
  private isProcessing: boolean;
  private maxConcurrentTasks: number;

  constructor(maxConcurrentTasks: number = 5) {
    super();
    
    this.agents = new Map();
    this.activeTasks = new Map();
    this.taskQueue = [];
    this.isProcessing = false;
    this.maxConcurrentTasks = maxConcurrentTasks;

    this.initializeAgents();
    this.startTaskProcessor();
  }

  private initializeAgents(): void {
    // Initialize core agents
    const literatureAgent = new LiteratureAgent();
    const compoundAgent = new CompoundAgent();

    this.agents.set('literature', literatureAgent);
    this.agents.set('compound', compoundAgent);

    // Start all agents
    for (const agent of this.agents.values()) {
      agent.start();
    }

    logger.info('Agent Coordinator initialized with agents:', Array.from(this.agents.keys()));
  }

  public async submitTask(
    type: CoordinatedTask['type'],
    input: Record<string, unknown>,
    priority: TaskPriority = TaskPriority.MEDIUM
  ): Promise<string> {
    const taskId = this.generateTaskId();
    
    const task: CoordinatedTask = {
      id: taskId,
      type,
      priority,
      input,
      requiredAgents: this.getRequiredAgents(type),
      workflow: this.generateWorkflow(type, input),
      status: TaskStatus.PENDING,
      results: new Map(),
      startedAt: new Date(),
    };

    this.taskQueue.push(task);
    this.sortTaskQueue();

    logger.info(`Task ${taskId} submitted with type ${type} and priority ${priority}`);
    this.emit('taskSubmitted', { taskId, type, priority });

    return taskId;
  }

  private getRequiredAgents(type: CoordinatedTask['type']): string[] {
    const agentMap: Record<string, string[]> = {
      'ayurveda_research': ['literature', 'compound'],
      'compound_discovery': ['compound', 'literature'],
      'literature_review': ['literature'],
      'cross_validation': ['literature', 'compound'],
    };

    return agentMap[type] || [];
  }

  private generateWorkflow(type: CoordinatedTask['type'], input: Record<string, unknown>): WorkflowStep[] {
    const workflows: Record<string, WorkflowStep[]> = {
      'ayurveda_research': [
        {
          stepId: 'literature_search',
          agentType: 'literature',
          input: {
            query: input['query'] || '',
            language: input['language'] || 'english',
            searchType: 'general',
          },
          dependencies: [],
          parallel: false,
          optional: false,
        },
        {
          stepId: 'compound_analysis',
          agentType: 'compound',
          input: {
            compoundIdentifier: input['compound'] || '',
            identifierType: 'name',
            analysisType: 'complete',
            options: { includeSimilar: true },
          },
          dependencies: ['literature_search'],
          parallel: false,
          optional: false,
        },
      ],
      'compound_discovery': [
        {
          stepId: 'compound_analysis',
          agentType: 'compound',
          input: {
            compoundIdentifier: input['compound'] || '',
            identifierType: input['identifierType'] || 'name',
            analysisType: 'complete',
          },
          dependencies: [],
          parallel: false,
          optional: false,
        },
        {
          stepId: 'literature_validation',
          agentType: 'literature',
          input: {
            query: input['compound'] || '',
            searchType: 'compound',
            language: 'english',
          },
          dependencies: ['compound_analysis'],
          parallel: false,
          optional: true,
        },
      ],
      'literature_review': [
        {
          stepId: 'comprehensive_search',
          agentType: 'literature',
          input: {
            query: input['query'] || '',
            language: input['language'] || 'english',
            searchType: input['searchType'] || 'general',
          },
          dependencies: [],
          parallel: false,
          optional: false,
        },
      ],
      'cross_validation': [
        {
          stepId: 'literature_search',
          agentType: 'literature',
          input: {
            query: input['query'] || '',
            language: 'english',
            searchType: 'general',
          },
          dependencies: [],
          parallel: true,
          optional: false,
        },
        {
          stepId: 'compound_verification',
          agentType: 'compound',
          input: {
            compoundIdentifier: input['compound'] || '',
            identifierType: 'name',
            analysisType: 'properties',
          },
          dependencies: [],
          parallel: true,
          optional: false,
        },
      ],
    };

    return workflows[type] || [];
  }

  private startTaskProcessor(): void {
    setInterval(() => {
      if (!this.isProcessing && this.taskQueue.length > 0 && this.activeTasks.size < this.maxConcurrentTasks) {
        this.processNextTask();
      }
    }, 1000);
  }

  private async processNextTask(): Promise<void> {
    if (this.taskQueue.length === 0) return;

    this.isProcessing = true;
    const task = this.taskQueue.shift()!;
    this.activeTasks.set(task.id, task);

    task.status = TaskStatus.IN_PROGRESS;
    this.emit('taskStarted', { taskId: task.id });

    try {
      logger.info(`Starting task ${task.id} of type ${task.type}`);
      
      // Execute workflow steps
      await this.executeWorkflow(task);

      // Synthesize results
      const synthesizedResult = await this.synthesizeResults(task);

      task.finalResult = {
        taskId: task.id,
        type: task.type,
        synthesis: synthesizedResult,
        agentResults: Object.fromEntries(task.results),
        confidence: this.calculateOverallConfidence(task.results),
        metadata: {
          totalExecutionTime: Date.now() - task.startedAt.getTime(),
          agentsUsed: Array.from(task.results.keys()),
          workflow: task.workflow.map(step => step.stepId),
          qualityScore: this.calculateQualityScore(task.results),
        },
      };

      task.status = TaskStatus.COMPLETED;
      task.completedAt = new Date();

      logger.info(`Task ${task.id} completed successfully`);
      this.emit('taskCompleted', { taskId: task.id, result: task.finalResult });

    } catch (error) {
      task.status = TaskStatus.FAILED;
      task.error = error instanceof Error ? error.message : 'Unknown error';
      task.completedAt = new Date();

      logger.error(`Task ${task.id} failed: ${task.error}`);
      this.emit('taskFailed', { taskId: task.id, error: task.error });
    } finally {
      this.activeTasks.delete(task.id);
      this.isProcessing = false;
    }
  }

  private async executeWorkflow(task: CoordinatedTask): Promise<void> {
    const completed = new Set<string>();
    const parallel: Promise<void>[] = [];

    for (const step of task.workflow) {
      // Check dependencies
      const dependenciesComplete = step.dependencies.every(dep => completed.has(dep));
      
      if (!dependenciesComplete) {
        if (!step.optional) {
          throw new Error(`Dependencies not met for step ${step.stepId}`);
        }
        continue;
      }

      if (step.parallel) {
        // Execute in parallel
        parallel.push(this.executeWorkflowStep(task, step, completed));
      } else {
        // Wait for parallel steps to complete first
        if (parallel.length > 0) {
          await Promise.all(parallel);
          parallel.length = 0;
        }
        
        // Execute sequentially
        await this.executeWorkflowStep(task, step, completed);
      }
    }

    // Wait for any remaining parallel steps
    if (parallel.length > 0) {
      await Promise.all(parallel);
    }
  }

  private async executeWorkflowStep(
    task: CoordinatedTask,
    step: WorkflowStep,
    completed: Set<string>
  ): Promise<void> {
    const agent = this.agents.get(step.agentType);
    if (!agent) {
      throw new Error(`Agent ${step.agentType} not found`);
    }

    try {
      const agentInput: AgentInput = {
        taskId: `${task.id}-${step.stepId}`,
        data: step.input,
        metadata: {
          coordinatedTaskId: task.id,
          stepId: step.stepId,
          workflowType: task.type,
        },
      };

      const result = await agent.executeTask(agentInput);
      task.results.set(step.stepId, result);
      completed.add(step.stepId);

      logger.info(`Workflow step ${step.stepId} completed for task ${task.id}`);

    } catch (error) {
      if (step.optional) {
        logger.warn(`Optional step ${step.stepId} failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        completed.add(step.stepId); // Mark as completed even if failed
      } else {
        throw error;
      }
    }
  }

  private async synthesizeResults(task: CoordinatedTask): Promise<SynthesizedResult> {
    const evidence: Evidence[] = [];
    const findings: string[] = [];
    const recommendations: Recommendation[] = [];
    const conflicts: Conflict[] = [];

    // Extract evidence from agent results
    for (const [stepId, result] of task.results) {
      const agentType = task.workflow.find(w => w.stepId === stepId)?.agentType || 'unknown';
      
      if (agentType === 'literature') {
        // Process literature results
        const literatureData = result.result as any;
        if (literatureData.results) {
          for (const res of literatureData.results) {
            evidence.push({
              source: res.source.name,
              type: 'traditional',
              content: res.title,
              confidence: res.relevanceScore,
              agentSource: 'literature',
            });
          }
        }
      }

      if (agentType === 'compound') {
        // Process compound results
        const compoundData = result.result as any;
        if (compoundData.analysis) {
          findings.push(`Compound analysis completed with ${result.confidence} confidence`);
          evidence.push({
            source: 'computational_analysis',
            type: 'computational',
            content: `Drug-likeness score: ${compoundData.analysis.drugLikeness?.qed || 'N/A'}`,
            confidence: result.confidence,
            agentSource: 'compound',
          });
        }
      }
    }

    // Generate recommendations based on evidence
    if (evidence.length > 0) {
      const avgConfidence = evidence.reduce((sum, e) => sum + e.confidence, 0) / evidence.length;
      
      recommendations.push({
        category: 'research',
        description: 'Further investigation recommended based on preliminary findings',
        confidence: avgConfidence,
        supportingEvidence: evidence.map(e => e.source),
        risks: ['Requires additional validation', 'Limited data available'],
      });
    }

    // Detect conflicts (simplified implementation)
    const conflictThreshold = 0.3;
    const confidenceValues = Array.from(task.results.values()).map(r => r.confidence);
    const maxConfidence = Math.max(...confidenceValues);
    const minConfidence = Math.min(...confidenceValues);
    
    if (maxConfidence - minConfidence > conflictThreshold) {
      conflicts.push({
        sources: Array.from(task.results.keys()),
        description: 'Significant confidence variation detected between agent results',
        severity: 'medium',
      });
    }

    return {
      primaryFindings: findings,
      supportingEvidence: evidence,
      recommendations,
      conflictingInformation: conflicts,
      reliabilityScore: this.calculateReliabilityScore(evidence, conflicts),
    };
  }

  private calculateOverallConfidence(results: Map<string, AgentOutput>): number {
    const confidenceValues = Array.from(results.values()).map(r => r.confidence);
    return confidenceValues.reduce((sum, c) => sum + c, 0) / confidenceValues.length;
  }

  private calculateQualityScore(results: Map<string, AgentOutput>): number {
    // Quality score based on execution time, confidence, and completeness
    let score = 0;
    
    for (const result of results.values()) {
      score += result.confidence * 0.6; // Confidence weight
      score += (result.executionTime < 60000 ? 0.3 : 0.1); // Speed bonus
      score += 0.1; // Completion bonus
    }
    
    return Math.min(score / results.size, 1.0);
  }

  private calculateReliabilityScore(evidence: Evidence[], conflicts: Conflict[]): number {
    const avgEvidenceConfidence = evidence.length > 0 
      ? evidence.reduce((sum, e) => sum + e.confidence, 0) / evidence.length 
      : 0;
    
    const conflictPenalty = conflicts.length * 0.1;
    
    return Math.max(avgEvidenceConfidence - conflictPenalty, 0);
  }

  private sortTaskQueue(): void {
    this.taskQueue.sort((a, b) => {
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  private generateTaskId(): string {
    return `coord-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  public getTaskStatus(taskId: string): CoordinatedTask | undefined {
    return this.activeTasks.get(taskId);
  }

  public getAllActiveTasks(): CoordinatedTask[] {
    return Array.from(this.activeTasks.values());
  }

  public getAgentStatuses(): Record<string, any> {
    const statuses: Record<string, any> = {};
    
    for (const [name, agent] of this.agents) {
      statuses[name] = agent.getStatus();
    }
    
    return statuses;
  }

  public async shutdown(): Promise<void> {
    logger.info('Shutting down Agent Coordinator...');
    
    // Stop all agents
    for (const agent of this.agents.values()) {
      await agent.stop();
    }
    
    // Cancel pending tasks
    this.taskQueue.length = 0;
    
    logger.info('Agent Coordinator shutdown complete');
  }
}