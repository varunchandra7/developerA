import { Router, Request, Response } from 'express';
import { HerbModel } from '../models/Herb';
import { asyncHandler } from '../middleware/asyncHandler';
import { buildApiResponse } from '../utils/response';
import logger from '../utils/logger';

const router = Router();

/**
 * GET /api/v1/herbs
 * Get all herbs with optional filtering and pagination
 */
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, search, dosha, rasa } = req.query;
  
  // Build query
  const query: any = {};
  
  if (search) {
    query.$text = { $search: search as string };
  }
  
  if (dosha) {
    query['properties.dosha'] = { $in: Array.isArray(dosha) ? dosha : [dosha] };
  }
  
  if (rasa) {
    query['properties.rasa'] = { $in: Array.isArray(rasa) ? rasa : [rasa] };
  }

  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const skip = (pageNum - 1) * limitNum;

  // Execute query with pagination
  const [herbs, total] = await Promise.all([
    HerbModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate('compounds', 'name molecularFormula')
      .lean(),
    HerbModel.countDocuments(query)
  ]);

  const pagination = {
    currentPage: pageNum,
    totalPages: Math.ceil(total / limitNum),
    totalItems: total,
    itemsPerPage: limitNum,
    hasNext: pageNum < Math.ceil(total / limitNum),
    hasPrev: pageNum > 1
  };

  logger.info(`Retrieved ${herbs.length} herbs (page ${pageNum}/${pagination.totalPages})`);

  res.json(buildApiResponse({
    data: herbs,
    pagination
  }, (req as any).requestId));
}));

/**
 * GET /api/v1/herbs/:id
 * Get a specific herb by ID
 */
router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const herb = await HerbModel.findById(id)
    .populate('compounds', 'name molecularFormula smiles bioactivity')
    .lean();

  if (!herb) {
    return res.status(404).json(buildApiResponse({
      error: 'Herb not found',
      data: null
    }, (req as any).requestId));
  }

  logger.info(`Retrieved herb: ${herb.name.english} (${id})`);

  res.json(buildApiResponse({
    data: herb
  }, (req as any).requestId));
}));

export default router;