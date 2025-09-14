import mongoose, { Document, Schema } from 'mongoose';

// Literature interface for TypeScript
export interface ILiterature extends Document {
  _id: mongoose.Types.ObjectId;
  
  // Basic information
  title: string;
  authors: Array<{
    name: string;
    affiliation?: string;
    orcid?: string;
    isFirstAuthor: boolean;
    isCorrespondingAuthor: boolean;
  }>;
  
  // Publication details
  publication: {
    journal?: string;
    book?: string;
    conference?: string;
    publisher?: string;
    volume?: string;
    issue?: string;
    pages?: string;
    year: number;
    doi?: string;
    pmid?: string;
    isbn?: string;
    url?: string;
  };
  
  // Content classification
  type: 'research_paper' | 'review' | 'book' | 'book_chapter' | 'classical_text' | 
        'thesis' | 'conference_paper' | 'patent' | 'clinical_trial' | 'case_report' |
        'traditional_manuscript' | 'compendium' | 'commentary';
  
  // Language and cultural context
  language: string;
  originalLanguage?: string;
  translation?: {
    translator: string;
    year: number;
    notes?: string;
  };
  
  // Abstract and content
  abstract?: string;
  keywords: string[];
  meshTerms?: string[];
  
  // Research classification
  studyType?: 'in_vitro' | 'in_vivo' | 'clinical_trial' | 'observational' | 
             'case_control' | 'cohort' | 'systematic_review' | 'meta_analysis' |
             'traditional_knowledge' | 'ethnobotanical' | 'theoretical';
  
  evidenceLevel: 'very_high' | 'high' | 'moderate' | 'low' | 'very_low' | 'traditional';
  
  // Content focus
  focus: {
    herbs: string[];
    compounds: string[];
    diseases: string[];
    therapeuticAreas: string[];
    methodologies: string[];
  };
  
  // Traditional/Classical context
  traditionalContext?: {
    period: string;
    region: string;
    tradition: 'ayurveda' | 'unani' | 'siddha' | 'traditional_chinese' | 'folk' | 'other';
    originalTitle?: Record<string, string>; // Multi-language titles
    commentaries?: Array<{
      author: string;
      period: string;
      notes: string;
    }>;
    manuscripts?: Array<{
      location: string;
      catalogNumber?: string;
      condition: string;
    }>;
    authorBiography?: {
      birthYear?: number;
      deathYear?: number;
      region: string;
      school: string;
      notableWorks: string[];
    };
  };
  
  // Scientific validation
  scientificValidation?: {
    replicationStudies: number;
    citedBy: number;
    supportingEvidence: string[];
    contradictingEvidence: string[];
    currentStatus: 'validated' | 'partially_validated' | 'unvalidated' | 'refuted' | 'unknown';
    lastValidated: Date;
  };
  
  // Quality assessment
  quality: {
    peerReviewed: boolean;
    impactFactor?: number;
    quartile?: 'Q1' | 'Q2' | 'Q3' | 'Q4';
    citationCount: number;
    methodologyScore?: number;
    biasRisk?: 'low' | 'moderate' | 'high' | 'unclear';
  };
  
  // Content extraction
  extractedData?: {
    formulations: Array<{
      name: string;
      ingredients: Array<{
        herb: string;
        quantity?: string;
        preparation?: string;
      }>;
      preparation: string;
      dosage?: string;
      duration?: string;
      indications: string[];
    }>;
    
    compounds: Array<{
      name: string;
      source: string;
      concentration?: string;
      activity: string[];
      mechanism?: string;
    }>;
    
    clinicalFindings: Array<{
      indication: string;
      intervention: string;
      outcome: string;
      significance: string;
      sampleSize?: number;
      duration?: string;
    }>;
    
    safety: Array<{
      herb: string;
      adverseEvents: string[];
      contraindications: string[];
      interactions: string[];
      dosageGuidelines?: string;
    }>;
  };
  
