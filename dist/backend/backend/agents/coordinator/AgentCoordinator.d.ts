import { EventEmitter } from 'events';
import { TaskPriority, TaskStatus } from '../../../shared/types';
import { AgentOutput } from '../base/AgentBase';
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
export declare class AgentCoordinator extends EventEmitter {
    private agents;
    private activeTasks;
    private taskQueue;
    private isProcessing;
    private maxConcurrentTasks;
    constructor(maxConcurrentTasks?: number);
    private initializeAgents;
    submitTask(type: CoordinatedTask['type'], input: Record<string, unknown>, priority?: TaskPriority): Promise<string>;
    private getRequiredAgents;
    private generateWorkflow;
    private startTaskProcessor;
    private processNextTask;
    private executeWorkflow;
    private executeWorkflowStep;
    private synthesizeResults;
    private calculateOverallConfidence;
    private calculateQualityScore;
    private calculateReliabilityScore;
    private sortTaskQueue;
    private generateTaskId;
    getTaskStatus(taskId: string): CoordinatedTask | undefined;
    getAllActiveTasks(): CoordinatedTask[];
    getAgentStatuses(): Record<string, any>;
    shutdown(): Promise<void>;
}
