import { AgentBase, AgentInput, AgentOutput } from '../base/AgentBase';
export interface CrossRefInput {
    sourceType: 'compound' | 'literature' | 'traditional_text' | 'modern_study' | 'therapeutic_area';
    sourceIdentifier: string;
    targetType: 'compound' | 'literature' | 'traditional_text' | 'modern_study' | 'therapeutic_area' | 'all';
    mappingMode: 'semantic' | 'structural' | 'therapeutic' | 'cultural' | 'comprehensive';
    options?: {
        includeAyurvedicContext?: boolean;
        crossLanguageMapping?: boolean;
        temporalAnalysis?: boolean;
        confidenceThreshold?: number;
        maxResults?: number;
        includeEvidence?: boolean;
        culturalFilter?: ('indian' | 'global' | 'traditional')[];
        timeRange?: {
            start?: string;
            end?: string;
        };
    };
    context?: {
        researchDomain?: string;
        therapeuticCategory?: string;
        culturalBackground?: string;
        languagePreference?: string[];
        analysisDepth?: 'basic' | 'detailed' | 'comprehensive';
    };
}
export interface CrossRefOutput {
    sourceEntity: EntityData;
    mappedEntities: MappedEntity[];
    correlationAnalysis: CorrelationAnalysis;
    knowledgeBridge: KnowledgeBridge;
    culturalContext: CulturalContext;
    evidenceSupport: EvidenceSupport;
    recommendations: CrossRefRecommendation[];
    metadata: CrossRefMetadata;
}
export interface EntityData {
    id: string;
    type: 'compound' | 'literature' | 'traditional_text' | 'modern_study' | 'therapeutic_area';
    name: string;
    description: string;
    categories: string[];
    properties: Record<string, any>;
    culturalMetadata: {
        origin: string;
        culturalSignificance: string;
        traditionalNames: Record<string, string>;
        historicalContext: string;
    };
    modernContext: {
        scientificClassification: string[];
        researchStatus: string;
        clinicalRelevance: string;
        regulatoryStatus?: string;
    };
}
export interface MappedEntity {
    entity: EntityData;
    mappingScore: number;
    mappingType: 'exact' | 'partial' | 'semantic' | 'contextual' | 'inferred';
    confidence: number;
    relationshipType: RelationshipType;
    evidenceStrength: 'strong' | 'moderate' | 'weak' | 'preliminary';
    correlationFactors: CorrelationFactor[];
    crossLinguisticMapping?: CrossLinguisticMapping;
}
export interface RelationshipType {
    primary: 'identical' | 'similar' | 'related' | 'derived' | 'antagonistic' | 'synergistic';
    secondary?: string[];
    mechanism?: string;
    therapeuticRelevance: 'direct' | 'indirect' | 'supportive' | 'contraindicated';
    temporalRelation?: 'historical' | 'contemporary' | 'emerging';
}
export interface CorrelationFactor {
    factor: string;
    impact: number;
    category: 'structural' | 'functional' | 'therapeutic' | 'cultural' | 'temporal';
    description: string;
    evidenceLevel: 'high' | 'medium' | 'low';
}
export interface CrossLinguisticMapping {
    sourceLanguage: string;
    targetLanguage: string;
    directTranslation?: string;
    conceptualMapping: string[];
    culturalEquivalents: string[];
    linguisticNotes: string[];
    etymologicalConnection?: string;
}
export interface CorrelationAnalysis {
    overallCorrelation: number;
    correlationCategories: {
        structural: number;
        functional: number;
        therapeutic: number;
        cultural: number;
        temporal: number;
    };
    significantPatterns: Pattern[];
    divergencePoints: DivergencePoint[];
    confidenceIntervals: {
        lower: number;
        upper: number;
        confidence_level: number;
    };
}
export interface Pattern {
    type: 'convergent' | 'divergent' | 'complementary' | 'contradictory';
    description: string;
    strength: number;
    domains: string[];
    examples: PatternExample[];
    implications: string[];
}
export interface PatternExample {
    source: string;
    target: string;
    relationship: string;
    evidence: string;
    confidence: number;
}
export interface DivergencePoint {
    aspect: string;
    traditionalView: string;
    modernView: string;
    reconciliation?: string;
    researchGap: boolean;
    priority: 'high' | 'medium' | 'low';
}
export interface KnowledgeBridge {
    traditionalKnowledge: TraditionalKnowledge;
    modernScience: ModernScience;
    integrationPoints: IntegrationPoint[];
    researchOpportunities: ResearchOpportunity[];
    validationStatus: ValidationStatus;
}
export interface TraditionalKnowledge {
    system: 'ayurveda' | 'siddha' | 'unani' | 'folk' | 'tribal' | 'mixed';
    concepts: TraditionalConcept[];
    practiceHistory: PracticeHistory;
    textualReferences: TextualReference[];
    preparation_methods: PreparationMethod[];
    usage_guidelines: UsageGuideline[];
}
export interface TraditionalConcept {
    concept: string;
    description: string;
    sanskrit_term?: string;
    telugu_term?: string;
    tamil_term?: string;
    contextual_meaning: string;
    modern_equivalent?: string;
    therapeutic_category: string;
}
export interface PracticeHistory {
    timeline: TimelineEvent[];
    regional_variations: RegionalVariation[];
    evolution: EvolutionaryChange[];
    continuity_score: number;
}
export interface TimelineEvent {
    period: string;
    event: string;
    significance: string;
    evidence_type: 'textual' | 'archaeological' | 'oral' | 'practice';
}
export interface RegionalVariation {
    region: string;
    variation: string;
    reason: string;
    current_status: 'active' | 'declining' | 'extinct' | 'reviving';
}
export interface EvolutionaryChange {
    change_type: 'addition' | 'modification' | 'discontinuation' | 'revival';
    description: string;
    timeframe: string;
    driving_factors: string[];
}
export interface TextualReference {
    text: string;
    author?: string;
    period: string;
    chapter_verse?: string;
    relevance: string;
    translation: string;
    commentary?: string;
}
export interface PreparationMethod {
    method: string;
    description: string;
    traditional_name: string;
    modern_equivalent?: string;
    safety_considerations: string[];
    efficacy_factors: string[];
}
export interface UsageGuideline {
    indication: string;
    dosage: string;
    duration: string;
    contraindications: string[];
    synergistic_combinations: string[];
    monitoring_requirements: string[];
}
export interface ModernScience {
    classification: ScientificClassification;
    research_findings: ResearchFinding[];
    clinical_studies: ClinicalStudy[];
    molecular_basis: MolecularBasis;
    regulatory_status: RegulatoryStatus;
}
export interface ScientificClassification {
    taxonomy?: string[];
    chemical_class?: string[];
    pharmacological_class?: string[];
    therapeutic_class?: string[];
    mechanism_of_action?: string[];
}
export interface ResearchFinding {
    study_type: 'in_vitro' | 'in_vivo' | 'clinical' | 'epidemiological' | 'meta_analysis';
    finding: string;
    significance: string;
    evidence_level: 'high' | 'moderate' | 'low' | 'preliminary';
    publication_year: number;
    journal?: string;
    doi?: string;
}
export interface ClinicalStudy {
    phase: 'preclinical' | 'phase_i' | 'phase_ii' | 'phase_iii' | 'phase_iv' | 'post_market';
    design: string;
    population: string;
    outcomes: ClinicalOutcome[];
    status: 'ongoing' | 'completed' | 'terminated' | 'planned';
    implications: string[];
}
export interface ClinicalOutcome {
    outcome_type: 'primary' | 'secondary' | 'exploratory';
    measure: string;
    result: string;
    statistical_significance: boolean;
    clinical_significance: string;
}
export interface MolecularBasis {
    targets: string[];
    pathways: string[];
    biomarkers: string[];
    mechanism_details: string;
    structure_activity_relationships?: string[];
}
export interface RegulatoryStatus {
    fda_status?: string;
    ema_status?: string;
    who_status?: string;
    indian_regulatory_status?: string;
    traditional_medicine_recognition?: string;
    safety_alerts?: string[];
}
export interface IntegrationPoint {
    aspect: string;
    traditional_perspective: string;
    modern_perspective: string;
    synthesis: string;
    validation_level: 'validated' | 'partially_validated' | 'unvalidated' | 'contradicted';
    research_priority: 'high' | 'medium' | 'low';
}
export interface ResearchOpportunity {
    opportunity_type: 'mechanism_elucidation' | 'clinical_validation' | 'safety_assessment' | 'optimization' | 'novel_application';
    description: string;
    potential_impact: 'high' | 'medium' | 'low';
    feasibility: 'high' | 'medium' | 'low';
    estimated_timeline: string;
    required_resources: string[];
    potential_collaborators: string[];
}
export interface ValidationStatus {
    overall_validation: 'high' | 'moderate' | 'low' | 'conflicting';
    validation_categories: {
        safety: 'validated' | 'partially_validated' | 'unvalidated' | 'concerns';
        efficacy: 'validated' | 'partially_validated' | 'unvalidated' | 'conflicting';
        mechanism: 'established' | 'proposed' | 'unknown' | 'multiple';
        dosage: 'standardized' | 'variable' | 'unstudied';
    };
    evidence_gaps: string[];
    validation_recommendations: string[];
}
export interface CulturalContext {
    cultural_significance: CulturalSignificance;
    cross_cultural_perspectives: CrossCulturalPerspective[];
    linguistic_analysis: LinguisticAnalysis;
    societal_impact: SocietalImpact;
    preservation_status: PreservationStatus;
}
export interface CulturalSignificance {
    importance_level: 'high' | 'moderate' | 'low';
    cultural_domains: string[];
    symbolic_meanings: string[];
    ritual_usage?: string[];
    social_context: string;
    generational_transmission: 'strong' | 'moderate' | 'weak' | 'at_risk';
}
export interface CrossCulturalPerspective {
    culture: string;
    perspective: string;
    similarities: string[];
    differences: string[];
    interaction_history?: string;
    current_exchange_status: 'active' | 'limited' | 'historical' | 'none';
}
export interface LinguisticAnalysis {
    etymology: EtymologicalAnalysis[];
    semantic_evolution: SemanticEvolution[];
    translation_challenges: TranslationChallenge[];
    conceptual_equivalents: ConceptualEquivalent[];
}
export interface EtymologicalAnalysis {
    term: string;
    language: string;
    root_meaning: string;
    evolution: string;
    cultural_implications: string;
}
export interface SemanticEvolution {
    term: string;
    historical_meaning: string;
    current_meaning: string;
    evolution_driver: string;
    implications: string[];
}
export interface TranslationChallenge {
    source_term: string;
    target_language: string;
    challenge_type: 'no_equivalent' | 'partial_overlap' | 'cultural_specificity' | 'context_dependency';
    proposed_solutions: string[];
    notes: string;
}
export interface ConceptualEquivalent {
    source_concept: string;
    target_concept: string;
    equivalence_level: 'exact' | 'close' | 'partial' | 'loose';
    context_notes: string;
}
export interface SocietalImpact {
    healthcare_impact: string;
    economic_impact: string;
    educational_impact: string;
    policy_implications: string[];
    community_effects: string[];
}
export interface PreservationStatus {
    documentation_level: 'well_documented' | 'partially_documented' | 'poorly_documented' | 'endangered';
    active_practice: 'widespread' | 'limited' | 'declining' | 'extinct';
    transmission_methods: string[];
    preservation_efforts: string[];
    threats: string[];
    conservation_priority: 'urgent' | 'high' | 'moderate' | 'low';
}
export interface EvidenceSupport {
    evidence_quality: EvidenceQuality;
    source_credibility: SourceCredibility;
    consistency_analysis: ConsistencyAnalysis;
    evidence_hierarchy: EvidenceHierarchy[];
    meta_analysis_potential: MetaAnalysisPotential;
}
export interface EvidenceQuality {
    overall_quality: 'high' | 'moderate' | 'low' | 'mixed';
    quality_factors: QualityFactor[];
    bias_assessment: BiasAssessment;
    reliability_score: number;
}
export interface QualityFactor {
    factor: string;
    assessment: 'strong' | 'adequate' | 'weak' | 'inadequate';
    impact_on_conclusion: string;
}
export interface BiasAssessment {
    selection_bias: 'low' | 'moderate' | 'high';
    information_bias: 'low' | 'moderate' | 'high';
    confounding_bias: 'low' | 'moderate' | 'high';
    publication_bias: 'low' | 'moderate' | 'high';
    cultural_bias: 'low' | 'moderate' | 'high';
}
export interface SourceCredibility {
    traditional_sources: SourceCredibilityAssessment;
    modern_sources: SourceCredibilityAssessment;
    cross_validation: CrossValidation;
}
export interface SourceCredibilityAssessment {
    authority_level: 'high' | 'moderate' | 'low';
    historical_accuracy: 'verified' | 'probable' | 'uncertain' | 'disputed';
    peer_recognition: 'widely_accepted' | 'generally_accepted' | 'debated' | 'rejected';
    methodological_rigor: 'excellent' | 'good' | 'adequate' | 'poor';
}
export interface CrossValidation {
    independent_confirmations: number;
    conflicting_sources: number;
    consensus_level: 'strong' | 'moderate' | 'weak' | 'no_consensus';
    validation_methods: string[];
}
export interface ConsistencyAnalysis {
    internal_consistency: 'high' | 'moderate' | 'low';
    cross_source_consistency: 'high' | 'moderate' | 'low';
    temporal_consistency: 'stable' | 'evolving' | 'variable' | 'contradictory';
    geographical_consistency: 'universal' | 'regional' | 'local' | 'inconsistent';
}
export interface EvidenceHierarchy {
    level: number;
    description: string;
    evidence_type: string;
    strength: 'strongest' | 'strong' | 'moderate' | 'weak' | 'weakest';
    availability: 'abundant' | 'adequate' | 'limited' | 'scarce';
    examples: string[];
}
export interface MetaAnalysisPotential {
    feasibility: 'high' | 'moderate' | 'low' | 'not_feasible';
    required_studies: number;
    data_homogeneity: 'high' | 'moderate' | 'low';
    methodological_consistency: 'high' | 'moderate' | 'low';
    potential_benefits: string[];
    limitations: string[];
}
export interface CrossRefRecommendation {
    type: 'research' | 'clinical' | 'regulatory' | 'educational' | 'conservation';
    priority: 'urgent' | 'high' | 'medium' | 'low';
    recommendation: string;
    rationale: string;
    expected_outcomes: string[];
    implementation_steps: string[];
    stakeholders: string[];
    timeline: string;
    resources_needed: string[];
    success_metrics: string[];
}
export interface CrossRefMetadata {
    timestamp: string;
    analysis_version: string;
    methodologies_used: string[];
    data_sources: string[];
    coverage_scope: {
        temporal_range: string;
        geographical_coverage: string[];
        language_coverage: string[];
        cultural_coverage: string[];
    };
    quality_assurance: QualityAssurance;
    limitations: string[];
    confidence_assessment: ConfidenceAssessment;
}
export interface QualityAssurance {
    peer_review_status: 'peer_reviewed' | 'expert_validated' | 'preliminary' | 'draft';
    validation_methods: string[];
    cross_check_results: 'passed' | 'conditional' | 'failed';
    expert_consensus: 'unanimous' | 'majority' | 'divided' | 'no_consensus';
}
export interface ConfidenceAssessment {
    overall_confidence: number;
    confidence_by_category: {
        traditional_knowledge: number;
        modern_science: number;
        cultural_context: number;
        evidence_quality: number;
        cross_validation: number;
    };
    uncertainty_factors: string[];
    confidence_intervals: {
        mapping_accuracy: {
            lower: number;
            upper: number;
        };
        correlation_strength: {
            lower: number;
            upper: number;
        };
    };
}
/**
 * Cross-Reference Agent for mapping traditional knowledge with modern science
 */
