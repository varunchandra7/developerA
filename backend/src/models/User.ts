import { Schema, model, Document } from 'mongoose';
import { User, UserRole } from '@shared/types';

export interface UserDocument extends Document, Omit<User, 'id'> {
  _id: string;
}

const userSchema = new Schema<UserDocument>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
  },
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100,
  },
  role: {
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.GUEST,
    required: true,
  },
  affiliations: [{
    type: String,
    trim: true,
  }],
  specializations: [{
    type: String,
    trim: true,
  }],
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

// Indexes for performance
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1 });
userSchema.index({ affiliations: 1 });
userSchema.index({ specializations: 1 });

export const UserModel = model<UserDocument>('User', userSchema);