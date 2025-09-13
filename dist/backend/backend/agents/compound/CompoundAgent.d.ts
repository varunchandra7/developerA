import { AgentBase, AgentInput, AgentOutput } from '../base/AgentBase';
export interface CompoundInput {
    compoundIdentifier: string;
    identifierType: 'smiles' | 'inchi' | 'name' | 'formula';
    analysisType: 'structure' | 'properties' | 'bioactivity' | 'toxicity' | 'complete';
    options?: {
        includeSimilar?: boolean;
        similarity_threshold?: number;
        predictTargets?: boolean;
        calculateADMET?: boolean;
    };
}
export interface CompoundOutput {
    compound: CompoundData;
    analysis: CompoundAnalysis;
    predictions: CompoundPredictions;
    similarCompounds?: SimilarCompound[];
    metadata: AnalysisMetadata;
}
export interface CompoundData {
    id: string;
    name: string;
    smiles: string;
    inchi: string;
    molecularFormula: string;
    molecularWeight: number;
    structure: string;
    iupacName: string;
    synonyms: string[];
}
export interface CompoundAnalysis {
    descriptors: MolecularDescriptors;
    drugLikeness: DrugLikenessAnalysis;
    toxicity: ToxicityAnalysis;
    bioactivity: BioactivityAnalysis;
}
export interface MolecularDescriptors {
    logP: number;
    tpsa: number;
    hbd: number;
    hba: number;
    rotatablebonds: number;
    aromaticRings: number;
    heavyAtoms: number;
    charge: number;
}
export interface DrugLikenessAnalysis {
    lipinski: {
        compliant: boolean;
        violations: string[];
        score: number;
    };
    veber: {
        compliant: boolean;
        violations: string[];
        score: number;
    };
    qed: number;
    sa: number;
    np: number;
}
export interface ToxicityAnalysis {
    mutagenicity: {
        prediction: 'positive' | 'negative';
        confidence: number;
    };
    carcinogenicity: {
        prediction: 'positive' | 'negative';
        confidence: number;
    };
    hepatotoxicity: {
        prediction: 'positive' | 'negative';
        confidence: number;
    };
    cardiotoxicity: {
        prediction: 'positive' | 'negative';
        confidence: number;
    };
    ld50: {
        value: number;
        unit: string;
        confidence: number;
    };
}
export interface BioactivityAnalysis {
    targets: PredictedTarget[];
    activities: PredictedActivity[];
    pathways: string[];
    mechanisms: string[];
}
export interface PredictedTarget {
    id: string;
    name: string;
    type: string;
    confidence: number;
    bindingAffinity: number;
    species: string;
}
export interface PredictedActivity {
    assay: string;
    activity: string;
    value: number;
    unit: string;
    confidence: number;
}
export interface CompoundPredictions {
    admet: ADMETProperties;
    interactions: DrugInteraction[];
    metabolites: Metabolite[];
}
export interface ADMETProperties {
    absorption: {
        humanIntestinalAbsorption: number;
        caco2Permeability: number;
        bloodBrainBarrierPenetration: number;
    };
    distribution: {
        plasmaProteinBinding: number;
        volumeOfDistribution: number;
    };
    metabolism: {
        cyp450Inhibition: Record<string, number>;
        cyp450Substrate: Record<string, number>;
    };
    excretion: {
        renalClearance: number;
        halfLife: number;
    };
    toxicity: {
        herg: number;
        ames: number;
        skinSensitization: number;
    };
}
export interface DrugInteraction {
    partner: string;
    type: 'synergistic' | 'antagonistic' | 'additive';
    severity: 'low' | 'medium' | 'high';
    mechanism: string;
    confidence: number;
}
export interface Metabolite {
    smiles: string;
    name: string;
    pathway: string;
    enzyme: string;
    probability: number;
}
export interface SimilarCompound {
    id: string;
    name: string;
    smiles: string;
    similarity: number;
    source: string;
}
export interface AnalysisMetadata {
    timestamp: Date;
    version: string;
    methods: string[];
    confidence: number;
    warnings: string[];
}
/**
 * Compound Agent for analyzing chemical compounds and predicting their properties
 * Handles molecular analysis, ADMET prediction, and bioactivity assessment
 */
export declare class CompoundAgent extends AgentBase {
    private chemicalDatabase;
    private bioactivityDatabase;
    private toxicityModels;
    constructor();
    protected processTask(input: AgentInput): Promise<AgentOutput>;
    private validateCompoundInput;
    private identifyCompound;
    private performCompoundAnalysis;
    private calculateMolecularDescriptors;
    private assessDrugLikeness;
    private predictToxicity;
    private analyzeBioactivity;
    private generatePredictions;
    private predictADMET;
    private predictInteractions;
    private predictMetabolites;
    private findSimilarCompounds;
    private getAnalysisMethods;
    private calculateOverallConfidence;
    private generateWarnings;
    private initializeChemicalDatabase;
    updateDatabase(newCompounds: CompoundData[]): Promise<void>;
}
