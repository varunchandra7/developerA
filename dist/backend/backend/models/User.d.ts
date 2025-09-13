import { User } from '@shared/types';
import { Document } from 'mongoose';
export interface UserDocument extends Document, Omit<User, 'id'> {
    _id: string;
}
export declare const UserModel: import("mongoose").Model<UserDocument, {}, {}, {}, Document<unknown, {}, UserDocument> & UserDocument & Required<{
    _id: string;
}>, any>;
