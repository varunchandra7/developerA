import { Agent } from '@shared/types';
import { Document } from 'mongoose';
export interface AgentDocument extends Document, Omit<Agent, 'id'> {
    _id: string;
}
export declare const AgentModel: import("mongoose").Model<AgentDocument, {}, {}, {}, Document<unknown, {}, AgentDocument> & AgentDocument & Required<{
    _id: string;
}>, any>;
