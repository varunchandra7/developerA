import mongoose, { Document } from 'mongoose';
export interface ICompound extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    smiles: string;
    inchi: string;
    inchiKey: string;
    molecularFormula: string;
    molecularWeight: number;
    exactMass: number;
    iupacName: string;
    commonNames: string[];
    casNumber?: string;
    pubchemCID?: string;
    chemspiderID?: string;
    source: {
        plantSource?: string;
        synthetic: boolean;
        traditionalName?: Record<string, string>;
        extractionMethod?: string;
        purity?: number;
    };
    properties: {
        melting_point?: number;
        boiling_point?: number;
        density?: number;
        solubility: {
            water: string;
            ethanol: string;
            other?: Record<string, string>;
        };
        stability: {
            light: string;
            heat: string;
            air: string;
            ph: string;
        };
        logP: number;
        pka?: number[];
        bioavailability: number;
        halfLife: number;
    };
    bioactivity: {
        targets: Array<{
            name: string;
            type: string;
            affinity?: number;
            selectivity?: number;
        }>;
        mechanisms: string[];
        therapeuticAreas: string[];
        pathways: string[];
        cellularEffects: string[];
    };
    admet: {
        absorption: {
            humanIntestinal: number;
            caco2Permeability: number;
            pgpSubstrate: boolean;
        };
        distribution: {
            volumeOfDistribution: number;
            proteinBinding: number;
            bbbPermeability: boolean;
        };
        metabolism: {
            cypSubstrates: string[];
            cypInhibitors: string[];
            metabolites: string[];
            clearance: number;
        };
        excretion: {
            renalClearance: number;
            biliaryClearance: number;
            eliminationRoute: string;
        };
        toxicity: {
            acuteToxicity: {
                oralLD50: number;
                toxicityClass: 'low' | 'moderate' | 'high' | 'very_high';
            };
            chronicToxicity: {
                carcinogenicity: boolean;
                mutagenicity: boolean;
                reproductiveToxicity: boolean;
            };
            organToxicity: {
                hepatotoxicity: number;
                cardiotoxicity: number;
                nephrotoxicity: number;
                neurotoxicity: number;
            };
        };
    };
    ayurvedicContext?: {
        associatedHerb: string;
        traditionalName: Record<string, string>;
        doshaEffect: Array<'vata' | 'pitta' | 'kapha'>;
        rasa: string[];
        virya: string;
        vipaka: string;
        prabhava?: string;
        traditionalUses: string[];
        classicalReferences: string[];
    };
    safety: {
        adverseEffects: string[];
        contraindications: string[];
        drugInteractions: Array<{
            drug: string;
            severity: 'mild' | 'moderate' | 'severe';
            mechanism: string;
        }>;
        pregnancyCategory?: string;
        pediatricUse?: string;
        geriatricUse?: string;
    };
    research: {
        clinicalTrials: Array<{
            phase: string;
            indication: string;
            status: string;
            identifier?: string;
        }>;
        publications: number;
        lastValidated: Date;
        evidenceLevel: 'preclinical' | 'phase_1' | 'phase_2' | 'phase_3' | 'approved';
    };
    classification: {
        chemicalClass: string[];
        pharmacologicalClass: string[];
        therapeuticClass: string[];
        naturalProductClass?: string[];
    };
    createdAt: Date;
    updatedAt: Date;
    version: number;
    status: 'active' | 'inactive' | 'under_review' | 'deprecated';
    confidence: number;
    dataQuality: {
        completeness: number;
        accuracy: number;
        reliability: number;
    };
}
export declare const Compound: mongoose.Model<ICompound, {}, {}, {}, mongoose.Document<unknown, {}, ICompound> & ICompound & Required<{
    _id: mongoose.Types.ObjectId;
}>, any>;
export default Compound;
