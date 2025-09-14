import { AgentBase, AgentInput, AgentOutput } from '../base/AgentBase';
export interface CompoundInput {
    compoundIdentifier: string;
    identifierType: 'smiles' | 'inchi' | 'name' | 'formula' | 'cas' | 'pubchem_cid';
    analysisType: 'structure' | 'properties' | 'bioactivity' | 'toxicity' | 'admet' | 'complete' | 'ayurvedic_profile';
    options?: {
        includeSimilar?: boolean;
        similarity_threshold?: number;
        predictTargets?: boolean;
        calculateADMET?: boolean;
        ayurvedicContext?: boolean;
        includeMetabolites?: boolean;
        computeDescriptors?: boolean;
        predict3DStructure?: boolean;
        analyzeFragments?: boolean;
        culturalRelevance?: 'indian' | 'global' | 'traditional';
    };
    context?: {
        plantSource?: string;
        extractionMethod?: string;
        traditionalUse?: string;
        doshaAffinity?: ('vata' | 'pitta' | 'kapha')[];
        therapeuticCategory?: string;
    };
}
export interface CompoundOutput {
    compound: CompoundData;
    analysis: CompoundAnalysis;
    predictions: CompoundPredictions;
    ayurvedicProfile?: AyurvedicProfile;
    similarCompounds?: SimilarCompound[];
    metabolites?: MetaboliteData[];
    interactionProfile?: InteractionProfile;
    safetyAssessment?: SafetyAssessment;
    metadata: AnalysisMetadata;
}
export interface CompoundData {
    id: string;
    name: string;
    smiles: string;
    inchi: string;
    inchiKey: string;
    molecularFormula: string;
    molecularWeight: number;
    exactMass: number;
    structure: string;
    structure3D?: string;
    iupacName: string;
    synonyms: string[];
    casNumber?: string;
    pubchemCID?: string;
    chemspiderID?: string;
    classification: {
        chemicalClass: string[];
        pharmacophore: string[];
        naturalProductClass?: string[];
        ayurvedicCategory?: string[];
    };
}
export interface CompoundAnalysis {
    descriptors: MolecularDescriptors;
    drugLikeness: DrugLikenessAnalysis;
    toxicity: ToxicityAnalysis;
    bioactivity: BioactivityAnalysis;
    admetProfile: ADMETProfile;
    fragmentAnalysis?: FragmentAnalysis;
    conformationalAnalysis?: ConformationalAnalysis;
}
export interface MolecularDescriptors {
    logP: number;
    logS: number;
    tpsa: number;
    hbd: number;
    hba: number;
    rotatablebonds: number;
    aromaticRings: number;
    heavyAtoms: number;
    complexity: number;
    fractionalCSP3: number;
    numHeteroAtoms: number;
    numSaturatedRings: number;
    numUnsaturatedRings: number;
    spherocity?: number;
    asphericity?: number;
    eccentricity?: number;
    pharmacophoreFingerprint?: string;
    lipophilicRegions?: number;
    hydrogenBondingRegions?: number;
}
export interface DrugLikenessAnalysis {
    lipinskiRule: {
        passes: boolean;
        violations: string[];
        score: number;
    };
    veberRule: {
        passes: boolean;
        violations: string[];
    };
    bbbPermeability: {
        predicted: boolean;
        confidence: number;
        reasoning: string;
    };
    absorption: {
        humanIntestinal: number;
        caco2Permeability: number;
        pgpSubstrate: boolean;
    };
    leadLikeness: {
        score: number;
        category: 'lead' | 'drug' | 'fragment' | 'other';
    };
}
export interface ToxicityAnalysis {
    acute: {
        oral_LD50: number;
        dermal_LD50?: number;
        inhalation_LC50?: number;
        toxicityClass: 'low' | 'moderate' | 'high' | 'very_high';
    };
    chronic: {
        carcinogenicity: {
            predicted: boolean;
            confidence: number;
            mechanism?: string;
        };
        mutagenicity: {
            ames_test: boolean;
            confidence: number;
        };
        reproductive: {
            developmental_toxicity: boolean;
            fertility_effects: boolean;
        };
    };
    organSpecific: {
        hepatotoxicity: number;
        cardiotoxicity: number;
        nephrotoxicity: number;
        neurotoxicity: number;
    };
    alerts: {
        structuralAlerts: string[];
        toxicophores: string[];
        recommendations: string[];
    };
}
export interface BioactivityAnalysis {
    targets: PredictedTarget[];
    pathways: string[];
    therapeuticAreas: string[];
    modeOfAction: string[];
    bindingAffinities: BindingAffinity[];
    selectivityProfile: {
        primary_targets: string[];
        off_targets: string[];
        selectivity_ratio: number;
    };
}
export interface ADMETProfile {
    absorption: {
        bioavailability: number;
        solubility: number;
        permeability: number;
        absorptionRate: string;
    };
    distribution: {
        volumeOfDistribution: number;
        proteinBinding: number;
        tissueDistribution: Record<string, number>;
        bbb_penetration: boolean;
    };
    metabolism: {
        cyp_substrates: string[];
        cyp_inhibitors: string[];
        metabolic_stability: number;
        clearance: number;
        half_life: number;
    };
    excretion: {
        renal_clearance: number;
        biliary_clearance: number;
        elimination_route: 'renal' | 'hepatic' | 'mixed';
    };
    toxicity: {
        hepatotoxicity_risk: 'low' | 'medium' | 'high';
        cardiotoxicity_risk: 'low' | 'medium' | 'high';
        skin_sensitization: boolean;
    };
}
export interface AyurvedicProfile {
    rasa: string[];
    virya: 'heating' | 'cooling';
    vipaka: string;
    doshaEffects: {
        vata: 'increase' | 'decrease' | 'balance';
        pitta: 'increase' | 'decrease' | 'balance';
        kapha: 'increase' | 'decrease' | 'balance';
    };
    therapeuticActions: string[];
    traditionalUses: string[];
    contraindications: string[];
    ayurvedicPharmacology: {
        guna: string[];
        karma: string[];
        prabhava?: string;
    };
    culturalContext: {
        sanskrit_name?: string;
        telugu_name?: string;
        classical_references: string[];
        traditional_preparations: string[];
    };
}
export interface SimilarCompound {
    compound: CompoundData;
    similarity: number;
    similarityType: 'structural' | 'pharmacophoric' | 'biological';
    sharedFeatures: string[];
}
export interface MetaboliteData {
    metabolite: CompoundData;
    pathway: string;
    enzyme: string;
    reaction_type: string;
    probability: number;
    site_of_metabolism: string;
}
export interface InteractionProfile {
    drug_interactions: DrugInteraction[];
    food_interactions: string[];
    herb_interactions: string[];
    warnings: string[];
}
export interface SafetyAssessment {
    overall_risk: 'low' | 'moderate' | 'high';
    risk_factors: string[];
    monitoring_parameters: string[];
    contraindications: string[];
    pregnancy_category?: 'A' | 'B' | 'C' | 'D' | 'X';
    lactation_safety: boolean;
    pediatric_considerations: string[];
    geriatric_considerations: string[];
}
export interface FragmentAnalysis {
    molecular_fragments: Fragment[];
    functional_groups: string[];
    ring_systems: RingSystem[];
    pharmacophoric_features: PharmacophoreFeature[];
}
export interface ConformationalAnalysis {
    conformers: Conformer[];
    flexibility: number;
    preferred_conformation: string;
    energy_barriers: number[];
}
export interface PredictedTarget {
    target_id: string;
    target_name: string;
    target_type: 'enzyme' | 'receptor' | 'transporter' | 'ion_channel' | 'other';
    confidence: number;
    activity_type: 'agonist' | 'antagonist' | 'inhibitor' | 'activator' | 'modulator';
    predicted_activity?: number;
}
export interface BindingAffinity {
    target: string;
    affinity_type: 'ki' | 'kd' | 'ic50' | 'ec50';
    value: number;
    unit: string;
    confidence: number;
}
export interface DrugInteraction {
    drug_name: string;
    interaction_type: 'synergistic' | 'antagonistic' | 'additive';
    mechanism: string;
    severity: 'minor' | 'moderate' | 'major';
    clinical_significance: string;
}
export interface Fragment {
    smiles: string;
    frequency: number;
    bioactivity_contribution: number;
    pharmacophore_type: string;
}
export interface RingSystem {
    ring_type: string;
    size: number;
    aromaticity: boolean;
    heteroatoms: string[];
}
export interface PharmacophoreFeature {
    feature_type: 'hydrophobic' | 'hydrogen_donor' | 'hydrogen_acceptor' | 'aromatic' | 'positive' | 'negative';
    coordinates: [number, number, number];
    importance: number;
}
export interface Conformer {
    id: string;
    energy: number;
    coordinates: number[][];
    rmsd_to_lowest?: number;
}
export interface CompoundPredictions {
    activity_prediction: ActivityPrediction[];
    side_effects: SideEffectPrediction[];
    drug_drug_interactions: string[];
    biomarkers: string[];
    therapeutic_indications: TherapeuticIndication[];
    dosing_recommendations?: DosingRecommendation;
}
export interface ActivityPrediction {
    endpoint: string;
    predicted_value: number;
    confidence: number;
    model_type: string;
    experimental_validation?: boolean;
}
export interface SideEffectPrediction {
    effect: string;
    probability: number;
    severity: 'mild' | 'moderate' | 'severe';
    mechanism?: string;
}
export interface TherapeuticIndication {
    indication: string;
    confidence: number;
    mechanism_of_action: string;
    clinical_evidence?: 'preclinical' | 'phase_i' | 'phase_ii' | 'phase_iii' | 'approved';
}
export interface DosingRecommendation {
    starting_dose: string;
    maintenance_dose: string;
    max_dose: string;
    frequency: string;
    route: string;
    special_populations?: Record<string, string>;
}
export interface AnalysisMetadata {
    timestamp: string;
    analysis_version: string;
    models_used: string[];
    confidence_threshold: number;
    processing_time: number;
    data_sources: string[];
    limitations: string[];
}
/**
 * Enhanced Compound Agent for comprehensive molecular analysis and drug discovery
 */
export declare class CompoundAgent extends AgentBase {
    private chemicalDatabase;
    private bioactivityDatabase;
    private toxicityModels;
    private ayurvedicDatabase;
    constructor();
    protected processTask(input: AgentInput): Promise<AgentOutput>;
    private validateCompoundInput;
    private identifyCompound;
    private performCompoundAnalysis;
    private calculateMolecularDescriptors;
    private assessDrugLikeness;
    private predictToxicity;
    private analyzeBioactivity;
    private predictADMET;
    private generatePredictions;
    private generateAyurvedicProfile;
    private findSimilarCompounds;
    private predictMetabolites;
    private generateInteractionProfile;
    private generateSafetyAssessment;
    private performFragmentAnalysis;
    private performConformationalAnalysis;
    private getAnalysisModels;
    private getAnalysisLimitations;
    private getProcessingSteps;
    private calculateOverallConfidence;
    private initializeCompoundDatabases;
}
