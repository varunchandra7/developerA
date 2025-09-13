import { Agent, AgentMetrics, AgentStatus, AgentType } from '@shared/types';
import { Document, Schema, model } from 'mongoose';

export interface AgentDocument extends Document, Omit<Agent, 'id'> {
  _id: string;
}

const agentMetricsSchema = new Schema<AgentMetrics>({
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

const agentSchema = new Schema<AgentDocument>({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100,
  },
  type: {
    type: String,
    enum: Object.values(AgentType),
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
    enum: Object.values(AgentStatus),
    default: AgentStatus.INACTIVE,
  },
  configuration: {
    type: Schema.Types.Mixed,
    default: {},
  },
  metrics: {
    type: agentMetricsSchema,
    default: () => ({}),
  },
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
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

export const AgentModel = model<AgentDocument>('Agent', agentSchema);