export declare class CrossRefAgent extends AgentBase {
    private knowledgeGraph;
    private mappingDatabase;
    private traditionaDatabase;
    private modernDatabase;
    private culturalContextDatabase;
    constructor();
    protected processTask(input: AgentInput): Promise<AgentOutput>;
    private performSemanticMapping;
    private performStructuralMapping;
    private performTherapeuticMapping;
    private performCulturalMapping;
    private buildComprehensiveKnowledgeBridge;
    private performAdvancedCorrelationAnalysis;
    private validateCrossRefInput;
    private identifySourceEntity;
    private performCrossMapping;
    private performCorrelationAnalysis;
    private buildKnowledgeBridge;
    private analyzeCulturalContext;
    private assessEvidenceSupport;
    private generateCrossRefRecommendations;
    private extractSemanticFeatures;
    private findSemanticCandidates;
    private calculateSemanticSimilarity;
    private analyzeCorrelationFactors;
    private calculateMappingConfidence;
    private determineRelationshipType;
    private assessEvidenceStrength;
    private performCrossLinguisticMapping;
    private getMappingMethodologies;
    private getDataSources;
    private getTemporalRange;
    private getGeographicalCoverage;
    private getLanguageCoverage;
    private getCulturalCoverage;
    private getAnalysisLimitations;
    private calculateConfidenceAssessment;
    private getProcessingSteps;
    private performMolecularStructuralMapping;
    private performConceptualStructuralMapping;
    private extractTherapeuticProfile;
    private findTherapeuticMatches;
    private extractCulturalFeatures;
    private findCulturalMatches;
    private synthesizeTraditionalKnowledge;
    private synthesizeModernScience;
    private identifyIntegrationPoints;
    private identifyResearchOpportunities;
    private assessValidationStatus;
    private calculateMultiDimensionalCorrelations;
    private identifySignificantPatterns;
    private identifyDivergencePoints;
    private initializeCrossRefDatabases;
}
