import { Router, Request, Response } from 'express';
import Compound from '../models/Compound';
import { asyncHandler } from '../middleware/asyncHandler';
import { buildApiResponse } from '../utils/response';
import logger from '../utils/logger';

const router = Router();

/**
 * GET /api/v1/compounds
 * Get all compounds with optional filtering and pagination
 */
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, search } = req.query;
  
  // Build query
  const query: any = {};
  
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { 'source.plantSource': { $regex: search, $options: 'i' } }
    ];
  }

  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const skip = (pageNum - 1) * limitNum;

  try {
    // Execute query with pagination
    const [compounds, total] = await Promise.all([
      Compound.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .select('name molecularFormula molecularWeight source bioactivity')
        .lean(),
      Compound.countDocuments(query)
    ]);

    const pagination = {
      currentPage: pageNum,
      totalPages: Math.ceil(total / limitNum),
      totalItems: total,
      itemsPerPage: limitNum,
      hasNext: pageNum < Math.ceil(total / limitNum),
      hasPrev: pageNum > 1
    };

    logger.info(`Retrieved ${compounds.length} compounds (page ${pageNum}/${pagination.totalPages})`);

    res.json(buildApiResponse({
      data: compounds,
      pagination
    }, (req as any).requestId));
  } catch (error) {
    logger.error('Error fetching compounds:', error);
    res.status(500).json(buildApiResponse({
      error: 'Failed to fetch compounds',
      data: null
    }, (req as any).requestId));
  }
}));

/**
 * GET /api/v1/compounds/:id
 * Get a specific compound by ID
 */
router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const compound = await Compound.findById(id).lean();

  if (!compound) {
    return res.status(404).json(buildApiResponse({
      error: 'Compound not found',
      data: null
    }, (req as any).requestId));
  }

  logger.info(`Retrieved compound: ${compound.name} (${id})`);

  res.json(buildApiResponse({
    data: compound
  }, (req as any).requestId));
}));

export default router;