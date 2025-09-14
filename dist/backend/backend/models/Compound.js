"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Compound = void 0;
const mongoose_1 = __importStar(require("mongoose"));
// Compound Schema
const CompoundSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    smiles: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v) {
                // Basic SMILES validation - should contain valid chemical symbols
                return /^[A-Za-z0-9@+\-\[\]()=#\\\/]+$/.test(v);
            },
            message: 'Invalid SMILES notation'
        }
    },
    inchi: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v) {
                return v.startsWith('InChI=');
            },
            message: 'Invalid InChI notation'
        }
    },
    inchiKey: {
        type: String,
        unique: true,
        sparse: true,
        validate: {
            validator: function (v) {
                return /^[A-Z]{14}-[A-Z]{10}-[A-Z]$/.test(v);
            },
            message: 'Invalid InChI Key format'
        }
    },
    molecularFormula: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^[A-Z][a-z]?[0-9]*/.test(v);
            },
            message: 'Invalid molecular formula'
        }
    },
    molecularWeight: {
        type: Number,
        required: true,
        min: 0,
        max: 10000
    },
    exactMass: {
        type: Number,
        min: 0,
        max: 10000
    },
    iupacName: {
        type: String,
        required: true
    },
    commonNames: [String],
    casNumber: {
        type: String,
        sparse: true,
        unique: true,
        validate: {
            validator: function (v) {
                return /^\d{2,7}-\d{2}-\d$/.test(v);
            },
            message: 'Invalid CAS number format'
        }
    },
    pubchemCID: String,
    chemspiderID: String,
    source: {
        plantSource: String,
        synthetic: {
            type: Boolean,
            required: true,
            default: false
        },
        traditionalName: {
            type: Map,
            of: String
        },
        extractionMethod: String,
        purity: {
            type: Number,
            min: 0,
            max: 100
        }
    },
    properties: {
        melting_point: Number,
        boiling_point: Number,
        density: Number,
        solubility: {
            water: {
                type: String,
                required: true,
                enum: ['insoluble', 'slightly_soluble', 'moderately_soluble', 'highly_soluble', 'miscible']
            },
            ethanol: {
                type: String,
                required: true,
                enum: ['insoluble', 'slightly_soluble', 'moderately_soluble', 'highly_soluble', 'miscible']
            },
            other: {
                type: Map,
                of: String
            }
        },
        stability: {
            light: {
                type: String,
                enum: ['stable', 'unstable', 'photosensitive'],
                default: 'stable'
            },
            heat: {
                type: String,
                enum: ['stable', 'unstable', 'thermolabile'],
                default: 'stable'
            },
            air: {
                type: String,
                enum: ['stable', 'unstable', 'oxidizes'],
                default: 'stable'
            },
            ph: {
                type: String,
                enum: ['stable', 'acid_labile', 'base_labile'],
                default: 'stable'
            }
        },
        logP: {
            type: Number,
            required: true,
            min: -10,
            max: 10
        },
        pka: [Number],
        bioavailability: {
            type: Number,
            required: true,
            min: 0,
            max: 100
        },
        halfLife: {
            type: Number,
            required: true,
            min: 0
        }
    },
    bioactivity: {
        targets: [{
                name: { type: String, required: true },
                type: {
                    type: String,
                    required: true,
                    enum: ['enzyme', 'receptor', 'transporter', 'ion_channel', 'protein', 'dna', 'rna']
                },
                affinity: Number,
                selectivity: Number
            }],
        mechanisms: [String],
        therapeuticAreas: [String],
        pathways: [String],
        cellularEffects: [String]
    },
    admet: {
        absorption: {
            humanIntestinal: { type: Number, min: 0, max: 100 },
            caco2Permeability: { type: Number, min: 0 },
            pgpSubstrate: { type: Boolean, default: false }
        },
        distribution: {
            volumeOfDistribution: { type: Number, min: 0 },
            proteinBinding: { type: Number, min: 0, max: 100 },
            bbbPermeability: { type: Boolean, default: false }
        },
        metabolism: {
            cypSubstrates: [String],
            cypInhibitors: [String],
            metabolites: [String],
            clearance: { type: Number, min: 0 }
        },
        excretion: {
            renalClearance: { type: Number, min: 0 },
            biliaryClearance: { type: Number, min: 0 },
            eliminationRoute: {
                type: String,
                enum: ['renal', 'hepatic', 'biliary', 'pulmonary', 'mixed'],
                default: 'mixed'
            }
        },
        toxicity: {
            acuteToxicity: {
                oralLD50: { type: Number, min: 0 },
                toxicityClass: {
                    type: String,
                    enum: ['low', 'moderate', 'high', 'very_high'],
                    default: 'moderate'
                }
            },
            chronicToxicity: {
                carcinogenicity: { type: Boolean, default: false },
                mutagenicity: { type: Boolean, default: false },
                reproductiveToxicity: { type: Boolean, default: false }
            },
            organToxicity: {
                hepatotoxicity: { type: Number, min: 0, max: 10, default: 1 },
                cardiotoxicity: { type: Number, min: 0, max: 10, default: 1 },
                nephrotoxicity: { type: Number, min: 0, max: 10, default: 1 },
                neurotoxicity: { type: Number, min: 0, max: 10, default: 1 }
            }
        }
    },
    ayurvedicContext: {
        associatedHerb: String,
        traditionalName: {
            type: Map,
            of: String
        },
        doshaEffect: [{
                type: String,
                enum: ['vata', 'pitta', 'kapha']
            }],
        rasa: [String],
        virya: {
            type: String,
            enum: ['ushna', 'sheeta']
        },
        vipaka: {
            type: String,
            enum: ['madhura', 'amla', 'katu']
        },
        prabhava: String,
        traditionalUses: [String],
        classicalReferences: [String]
    },
    safety: {
        adverseEffects: [String],
        contraindications: [String],
        drugInteractions: [{
                drug: { type: String, required: true },
                severity: {
                    type: String,
                    enum: ['mild', 'moderate', 'severe'],
                    required: true
                },
                mechanism: { type: String, required: true }
            }],
        pregnancyCategory: {
            type: String,
            enum: ['A', 'B', 'C', 'D', 'X']
        },
        pediatricUse: String,
        geriatricUse: String
    },
    research: {
        clinicalTrials: [{
                phase: {
                    type: String,
                    enum: ['preclinical', 'phase_1', 'phase_2', 'phase_3', 'phase_4'],
                    required: true
                },
                indication: { type: String, required: true },
                status: {
                    type: String,
                    enum: ['planned', 'recruiting', 'active', 'completed', 'terminated'],
                    required: true
                },
                identifier: String
            }],
        publications: { type: Number, default: 0, min: 0 },
        lastValidated: { type: Date, default: Date.now },
        evidenceLevel: {
            type: String,
            enum: ['preclinical', 'phase_1', 'phase_2', 'phase_3', 'approved'],
            default: 'preclinical'
        }
    },
    classification: {
        chemicalClass: [String],
        pharmacologicalClass: [String],
        therapeuticClass: [String],
        naturalProductClass: [String]
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'under_review', 'deprecated'],
        default: 'active'
    },
    confidence: {
        type: Number,
        min: 0,
        max: 1,
        default: 0.8
    },
    dataQuality: {
        completeness: { type: Number, min: 0, max: 1, default: 0.8 },
        accuracy: { type: Number, min: 0, max: 1, default: 0.8 },
        reliability: { type: Number, min: 0, max: 1, default: 0.8 }
    },
    version: { type: Number, default: 1 }
}, {
    timestamps: true,
    versionKey: 'version'
});
// Indexes for optimal query performance
CompoundSchema.index({ name: 'text', commonNames: 'text', iupacName: 'text' });
CompoundSchema.index({ 'source.plantSource': 1 });
CompoundSchema.index({ 'bioactivity.therapeuticAreas': 1 });
CompoundSchema.index({ 'classification.chemicalClass': 1 });
CompoundSchema.index({ 'admet.toxicity.acuteToxicity.toxicityClass': 1 });
CompoundSchema.index({ 'research.evidenceLevel': 1 });
CompoundSchema.index({ status: 1, confidence: -1 });
// Compound indexes for molecular similarity searches
CompoundSchema.index({ smiles: 1 });
CompoundSchema.index({ inchi: 1 });
CompoundSchema.index({ molecularFormula: 1 });
CompoundSchema.index({ molecularWeight: 1 });
// Ayurvedic context indexes
CompoundSchema.index({ 'ayurvedicContext.associatedHerb': 1 });
CompoundSchema.index({ 'ayurvedicContext.doshaEffect': 1 });
// Virtual for formatted molecular weight
CompoundSchema.virtual('formattedMolecularWeight').get(function () {
    return `${this.molecularWeight.toFixed(2)} g/mol`;
});
// Virtual for toxicity risk assessment
CompoundSchema.virtual('toxicityRisk').get(function () {
    const toxicity = this.admet.toxicity;
    const avgOrganToxicity = (toxicity.organToxicity.hepatotoxicity +
        toxicity.organToxicity.cardiotoxicity +
        toxicity.organToxicity.nephrotoxicity +
        toxicity.organToxicity.neurotoxicity) / 4;
    if (avgOrganToxicity < 3)
        return 'Low';
    if (avgOrganToxicity < 6)
        return 'Moderate';
    return 'High';
});
// Methods
CompoundSchema.methods.getDrugLikenessScore = function () {
    const mw = this.molecularWeight;
    const logP = this.properties.logP;
    const hbd = this.properties.hbd || 0;
    const hba = this.properties.hba || 0;
    // Lipinski's Rule of Five
    const violations = [
        mw > 500,
        logP > 5,
        hbd > 5,
        hba > 10
    ].filter(Boolean).length;
    return {
        violations,
        passes: violations === 0,
        score: Math.max(0, 1 - (violations * 0.25))
    };
};
CompoundSchema.methods.getAyurvedicProfile = function () {
    if (!this.ayurvedicContext)
        return null;
    return {
        herb: this.ayurvedicContext.associatedHerb,
        traditionalNames: this.ayurvedicContext.traditionalName,
        doshaBalance: this.ayurvedicContext.doshaEffect,
        taste: this.ayurvedicContext.rasa,
        potency: this.ayurvedicContext.virya,
        postDigestive: this.ayurvedicContext.vipaka,
        specialEffect: this.ayurvedicContext.prabhava,
        uses: this.ayurvedicContext.traditionalUses,
        references: this.ayurvedicContext.classicalReferences
    };
};
// Static methods
CompoundSchema.statics.findByMolecularWeight = function (minMW, maxMW) {
    return this.find({
        molecularWeight: { $gte: minMW, $lte: maxMW },
        status: 'active'
    });
};
CompoundSchema.statics.findByTherapeuticArea = function (area) {
    return this.find({
        'bioactivity.therapeuticAreas': area,
        status: 'active'
    }).sort({ confidence: -1 });
};
CompoundSchema.statics.findByHerb = function (herbName) {
    return this.find({
        'ayurvedicContext.associatedHerb': new RegExp(herbName, 'i'),
        status: 'active'
    });
};
CompoundSchema.statics.searchCompounds = function (query, options = {}) {
    const searchQuery = {
        $text: { $search: query },
        status: 'active'
    };
    if (options.therapeuticArea) {
        searchQuery['bioactivity.therapeuticAreas'] = options.therapeuticArea;
    }
    if (options.toxicityClass) {
        searchQuery['admet.toxicity.acuteToxicity.toxicityClass'] = options.toxicityClass;
    }
    return this.find(searchQuery, { score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' } })
        .limit(options.limit || 50);
};
// Pre-save middleware
CompoundSchema.pre('save', function (next) {
    // Auto-generate InChI Key if not provided
    if (this.inchi && !this.inchiKey) {
        // In a real implementation, this would use a chemical informatics library
        // For now, we'll generate a placeholder
        this.inchiKey = `PLACEHOLDER-${Date.now()}-A`;
    }
    // Calculate data quality score
    const completeness = this.calculateCompleteness();
    const accuracy = this.calculateAccuracy();
    this.dataQuality = {
        completeness,
        accuracy,
        reliability: (completeness + accuracy) / 2
    };
    next();
});
// Calculate completeness score
CompoundSchema.methods.calculateCompleteness = function () {
    const requiredFields = [
        'name', 'smiles', 'inchi', 'molecularFormula', 'molecularWeight',
        'properties.logP', 'properties.bioavailability', 'properties.halfLife'
    ];
    const optionalFields = [
        'casNumber', 'source.plantSource', 'bioactivity.targets',
        'admet.absorption', 'safety.adverseEffects'
    ];
    let score = 0;
    const totalPoints = requiredFields.length * 2 + optionalFields.length;
    // Required fields worth 2 points each
    requiredFields.forEach(field => {
        if (this.get(field))
            score += 2;
    });
    // Optional fields worth 1 point each
    optionalFields.forEach(field => {
        if (this.get(field))
            score += 1;
    });
    return score / totalPoints;
};
// Calculate accuracy score based on data validation
CompoundSchema.methods.calculateAccuracy = function () {
    let score = 1.0;
    // Molecular weight consistency check
    if (this.exactMass && Math.abs(this.molecularWeight - this.exactMass) > 10) {
        score -= 0.1;
    }
    // LogP reasonableness check
    if (Math.abs(this.properties.logP) > 8) {
        score -= 0.1;
    }
    // Bioavailability validation
    if (this.properties.bioavailability < 0 || this.properties.bioavailability > 100) {
        score -= 0.2;
    }
    return Math.max(0, score);
};
// Export the model
exports.Compound = mongoose_1.default.model('Compound', CompoundSchema);
exports.default = exports.Compound;