  // Cross-references
  relatedLiterature: Array<{
    id: mongoose.Types.ObjectId;
    relationship: 'cites' | 'cited_by' | 'supports' | 'contradicts' | 'reviews' | 'extends';
    relevanceScore: number;
  }>;
  
  // Accessibility and availability
  access: {
    openAccess: boolean;
    subscription?: string;
    availability: 'freely_available' | 'subscription_required' | 'purchase_required' | 
                 'library_only' | 'restricted' | 'manuscript_only';
    digitalFormat: boolean;
    physicalLocation?: string[];
  };
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  addedBy: mongoose.Types.ObjectId;
  lastReviewedBy?: mongoose.Types.ObjectId;
  lastReviewedAt?: Date;
  status: 'active' | 'under_review' | 'archived' | 'deprecated';
  confidence: number;
  relevanceScore: number;
}

// Literature Schema
const LiteratureSchema = new Schema<ILiterature>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500,
    index: true
  },
  
  authors: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    affiliation: {
      type: String,
      trim: true
    },
    orcid: {
      type: String,
      validate: {
        validator: function(v: string) {
          return !v || /^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/.test(v);
        },
        message: 'Invalid ORCID format'
      }
    },
    isFirstAuthor: {
      type: Boolean,
      default: false
    },
    isCorrespondingAuthor: {
      type: Boolean,
      default: false
    }
  }],
  
  publication: {
    journal: {
      type: String,
      trim: true,
      index: true
    },
    book: {
      type: String,
      trim: true
    },
    conference: {
      type: String,
      trim: true
    },
    publisher: {
      type: String,
      trim: true
    },
    volume: String,
    issue: String,
    pages: String,
    year: {
      type: Number,
      required: true,
      min: 1000,
      max: new Date().getFullYear() + 1,
      index: true
    },
    doi: {
      type: String,
      unique: true,
      sparse: true,
      validate: {
        validator: function(v: string) {
          return !v || /^10\.\d{4,}\//.test(v);
        },
        message: 'Invalid DOI format'
      }
    },
    pmid: {
      type: String,
      unique: true,
      sparse: true,
      validate: {
        validator: function(v: string) {
          return !v || /^\d{8,}$/.test(v);
        },
        message: 'Invalid PMID format'
      }
    },
    isbn: {
      type: String,
      validate: {
        validator: function(v: string) {
          return !v || /^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)/.test(v);
        },
        message: 'Invalid ISBN format'
      }
    },
    url: {
      type: String,
      validate: {
        validator: function(v: string) {
          return !v || /^https?:\/\//.test(v);
        },
        message: 'Invalid URL format'
      }
    }
  },
  
  type: {
    type: String,
    required: true,
    enum: [
      'research_paper', 'review', 'book', 'book_chapter', 'classical_text',
      'thesis', 'conference_paper', 'patent', 'clinical_trial', 'case_report',
      'traditional_manuscript', 'compendium', 'commentary'
    ],
    index: true
  },
  
  language: {
    type: String,
    required: true,
    default: 'en',
    index: true
  },
  originalLanguage: String,
  translation: {
    translator: String,
    year: Number,
    notes: String
  },
  
  abstract: {
    type: String,
    maxlength: 5000
  },
  keywords: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  meshTerms: [String],
  
  studyType: {
    type: String,
    enum: [
      'in_vitro', 'in_vivo', 'clinical_trial', 'observational',
      'case_control', 'cohort', 'systematic_review', 'meta_analysis',
      'traditional_knowledge', 'ethnobotanical', 'theoretical'
    ],
    index: true
  },
  
  evidenceLevel: {
    type: String,
    required: true,
    enum: ['very_high', 'high', 'moderate', 'low', 'very_low', 'traditional'],
    default: 'moderate',
    index: true
  },
  
  focus: {
    herbs: [{
      type: String,
      trim: true,
      lowercase: true
    }],
    compounds: [{
      type: String,
      trim: true,
      lowercase: true
    }],
    diseases: [{
      type: String,
      trim: true,
      lowercase: true
    }],
    therapeuticAreas: [{
      type: String,
      trim: true,
      lowercase: true
    }],
    methodologies: [{
      type: String,
      trim: true,
      lowercase: true
    }]
  },
  
  traditionalContext: {
    period: {
      type: String,
      index: true
    },
    region: {
      type: String,
      index: true
    },
    tradition: {
      type: String,
      enum: ['ayurveda', 'unani', 'siddha', 'traditional_chinese', 'folk', 'other'],
      index: true
    },
    originalTitle: {
      type: Map,
      of: String
    },
    commentaries: [{
      author: String,
      period: String,
      notes: String
    }],
    manuscripts: [{
      location: String,
      catalogNumber: String,
      condition: {
        type: String,
        enum: ['excellent', 'good', 'fair', 'poor', 'fragmentary']
      }
    }],
    authorBiography: {
      birthYear: Number,
      deathYear: Number,
      region: String,
      school: String,
      notableWorks: [String]
    }
  },
  
  scientificValidation: {
    replicationStudies: {
      type: Number,
      default: 0,
      min: 0
    },
    citedBy: {
      type: Number,
      default: 0,
      min: 0
    },
    supportingEvidence: [String],
    contradictingEvidence: [String],
    currentStatus: {
      type: String,
      enum: ['validated', 'partially_validated', 'unvalidated', 'refuted', 'unknown'],
      default: 'unknown'
    },
    lastValidated: {
      type: Date,
      default: Date.now
    }
  },
  
  quality: {
    peerReviewed: {
      type: Boolean,
      required: true,
      default: true
    },
    impactFactor: {
      type: Number,
      min: 0,
      max: 100
    },
    quartile: {
      type: String,
      enum: ['Q1', 'Q2', 'Q3', 'Q4']
    },
    citationCount: {
      type: Number,
      default: 0,
      min: 0
    },
    methodologyScore: {
      type: Number,
      min: 0,
      max: 10
    },
    biasRisk: {
      type: String,
      enum: ['low', 'moderate', 'high', 'unclear'],
      default: 'unclear'
    }
  },
  
  extractedData: {
    formulations: [{
      name: { type: String, required: true },
      ingredients: [{
        herb: { type: String, required: true },
        quantity: String,
        preparation: String
      }],
      preparation: { type: String, required: true },
      dosage: String,
      duration: String,
      indications: [String]
    }],
    
    compounds: [{
      name: { type: String, required: true },
      source: { type: String, required: true },
      concentration: String,
      activity: [String],
      mechanism: String
    }],
    
    clinicalFindings: [{
      indication: { type: String, required: true },
      intervention: { type: String, required: true },
      outcome: { type: String, required: true },
      significance: { type: String, required: true },
      sampleSize: Number,
      duration: String
    }],
    
    safety: [{
      herb: { type: String, required: true },
      adverseEvents: [String],
      contraindications: [String],
      interactions: [String],
      dosageGuidelines: String
    }]
  },
  
  relatedLiterature: [{
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Literature',
      required: true
    },
    relationship: {
      type: String,
      enum: ['cites', 'cited_by', 'supports', 'contradicts', 'reviews', 'extends'],
      required: true
    },
    relevanceScore: {
      type: Number,
      min: 0,
      max: 1,
      required: true
    }
  }],
  
  access: {
    openAccess: {
      type: Boolean,
      required: true,
      default: false
    },
    subscription: String,
    availability: {
      type: String,
      enum: [
        'freely_available', 'subscription_required', 'purchase_required',
        'library_only', 'restricted', 'manuscript_only'
      ],
      default: 'subscription_required'
    },
    digitalFormat: {
      type: Boolean,
      default: true
    },
    physicalLocation: [String]
  },
  
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastReviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  lastReviewedAt: Date,
  
  status: {
    type: String,
    enum: ['active', 'under_review', 'archived', 'deprecated'],
    default: 'active',
    index: true
  },
  confidence: {
    type: Number,
    min: 0,
    max: 1,
    default: 0.8
  },
  relevanceScore: {
    type: Number,
    min: 0,
    max: 1,
    default: 0.5
  }
}, {
  timestamps: true
});

