"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Agent_1 = require("../models/Agent");
const asyncHandler_1 = require("../middleware/asyncHandler");
const response_1 = require("../utils/response");
const logger_1 = __importDefault(require("../utils/logger"));
const router = (0, express_1.Router)();
/**
 * GET /api/v1/agents
 * Get all agents with their status and capabilities
 */
router.get('/', (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { status, type } = req.query;
    // Build query
    const query = {};
    if (status) {
        query.status = status;
    }
    if (type) {
        query.type = type;
    }
    const agents = await Agent_1.AgentModel.find(query)
        .sort({ createdAt: -1 })
        .lean();
    logger_1.default.info(`Retrieved ${agents.length} agents`);
    res.json((0, response_1.buildApiResponse)({
        data: agents
    }, req.requestId));
}));
/**
 * GET /api/v1/agents/:id
 * Get a specific agent by ID
 */
router.get('/:id', (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const agent = await Agent_1.AgentModel.findById(id).lean();
    if (!agent) {
        return res.status(404).json((0, response_1.buildApiResponse)({
            error: 'Agent not found',
            data: null
        }, req.requestId));
    }
    logger_1.default.info(`Retrieved agent: ${agent.name} (${id})`);
    res.json((0, response_1.buildApiResponse)({
        data: agent
    }, req.requestId));
}));
/**
 * POST /api/v1/agents/:id/execute
 * Execute a task with a specific agent
 */
router.post('/:id/execute', (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { task, input } = req.body;
    const agent = await Agent_1.AgentModel.findById(id);
    if (!agent) {
        return res.status(404).json((0, response_1.buildApiResponse)({
            error: 'Agent not found',
            data: null
        }, req.requestId));
    }
    if (agent.status !== 'active') {
        return res.status(400).json((0, response_1.buildApiResponse)({
            error: 'Agent is not active',
            data: null
        }, req.requestId));
    }
    // Mock execution for now - in real implementation, this would call the actual agent
    const result = {
        agentId: id,
        agentName: agent.name,
        task,
        input,
        result: `Mock result from ${agent.name}`,
        executionTime: Math.random() * 1000,
        timestamp: new Date().toISOString()
    };
    // Update agent metrics (simplified)
    agent.metrics.totalTasks += 1;
    agent.metrics.successfulTasks += 1;
    agent.metrics.lastExecuted = new Date();
    await agent.save();
    logger_1.default.info(`Executed task with agent: ${agent.name}`);
    res.json((0, response_1.buildApiResponse)({
        data: result
    }, req.requestId));
}));
exports.default = router;
