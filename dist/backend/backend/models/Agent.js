"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentModel = void 0;
const types_1 = require("@shared/types");
const mongoose_1 = require("mongoose");
const agentMetricsSchema = new mongoose_1.Schema({
    totalTasks: {
        type: Number,
        default: 0,
        min: 0,
    },
    successfulTasks: {
        type: Number,
        default: 0,
        min: 0,
    },
    failedTasks: {
        type: Number,
        default: 0,
        min: 0,
    },
    averageExecutionTime: {
        type: Number,
        default: 0,
        min: 0,
    },
    accuracy: {
        type: Number,
        default: 0,
        min: 0,
        max: 1,
    },
    lastExecuted: {
        type: Date,
        default: Date.now,
    },
}, { _id: false });
const agentSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 100,
    },
    type: {
        type: String,
        enum: Object.values(types_1.AgentType),
        required: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000,
    },
    capabilities: [{
            type: String,
            trim: true,
        }],
    status: {
        type: String,
        enum: Object.values(types_1.AgentStatus),
        default: types_1.AgentStatus.INACTIVE,
    },
    configuration: {
        type: mongoose_1.Schema.Types.Mixed,
        default: {},
    },
    metrics: {
        type: agentMetricsSchema,
        default: () => ({}),
    },
}, {
    timestamps: true,
    toJSON: {
        transform: function (doc, ret) {
            ret['id'] = ret['_id'];
            delete ret['_id'];
            delete ret['__v'];
            return ret;
        }
    }
});
// Indexes
agentSchema.index({ type: 1 });
agentSchema.index({ status: 1 });
agentSchema.index({ name: 1 }, { unique: true });
agentSchema.index({ capabilities: 1 });
agentSchema.index({ 'metrics.accuracy': -1 });
exports.AgentModel = (0, mongoose_1.model)('Agent', agentSchema);