// Indexes for optimal performance
LiteratureSchema.index({ title: 'text', abstract: 'text', keywords: 'text' });
LiteratureSchema.index({ 'publication.year': -1 });
LiteratureSchema.index({ 'focus.herbs': 1 });
LiteratureSchema.index({ 'focus.compounds': 1 });
LiteratureSchema.index({ 'focus.therapeuticAreas': 1 });
LiteratureSchema.index({ evidenceLevel: 1, 'quality.citationCount': -1 });
LiteratureSchema.index({ type: 1, language: 1 });
LiteratureSchema.index({ 'traditionalContext.tradition': 1, 'traditionalContext.period': 1 });
LiteratureSchema.index({ 'scientificValidation.currentStatus': 1 });
LiteratureSchema.index({ status: 1, relevanceScore: -1 });

// Virtual fields
LiteratureSchema.virtual('citationString').get(function() {
  const authors = this.authors.map(a => a.name).join(', ');
  const year = this.publication.year;
  const title = this.title;
  const journal = this.publication.journal || this.publication.book || 'Unknown';
  
  return `${authors} (${year}). ${title}. ${journal}.`;
});

LiteratureSchema.virtual('ageInYears').get(function() {
  return new Date().getFullYear() - this.publication.year;
});

LiteratureSchema.virtual('firstAuthor').get(function() {
  return this.authors.find(a => a.isFirstAuthor) || this.authors[0];
});

