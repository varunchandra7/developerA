import { AyurvedicHerb } from '@shared/types';
import { Document } from 'mongoose';
export interface HerbDocument extends Document, Omit<AyurvedicHerb, 'id'> {
    _id: string;
}
export declare const HerbModel: import("mongoose").Model<HerbDocument, {}, {}, {}, Document<unknown, {}, HerbDocument> & HerbDocument & Required<{
    _id: string;
}>, any>;
