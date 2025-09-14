"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Literature_1 = require("../models/Literature");
const asyncHandler_1 = require("../middleware/asyncHandler");
const response_1 = require("../utils/response");
const logger_1 = __importDefault(require("../utils/logger"));
const router = (0, express_1.Router)();
/**
 * GET /api/v1/literature
 * Get all literature with optional filtering and pagination
 */
router.get('/', (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { page = 1, limit = 10, search, type, evidenceLevel } = req.query;
    // Build query
    const query = {};
    if (search) {
        query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { abstract: { $regex: search, $options: 'i' } },
            { keywords: { $in: [new RegExp(search, 'i')] } }
        ];
    }
    if (type) {
        query.type = type;
    }
    if (evidenceLevel) {
        query.evidenceLevel = evidenceLevel;
    }
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;
    // Execute query with pagination
    const [literature, total] = await Promise.all([
        Literature_1.Literature.find(query)
            .sort({ 'publication.year': -1 })
            .skip(skip)
            .limit(limitNum)
            .select('title authors type publication.year evidenceLevel keywords abstract')
            .lean(),
        Literature_1.Literature.countDocuments(query)
    ]);
    const pagination = {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalItems: total,
        itemsPerPage: limitNum,
        hasNext: pageNum < Math.ceil(total / limitNum),
        hasPrev: pageNum > 1
    };
    logger_1.default.info(`Retrieved ${literature.length} literature entries (page ${pageNum}/${pagination.totalPages})`);
    res.json((0, response_1.buildApiResponse)({
        data: literature,
        pagination
    }, req.requestId));
}));
/**
 * GET /api/v1/literature/:id
 * Get a specific literature entry by ID
 */
router.get('/:id', (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const literature = await Literature_1.Literature.findById(id)
        .populate('addedBy', 'name email')
        .lean();
    if (!literature) {
        return res.status(404).json((0, response_1.buildApiResponse)({
            error: 'Literature entry not found',
            data: null
        }, req.requestId));
    }
    logger_1.default.info(`Retrieved literature: ${literature.title} (${id})`);
    res.json((0, response_1.buildApiResponse)({
        data: literature
    }, req.requestId));
}));
exports.default = router;