LiteratureSchema.virtual('correspondingAuthor').get(function() {
  return this.authors.find(a => a.isCorrespondingAuthor);
});

// Instance methods
LiteratureSchema.methods.calculateQualityScore = function() {
  let score = 0;
  
  // Peer review bonus
  if (this.quality.peerReviewed) score += 0.3;
  
  // Impact factor consideration
  if (this.quality.impactFactor) {
    if (this.quality.impactFactor > 10) score += 0.3;
    else if (this.quality.impactFactor > 5) score += 0.2;
    else if (this.quality.impactFactor > 2) score += 0.1;
  }
  
  // Citation count
  const citationScore = Math.min(0.2, this.quality.citationCount / 100);
  score += citationScore;
  
  // Evidence level
  const evidenceLevels = {
    'very_high': 0.2,
    'high': 0.15,
    'moderate': 0.1,
    'low': 0.05,
    'very_low': 0.02,
    'traditional': 0.1
  };
  score += (evidenceLevels as any)[this.evidenceLevel] || 0;
  
  return Math.min(1, score);
};

LiteratureSchema.methods.getRelevanceForQuery = function(query: string, herbs: string[] = [], compounds: string[] = []) {
  let relevance = 0;
  const queryLower = query.toLowerCase();
  
  // Title and abstract relevance
  if (this.title.toLowerCase().includes(queryLower)) relevance += 0.3;
  if (this.abstract && this.abstract.toLowerCase().includes(queryLower)) relevance += 0.2;
  
  // Keyword relevance
  const keywordMatches = this.keywords.filter((k: any) => 
    k.includes(queryLower) || queryLower.includes(k)
  ).length;
  relevance += Math.min(0.2, keywordMatches * 0.05);
  
  // Herb relevance
  const herbMatches = herbs.filter((h: any) => 
    this.focus.herbs.some((fh: any) => fh.includes(h.toLowerCase()))
  ).length;
  relevance += Math.min(0.2, herbMatches * 0.1);
  
  // Compound relevance
  const compoundMatches = compounds.filter((c: any) => 
    this.focus.compounds.some((fc: any) => fc.includes(c.toLowerCase()))
  ).length;
  relevance += Math.min(0.2, compoundMatches * 0.1);
  
  return Math.min(1, relevance);
};

