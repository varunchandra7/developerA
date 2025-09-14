import { Router, Request, Response } from 'express';
import { AgentModel } from '../models/Agent';
import { asyncHandler } from '../middleware/asyncHandler';
import { buildApiResponse } from '../utils/response';
import logger from '../utils/logger';

const router = Router();

/**
 * GET /api/v1/agents
 * Get all agents with their status and capabilities
 */
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const { status, type } = req.query;
  
  // Build query
  const query: any = {};
  
  if (status) {
    query.status = status;
  }
  
  if (type) {
    query.type = type;
  }

  const agents = await AgentModel.find(query)
    .sort({ createdAt: -1 })
    .lean();

  logger.info(`Retrieved ${agents.length} agents`);

  res.json(buildApiResponse({
    data: agents
  }, (req as any).requestId));
}));

/**
 * GET /api/v1/agents/:id
 * Get a specific agent by ID
 */
router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const agent = await AgentModel.findById(id).lean();

  if (!agent) {
    return res.status(404).json(buildApiResponse({
      error: 'Agent not found',
      data: null
    }, (req as any).requestId));
  }

  logger.info(`Retrieved agent: ${agent.name} (${id})`);

  res.json(buildApiResponse({
    data: agent
  }, (req as any).requestId));
}));

/**
 * POST /api/v1/agents/:id/execute
 * Execute a task with a specific agent
 */
router.post('/:id/execute', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { task, input } = req.body;

  const agent = await AgentModel.findById(id);

  if (!agent) {
    return res.status(404).json(buildApiResponse({
      error: 'Agent not found',
      data: null
    }, (req as any).requestId));
  }

  if (agent.status !== 'active') {
    return res.status(400).json(buildApiResponse({
      error: 'Agent is not active',
      data: null
    }, (req as any).requestId));
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

  logger.info(`Executed task with agent: ${agent.name}`);

  res.json(buildApiResponse({
    data: result
  }, (req as any).requestId));
}));

export default router;