"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Herb_1 = require("../models/Herb");
const asyncHandler_1 = require("../middleware/asyncHandler");
const response_1 = require("../utils/response");
const logger_1 = __importDefault(require("../utils/logger"));
const router = (0, express_1.Router)();
/**
 * GET /api/v1/herbs
 * Get all herbs with optional filtering and pagination
 */
router.get('/', (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { page = 1, limit = 10, search, dosha, rasa } = req.query;
    // Build query
    const query = {};
    if (search) {
        query.$text = { $search: search };
    }
    if (dosha) {
        query['properties.dosha'] = { $in: Array.isArray(dosha) ? dosha : [dosha] };
    }
    if (rasa) {
        query['properties.rasa'] = { $in: Array.isArray(rasa) ? rasa : [rasa] };
    }
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;
    // Execute query with pagination
    const [herbs, total] = await Promise.all([
        Herb_1.HerbModel.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum)
            .populate('compounds', 'name molecularFormula')
            .lean(),
        Herb_1.HerbModel.countDocuments(query)
    ]);
    const pagination = {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalItems: total,
        itemsPerPage: limitNum,
        hasNext: pageNum < Math.ceil(total / limitNum),
        hasPrev: pageNum > 1
    };
    logger_1.default.info(`Retrieved ${herbs.length} herbs (page ${pageNum}/${pagination.totalPages})`);
    res.json((0, response_1.buildApiResponse)({
        data: herbs,
        pagination
    }, req.requestId));
}));
/**
 * GET /api/v1/herbs/:id
 * Get a specific herb by ID
 */
router.get('/:id', (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const herb = await Herb_1.HerbModel.findById(id)
        .populate('compounds', 'name molecularFormula smiles bioactivity')
        .lean();
    if (!herb) {
        return res.status(404).json((0, response_1.buildApiResponse)({
            error: 'Herb not found',
            data: null
        }, req.requestId));
    }
    logger_1.default.info(`Retrieved herb: ${herb.name.english} (${id})`);
    res.json((0, response_1.buildApiResponse)({
        data: herb
    }, req.requestId));
}));
exports.default = router;