LiteratureSchema.methods.extractKeyFindings = function() {
  const findings: any[] = [];
  
  if (this.extractedData?.clinicalFindings) {
    this.extractedData.clinicalFindings.forEach((finding: any) => {
      findings.push({
        type: 'clinical',
        indication: finding.indication,
        intervention: finding.intervention,
        outcome: finding.outcome,
        significance: finding.significance,
        evidenceLevel: this.evidenceLevel
      });
    });
  }
  
  if (this.extractedData?.compounds) {
    this.extractedData.compounds.forEach((compound: any) => {
      findings.push({
        type: 'compound',
        name: compound.name,
        source: compound.source,
        activity: compound.activity,
        mechanism: compound.mechanism
      });
    });
  }
  
  return findings;
};

// Static methods
LiteratureSchema.statics.findByHerb = function(herbName: string) {
  return this.find({
    'focus.herbs': new RegExp(herbName, 'i'),
    status: 'active'
  }).sort({ relevanceScore: -1, 'quality.citationCount': -1 });
};

LiteratureSchema.statics.findByCompound = function(compoundName: string) {
  return this.find({
    'focus.compounds': new RegExp(compoundName, 'i'),
    status: 'active'
  }).sort({ relevanceScore: -1, 'quality.citationCount': -1 });
};

LiteratureSchema.statics.findByTherapeuticArea = function(area: string) {
  return this.find({
    'focus.therapeuticAreas': new RegExp(area, 'i'),
    status: 'active'
  }).sort({ evidenceLevel: 1, 'quality.citationCount': -1 });
};

LiteratureSchema.statics.findTraditionalTexts = function(tradition?: string) {
  const query: any = {
    type: { $in: ['classical_text', 'traditional_manuscript', 'compendium'] },
    status: 'active'
  };
  
  if (tradition) {
    query['traditionalContext.tradition'] = tradition;
  }
  
  return this.find(query).sort({ 'publication.year': 1 });
};

LiteratureSchema.statics.searchLiterature = function(searchQuery: string, options: any = {}) {
  const query: any = {
    $text: { $search: searchQuery },
    status: 'active'
  };
  
  if (options.evidenceLevel) {
    query.evidenceLevel = options.evidenceLevel;
  }
  
  if (options.type) {
    query.type = options.type;
  }
  
  if (options.yearFrom || options.yearTo) {
    query['publication.year'] = {};
    if (options.yearFrom) query['publication.year'].$gte = options.yearFrom;
    if (options.yearTo) query['publication.year'].$lte = options.yearTo;
  }
  
  return this.find(query, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } })
    .limit(options.limit || 100);
};

// Pre-save middleware
LiteratureSchema.pre('save', function(next) {
  // Calculate relevance score based on various factors
  this.relevanceScore = (this as any).calculateQualityScore();
  
  // Ensure at least one author is marked as first author
  if (this.authors.length > 0 && !this.authors.some((a: any) => a.isFirstAuthor)) {
    this.authors[0].isFirstAuthor = true;
  }
  
  // Auto-extract keywords from title and abstract
  if (!this.keywords || this.keywords.length === 0) {
    this.keywords = (this as any).extractKeywordsFromText();
  }
  
  next();
});

// Extract keywords from title and abstract
LiteratureSchema.methods.extractKeywordsFromText = function() {
  const text = `${this.title} ${this.abstract || ''}`.toLowerCase();
  const words = text.match(/\b\w{4,}\b/g) || [];
  
  // Common medical/botanical terms
  const relevantTerms = words.filter(word => 
    word.length > 3 && 
    !['the', 'and', 'with', 'from', 'this', 'that', 'were', 'been', 'have', 'they'].includes(word)
  );
  
  // Return unique terms, limited to 20
  return [...new Set(relevantTerms)].slice(0, 20);
};

// Export the model
export const Literature = mongoose.model<ILiterature>('Literature', LiteratureSchema);
export default Literature;