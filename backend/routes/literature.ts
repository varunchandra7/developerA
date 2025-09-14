import { Router, Request, Response } from 'express';
import { Literature } from '../models/Literature';
import { asyncHandler } from '../middleware/asyncHandler';
import { buildApiResponse } from '../utils/response';
import logger from '../utils/logger';

const router = Router();

/**
 * GET /api/v1/literature
 * Get all literature with optional filtering and pagination
 */
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, search, type, evidenceLevel } = req.query;
  
  // Build query
  const query: any = {};
  
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { abstract: { $regex: search, $options: 'i' } },
      { keywords: { $in: [new RegExp(search as string, 'i')] } }
    ];
  }
  
  if (type) {
    query.type = type;
  }
  
  if (evidenceLevel) {
    query.evidenceLevel = evidenceLevel;
  }

  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const skip = (pageNum - 1) * limitNum;

  // Execute query with pagination
  const [literature, total] = await Promise.all([
    Literature.find(query)
      .sort({ 'publication.year': -1 })
      .skip(skip)
      .limit(limitNum)
      .select('title authors type publication.year evidenceLevel keywords abstract')
      .lean(),
    Literature.countDocuments(query)
  ]);

  const pagination = {
    currentPage: pageNum,
    totalPages: Math.ceil(total / limitNum),
    totalItems: total,
    itemsPerPage: limitNum,
    hasNext: pageNum < Math.ceil(total / limitNum),
    hasPrev: pageNum > 1
  };

  logger.info(`Retrieved ${literature.length} literature entries (page ${pageNum}/${pagination.totalPages})`);

  res.json(buildApiResponse({
    data: literature,
    pagination
  }, (req as any).requestId));
}));

/**
 * GET /api/v1/literature/:id
 * Get a specific literature entry by ID
 */
router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const literature = await Literature.findById(id)
    .populate('addedBy', 'name email')
    .lean();

  if (!literature) {
    return res.status(404).json(buildApiResponse({
      error: 'Literature entry not found',
      data: null
    }, (req as any).requestId));
  }

  logger.info(`Retrieved literature: ${literature.title} (${id})`);

  res.json(buildApiResponse({
    data: literature
  }, (req as any).requestId));
}));

export default router;