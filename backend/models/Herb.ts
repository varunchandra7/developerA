import { AyurvedicHerb, Reference, ReferenceType, VerificationStatus } from '@shared/types';
import { Document, Schema, model } from 'mongoose';

export interface HerbDocument extends Document, Omit<AyurvedicHerb, 'id'> {
  _id: string;
}

const referenceSchema = new Schema<Reference>({
  type: {
    type: String,
    enum: Object.values(ReferenceType),
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  authors: [{
    type: String,
    trim: true,
  }],
  journal: {
    type: String,
    trim: true,
  },
  year: {
    type: Number,
    required: true,
    min: 1800,
    max: new Date().getFullYear() + 1,
  },
  doi: {
    type: String,
    trim: true,
    sparse: true,
  },
  pmid: {
    type: String,
    trim: true,
    sparse: true,
  },
  url: {
    type: String,
    trim: true,
  },
  pages: {
    type: String,
    trim: true,
  },
  volume: {
    type: String,
    trim: true,
  },
  issue: {
    type: String,
    trim: true,
  },
}, { _id: true });

const herbSchema = new Schema<HerbDocument>({
  name: {
    sanskrit: {
      type: String,
      required: true,
      trim: true,
    },
    english: {
      type: String,
      required: true,
      trim: true,
    },
    telugu: {
      type: String,
      required: true,
      trim: true,
    },
    botanical: {
      type: String,
      required: true,
      trim: true,
    },
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 5000,
  },
  properties: {
    rasa: [{
      type: String,
      enum: ['madhura', 'amla', 'lavana', 'katu', 'tikta', 'kashaya'],
    }],
    virya: {
      type: String,
      enum: ['ushna', 'sheeta'],
      required: true,
    },
    vipaka: {
      type: String,
      enum: ['madhura', 'amla', 'katu'],
      required: true,
    },
    guna: [{
      type: String,
      enum: [
        'guru', 'laghu', 'sheeta', 'ushna', 'snigdha', 'ruksha',
        'manda', 'tikshna', 'sthira', 'sara', 'mridu', 'kathina',
        'vishada', 'picchila', 'slakshna', 'khara', 'sthula', 'sukshma'
      ],
    }],
    dosha: [{
      type: String,
      enum: ['vata', 'pitta', 'kapha'],
    }],
  },
  therapeuticUses: [{
    type: String,
    trim: true,
  }],
  contraindications: [{
    type: String,
    trim: true,
  }],
  compounds: [{
    type: Schema.Types.ObjectId,
    ref: 'Compound',
  }],
  references: [referenceSchema],
  verificationStatus: {
    type: String,
    enum: Object.values(VerificationStatus),
    default: VerificationStatus.PENDING,
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

// Indexes for performance and search
herbSchema.index({ 'name.sanskrit': 'text', 'name.english': 'text', 'name.telugu': 'text', 'name.botanical': 'text' });
herbSchema.index({ 'properties.rasa': 1 });
herbSchema.index({ 'properties.virya': 1 });
herbSchema.index({ 'properties.vipaka': 1 });
herbSchema.index({ 'properties.dosha': 1 });
herbSchema.index({ therapeuticUses: 1 });
herbSchema.index({ verificationStatus: 1 });
herbSchema.index({ createdAt: -1 });

export const HerbModel = model<HerbDocument>('Herb', herbSchema);