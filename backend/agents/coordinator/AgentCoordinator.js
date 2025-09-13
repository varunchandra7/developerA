"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentCoordinator = void 0;
const events_1 = require("events");
const LiteratureAgent_1 = require("../literature/LiteratureAgent");
const CompoundAgent_1 = require("../compound/CompoundAgent");
const types_1 = require("../../../shared/types");
const logger_1 = __importDefault(require("../../utils/logger"));
/**
 * Agent Coordinator manages the multi-agent system for AyurDiscovery AI
 * Orchestrates workflows, synthesizes results, and ensures quality
 */
class AgentCoordinator extends events_1.EventEmitter {
    constructor(maxConcurrentTasks = 5) {
        super();
        this.agents = new Map();
        this.activeTasks = new Map();
        this.taskQueue = [];
        this.isProcessing = false;
        this.maxConcurrentTasks = maxConcurrentTasks;
        this.initializeAgents();
        this.startTaskProcessor();
    }
    initializeAgents() {
        // Initialize core agents
        const literatureAgent = new LiteratureAgent_1.LiteratureAgent();
        const compoundAgent = new CompoundAgent_1.CompoundAgent();
        this.agents.set('literature', literatureAgent);
        this.agents.set('compound', compoundAgent);
        // Start all agents
        for (const agent of this.agents.values()) {
            agent.start();
        }
        logger_1.default.info('Agent Coordinator initialized with agents:', Array.from(this.agents.keys()));
    }
    async submitTask(type, input, priority = types_1.TaskPriority.MEDIUM) {
        const taskId = this.generateTaskId();
        const task = {
            id: taskId,
            type,
            priority,
            input,
            requiredAgents: this.getRequiredAgents(type),
            workflow: this.generateWorkflow(type, input),
            status: types_1.TaskStatus.PENDING,
            results: new Map(),
            startedAt: new Date(),
        };
        this.taskQueue.push(task);
        this.sortTaskQueue();
        logger_1.default.info(`Task ${taskId} submitted with type ${type} and priority ${priority}`);
        this.emit('taskSubmitted', { taskId, type, priority });
        return taskId;
    }
    getRequiredAgents(type) {
        const agentMap = {
            'ayurveda_research': ['literature', 'compound'],
            'compound_discovery': ['compound', 'literature'],
            'literature_review': ['literature'],
            'cross_validation': ['literature', 'compound'],
        };
        return agentMap[type] || [];
    }
    generateWorkflow(type, input) {
        const workflows = {
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
    startTaskProcessor() {
        setInterval(() => {
            if (!this.isProcessing && this.taskQueue.length > 0 && this.activeTasks.size < this.maxConcurrentTasks) {
                this.processNextTask();
            }
        }, 1000);
    }
    async processNextTask() {
        if (this.taskQueue.length === 0)
            return;
        this.isProcessing = true;
        const task = this.taskQueue.shift();
        this.activeTasks.set(task.id, task);
        task.status = types_1.TaskStatus.IN_PROGRESS;
        this.emit('taskStarted', { taskId: task.id });
        try {
            logger_1.default.info(`Starting task ${task.id} of type ${task.type}`);
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
            task.status = types_1.TaskStatus.COMPLETED;
            task.completedAt = new Date();
            logger_1.default.info(`Task ${task.id} completed successfully`);
            this.emit('taskCompleted', { taskId: task.id, result: task.finalResult });
        }
        catch (error) {
            task.status = types_1.TaskStatus.FAILED;
            task.error = error instanceof Error ? error.message : 'Unknown error';
            task.completedAt = new Date();
            logger_1.default.error(`Task ${task.id} failed: ${task.error}`);
            this.emit('taskFailed', { taskId: task.id, error: task.error });
        }
        finally {
            this.activeTasks.delete(task.id);
            this.isProcessing = false;
        }
    }
    async executeWorkflow(task) {
        const completed = new Set();
        const parallel = [];
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
            }
            else {
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
    async executeWorkflowStep(task, step, completed) {
        const agent = this.agents.get(step.agentType);
        if (!agent) {
            throw new Error(`Agent ${step.agentType} not found`);
        }
        try {
            const agentInput = {
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
            logger_1.default.info(`Workflow step ${step.stepId} completed for task ${task.id}`);
        }
        catch (error) {
            if (step.optional) {
                logger_1.default.warn(`Optional step ${step.stepId} failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
                completed.add(step.stepId); // Mark as completed even if failed
            }
            else {
                throw error;
            }
        }
    }
    async synthesizeResults(task) {
        const evidence = [];
        const findings = [];
        const recommendations = [];
        const conflicts = [];
        // Extract evidence from agent results
        for (const [stepId, result] of task.results) {
            const agentType = task.workflow.find(w => w.stepId === stepId)?.agentType || 'unknown';
            if (agentType === 'literature') {
                // Process literature results
                const literatureData = result.result;
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
                const compoundData = result.result;
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
    calculateOverallConfidence(results) {
        const confidenceValues = Array.from(results.values()).map(r => r.confidence);
        return confidenceValues.reduce((sum, c) => sum + c, 0) / confidenceValues.length;
    }
    calculateQualityScore(results) {
        // Quality score based on execution time, confidence, and completeness
        let score = 0;
        for (const result of results.values()) {
            score += result.confidence * 0.6; // Confidence weight
            score += (result.executionTime < 60000 ? 0.3 : 0.1); // Speed bonus
            score += 0.1; // Completion bonus
        }
        return Math.min(score / results.size, 1.0);
    }
    calculateReliabilityScore(evidence, conflicts) {
        const avgEvidenceConfidence = evidence.length > 0
            ? evidence.reduce((sum, e) => sum + e.confidence, 0) / evidence.length
            : 0;
        const conflictPenalty = conflicts.length * 0.1;
        return Math.max(avgEvidenceConfidence - conflictPenalty, 0);
    }
    sortTaskQueue() {
        this.taskQueue.sort((a, b) => {
            const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        });
    }
    generateTaskId() {
        return `coord-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    getTaskStatus(taskId) {
        return this.activeTasks.get(taskId);
    }
    getAllActiveTasks() {
        return Array.from(this.activeTasks.values());
    }
    getAgentStatuses() {
        const statuses = {};
        for (const [name, agent] of this.agents) {
            statuses[name] = agent.getStatus();
        }
        return statuses;
    }
    async shutdown() {
        logger_1.default.info('Shutting down Agent Coordinator...');
        // Stop all agents
        for (const agent of this.agents.values()) {
            await agent.stop();
        }
        // Cancel pending tasks
        this.taskQueue.length = 0;
        logger_1.default.info('Agent Coordinator shutdown complete');
    }
}
exports.AgentCoordinator = AgentCoordinator;
