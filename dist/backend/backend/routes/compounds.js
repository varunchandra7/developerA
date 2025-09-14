"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Compound_1 = __importDefault(require("../models/Compound"));
const asyncHandler_1 = require("../middleware/asyncHandler");
const response_1 = require("../utils/response");
const logger_1 = __importDefault(require("../utils/logger"));
const router = (0, express_1.Router)();
/**
 * GET /api/v1/compounds
 * Get all compounds with optional filtering and pagination
 */
router.get('/', (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { page = 1, limit = 10, search } = req.query;
    // Build query
    const query = {};
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { 'source.plantSource': { $regex: search, $options: 'i' } }
        ];
    }
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;
    try {
        // Execute query with pagination
        const [compounds, total] = await Promise.all([
            Compound_1.default.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNum)
                .select('name molecularFormula molecularWeight source bioactivity')
                .lean(),
            Compound_1.default.countDocuments(query)
        ]);
        const pagination = {
            currentPage: pageNum,
            totalPages: Math.ceil(total / limitNum),
            totalItems: total,
            itemsPerPage: limitNum,
            hasNext: pageNum < Math.ceil(total / limitNum),
            hasPrev: pageNum > 1
        };
        logger_1.default.info(`Retrieved ${compounds.length} compounds (page ${pageNum}/${pagination.totalPages})`);
        res.json((0, response_1.buildApiResponse)({
            data: compounds,
            pagination
        }, req.requestId));
    }
    catch (error) {
        logger_1.default.error('Error fetching compounds:', error);
        res.status(500).json((0, response_1.buildApiResponse)({
            error: 'Failed to fetch compounds',
            data: null
        }, req.requestId));
    }
}));
/**
 * GET /api/v1/compounds/:id
 * Get a specific compound by ID
 */
router.get('/:id', (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const compound = await Compound_1.default.findById(id).lean();
    if (!compound) {
        return res.status(404).json((0, response_1.buildApiResponse)({
            error: 'Compound not found',
            data: null
        }, req.requestId));
    }
    logger_1.default.info(`Retrieved compound: ${compound.name} (${id})`);
    res.json((0, response_1.buildApiResponse)({
        data: compound
    }, req.requestId));
}));
exports.default = router;
