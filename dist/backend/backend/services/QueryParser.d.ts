export interface QueryParserInput {
    rawQuery: string;
    userContext?: UserContext;
    sessionContext?: SessionContext;
    options?: QueryParsingOptions;
}
export interface QueryParsingOptions {
    enableMultiLanguage?: boolean;
    enableContextAwareness?: boolean;
    enableIntentDetection?: boolean;
    enableEntityExtraction?: boolean;
    enableQueryExpansion?: boolean;
    maxComplexity?: number;
    timeoutMs?: number;
    cacheResults?: boolean;
    preferredAgents?: string[];
    domainFilter?: ('ayurvedic' | 'modern' | 'mixed')[];
}
export interface UserContext {
    userId?: string;
    userRole: 'researcher' | 'practitioner' | 'student' | 'general';
    expertise: 'beginner' | 'intermediate' | 'expert';
    languagePreference: string[];
    culturalBackground?: string;
    researchFocus?: string[];
    previousQueries?: PreviousQuery[];
    preferences: UserPreferences;
}
export interface SessionContext {
    sessionId: string;
    conversationHistory: ConversationTurn[];
    currentTopic?: string;
    contextStack: ContextFrame[];
    temporalContext: TemporalContext;
    analyticsData: SessionAnalytics;
}
export interface PreviousQuery {
    query: string;
    timestamp: string;
    resultQuality: number;
    selectedResults: string[];
    feedback?: QueryFeedback;
}
export interface UserPreferences {
    outputFormat: 'detailed' | 'summary' | 'technical' | 'layman';
    evidenceLevel: 'all' | 'high_quality' | 'peer_reviewed' | 'traditional_only';
    includeCulturalContext: boolean;
    includeModernResearch: boolean;
    includeTraditionalKnowledge: boolean;
    visualizationPreferences: string[];
}
export interface ConversationTurn {
    turnId: string;
    userInput: string;
    systemResponse: string;
    agentsInvolved: string[];
    entities: ExtractedEntity[];
    intent: string;
    timestamp: string;
    satisfaction?: number;
}
export interface ContextFrame {
    frameId: string;
    domain: string;
    entities: ExtractedEntity[];
    relationships: EntityRelationship[];
    scope: 'local' | 'session' | 'global';
    confidence: number;
    timestamp: string;
}
export interface TemporalContext {
    currentTime: string;
    timezone: string;
    seasonalContext?: string;
    historicalRelevance?: string;
    temporalReferences: TemporalReference[];
}
export interface SessionAnalytics {
    queryComplexityTrend: number[];
    domainFocusDistribution: Record<string, number>;
    agentUsagePattern: Record<string, number>;
    userEngagementMetrics: EngagementMetrics;
}
export interface TemporalReference {
    type: 'absolute' | 'relative' | 'period';
    value: string;
    normalized: string;
    confidence: number;
}
export interface EngagementMetrics {
    sessionDuration: number;
    queriesPerSession: number;
    averageQueryComplexity: number;
    resultClickThrough: number;
    refinementRate: number;
}
export interface QueryFeedback {
    relevance: number;
    completeness: number;
    accuracy: number;
    culturalSensitivity: number;
    comments?: string;
}
export interface ParsedQuery {
    originalQuery: string;
    normalizedQuery: string;
    language: Language;
    intent: QueryIntent;
    entities: ExtractedEntity[];
    complexity: QueryComplexity;
    domain: Domain;
    routing: AgentRouting;
    contextualModifiers: ContextualModifier[];
    queryExpansion: QueryExpansion;
    temporalAspects: TemporalAspects;
    culturalContext: CulturalQueryContext;
    processingMetadata: QueryProcessingMetadata;
}
export interface Language {
    detected: string;
    confidence: number;
    alternatives?: LanguageAlternative[];
    script?: string;
    dialect?: string;
    formalityLevel?: 'formal' | 'informal' | 'technical' | 'colloquial';
}
export interface LanguageAlternative {
    language: string;
    confidence: number;
    evidence: string[];
}
export interface QueryIntent {
    primary: IntentType;
    secondary?: IntentType[];
    confidence: number;
    intentHierarchy: IntentHierarchy;
    actionType: ActionType;
    informationNeed: InformationNeed;
    responseExpectation: ResponseExpectation;
}
export type IntentType = 'search' | 'analysis' | 'comparison' | 'recommendation' | 'validation' | 'discovery' | 'synthesis' | 'translation' | 'explanation' | 'prediction' | 'classification' | 'relationship_mapping' | 'contradiction_resolution' | 'hypothesis_testing' | 'literature_review' | 'cross_validation';
export interface IntentHierarchy {
    category: 'informational' | 'analytical' | 'transactional' | 'navigational';
    subcategory: string;
    specificity: 'broad' | 'focused' | 'precise';
    urgency: 'low' | 'medium' | 'high';
}
export type ActionType = 'retrieve' | 'analyze' | 'synthesize' | 'compare' | 'evaluate' | 'predict' | 'classify' | 'map' | 'validate' | 'recommend';
export interface InformationNeed {
    type: 'factual' | 'procedural' | 'conceptual' | 'strategic' | 'evaluative';
    depth: 'surface' | 'moderate' | 'deep' | 'comprehensive';
    breadth: 'narrow' | 'focused' | 'broad' | 'extensive';
    timeframe: 'immediate' | 'short_term' | 'long_term' | 'historical';
}
export interface ResponseExpectation {
    format: 'text' | 'structured' | 'visual' | 'interactive' | 'mixed';
    detail_level: 'summary' | 'detailed' | 'exhaustive';
    evidence_required: boolean;
    comparative_analysis: boolean;
    cultural_context_needed: boolean;
    modern_validation_needed: boolean;
}
export interface ExtractedEntity {
    entity: string;
    type: EntityType;
    category: EntityCategory;
    confidence: number;
    position: EntityPosition;
    attributes: EntityAttribute[];
    relationships: EntityRelationship[];
    culturalContext?: EntityCulturalContext;
    disambiguation: EntityDisambiguation;
}
export type EntityType = 'compound' | 'herb' | 'disease' | 'symptom' | 'treatment' | 'practice' | 'concept' | 'person' | 'place' | 'time' | 'text' | 'measurement' | 'dosage' | 'preparation' | 'mechanism' | 'pathway' | 'target';
export type EntityCategory = 'biological' | 'chemical' | 'medical' | 'cultural' | 'temporal' | 'geographical' | 'textual' | 'numerical' | 'methodological';
export interface EntityPosition {
    start: number;
    end: number;
    context: string;
    importance: 'primary' | 'secondary' | 'supportive';
}
export interface EntityAttribute {
    attribute: string;
    value: string | number | boolean;
    confidence: number;
    source: 'extraction' | 'knowledge_base' | 'inference';
}
export interface EntityRelationship {
    relatedEntity: string;
    relationshipType: string;
    direction: 'forward' | 'backward' | 'bidirectional';
    strength: number;
    confidence: number;
}
export interface EntityCulturalContext {
    traditionalName?: Record<string, string>;
    culturalSignificance?: string;
    regionalVariation?: string[];
    sacredContext?: boolean;
}
export interface EntityDisambiguation {
    isAmbiguous: boolean;
    alternatives?: EntityAlternative[];
    disambiguationContext?: string;
    resolved: boolean;
}
export interface EntityAlternative {
    entity: string;
    type: EntityType;
    confidence: number;
    context: string;
}
export interface QueryComplexity {
    overall: ComplexityLevel;
    dimensions: ComplexityDimensions;
    processingRequirements: ProcessingRequirements;
    estimatedResourceNeeds: ResourceEstimate;
}
export type ComplexityLevel = 'simple' | 'moderate' | 'complex' | 'advanced' | 'expert';
export interface ComplexityDimensions {
    linguistic: number;
    conceptual: number;
    analytical: number;
    cultural: number;
    technical: number;
    interdisciplinary: number;
}
export interface ProcessingRequirements {
    nlpComplexity: 'basic' | 'intermediate' | 'advanced';
    knowledgeIntegration: 'single_domain' | 'cross_domain' | 'multi_domain';
    reasoningLevel: 'retrieval' | 'analysis' | 'synthesis' | 'evaluation';
    computationalIntensity: 'low' | 'medium' | 'high' | 'intensive';
}
export interface ResourceEstimate {
    estimatedTime: number;
    agentsRequired: number;
    databaseQueries: number;
    computationalLoad: 'low' | 'medium' | 'high';
    memoryRequirement: 'minimal' | 'moderate' | 'substantial';
}
export interface Domain {
    primary: DomainType;
    secondary?: DomainType[];
    confidence: number;
    domainMix: DomainMix;
    specialization: Specialization[];
    crossDomainConnections: CrossDomainConnection[];
}
export type DomainType = 'ayurveda' | 'modern_medicine' | 'pharmacology' | 'chemistry' | 'biology' | 'anthropology' | 'linguistics' | 'history' | 'philosophy' | 'literature' | 'nutrition' | 'botany' | 'toxicology' | 'therapeutics' | 'diagnostics';
export interface DomainMix {
    traditional_percentage: number;
    modern_percentage: number;
    cultural_percentage: number;
    technical_percentage: number;
}
export interface Specialization {
    area: string;
    confidence: number;
    requiredExpertise: 'general' | 'specialized' | 'expert';
    culturalSpecificity: boolean;
}
export interface CrossDomainConnection {
    fromDomain: DomainType;
    toDomain: DomainType;
    connectionType: 'complementary' | 'validating' | 'contrasting' | 'integrative';
    strength: number;
}
export interface AgentRouting {
    recommendedAgents: AgentRecommendation[];
    routingStrategy: RoutingStrategy;
    executionPlan: ExecutionPlan;
    fallbackOptions: FallbackOption[];
}
export interface AgentRecommendation {
    agentType: string;
    priority: number;
    suitabilityScore: number;
    expectedContribution: string;
    requiredCapabilities: string[];
    estimatedExecutionTime: number;
}
export interface RoutingStrategy {
    type: 'sequential' | 'parallel' | 'hierarchical' | 'adaptive';
    coordination: 'independent' | 'coordinated' | 'collaborative';
    optimization: 'speed' | 'accuracy' | 'comprehensiveness' | 'balanced';
}
export interface ExecutionPlan {
    phases: ExecutionPhase[];
    dependencies: PhaseDependency[];
    criticalPath: string[];
    estimatedDuration: number;
}
export interface ExecutionPhase {
    phaseId: string;
    name: string;
    agents: string[];
    inputs: string[];
    outputs: string[];
    estimatedTime: number;
    priority: number;
}
export interface PhaseDependency {
    dependentPhase: string;
    prerequisitePhase: string;
    dependencyType: 'hard' | 'soft' | 'optimization';
    criticalPath: boolean;
}
export interface FallbackOption {
    condition: string;
    alternative: string;
    performance_impact: 'minimal' | 'moderate' | 'significant';
    implementation: string;
}
export interface ContextualModifier {
    type: ModifierType;
    value: string;
    impact: ModifierImpact;
    confidence: number;
    scope: 'local' | 'query' | 'session';
}
export type ModifierType = 'temporal' | 'geographical' | 'cultural' | 'methodological' | 'comparative' | 'qualitative' | 'quantitative' | 'conditional';
export interface ModifierImpact {
    affects: string[];
    modification: 'filter' | 'emphasis' | 'context' | 'constraint';
    strength: number;
}
export interface QueryExpansion {
    expandedTerms: ExpandedTerm[];
    synonyms: SynonymGroup[];
    relatedConcepts: RelatedConcept[];
    culturalVariants: CulturalVariant[];
    linguisticVariations: LinguisticVariation[];
    conceptualExtensions: ConceptualExtension[];
}
export interface ExpandedTerm {
    original: string;
    expanded: string[];
    expansion_type: 'synonym' | 'hypernym' | 'hyponym' | 'related' | 'cultural';
    confidence: number;
    source: 'thesaurus' | 'ontology' | 'corpus' | 'cultural_knowledge';
}
export interface SynonymGroup {
    core_concept: string;
    synonyms: string[];
    language: string;
    domain: string;
    confidence: number;
}
export interface RelatedConcept {
    concept: string;
    relationship: string;
    strength: number;
    domain: string;
    cultural_relevance: number;
}
export interface CulturalVariant {
    original: string;
    variant: string;
    culture: string;
    context: string;
    usage_frequency: number;
}
export interface LinguisticVariation {
    base_form: string;
    variations: string[];
    variation_type: 'morphological' | 'phonetic' | 'semantic' | 'dialectal';
    language: string;
}
export interface ConceptualExtension {
    base_concept: string;
    extensions: string[];
    extension_rationale: string;
    semantic_distance: number;
}
export interface TemporalAspects {
    hasTemporalReference: boolean;
    temporalEntities: TemporalEntity[];
    historicalContext: HistoricalContext;
    temporalScope: TemporalScope;
    timeRelevance: TimeRelevance;
}
export interface TemporalEntity {
    expression: string;
    normalized: string;
    type: 'absolute' | 'relative' | 'duration' | 'frequency';
    confidence: number;
    granularity: 'year' | 'month' | 'day' | 'hour' | 'era' | 'period';
}
export interface HistoricalContext {
    historicalPeriod?: string;
    culturalEra?: string;
    relevantEvents?: string[];
    temporalSignificance: 'contemporary' | 'historical' | 'ancient' | 'timeless';
}
export interface TemporalScope {
    scope: 'point' | 'duration' | 'recurring' | 'era';
    start?: string;
    end?: string;
    recurrence?: string;
}
export interface TimeRelevance {
    contemporary: number;
    historical: number;
    ancient: number;
    timeless: number;
}
export interface CulturalQueryContext {
    culturalFramework: CulturalFramework;
    traditionalPerspective: TraditionalPerspective;
    modernIntegration: ModernIntegration;
    culturalSensitivity: CulturalSensitivity;
    crossCulturalConsiderations: CrossCulturalConsideration[];
}
export interface CulturalFramework {
    primary: string;
    secondary?: string[];
    worldview: string;
    epistemology: string;
    practiceContext: string;
}
export interface TraditionalPerspective {
    traditionName: string;
    coreValues: string[];
    methodologyAlignment: string;
    authoritySource: string[];
    practiceIntegration: boolean;
}
export interface ModernIntegration {
    integrationLevel: 'isolated' | 'complementary' | 'integrated' | 'synthesized';
    validationApproach: string;
    evidenceStandards: string[];
    reconciliationStrategy: string;
}
export interface CulturalSensitivity {
    sensitivityLevel: 'high' | 'medium' | 'low';
    sensitiveConcepts: string[];
    appropriateTerminology: string[];
    respectfulFraming: string[];
}
export interface CrossCulturalConsideration {
    aspect: string;
    considerations: string[];
    recommendations: string[];
    potential_conflicts: string[];
}
export interface QueryProcessingMetadata {
    processingTime: number;
    confidence: number;
    processingSteps: ProcessingStep[];
    dataSourcesUsed: string[];
    algorithms: AlgorithmUsage[];
    qualityAssessment: QualityAssessment;
    limitations: string[];
    suggestions: string[];
}
export interface ProcessingStep {
    step: string;
    duration: number;
    confidence: number;
    notes?: string;
}
export interface AlgorithmUsage {
    algorithm: string;
    purpose: string;
    confidence: number;
    parameters?: Record<string, any>;
}
export interface QualityAssessment {
    overall_quality: number;
    completeness: number;
    accuracy: number;
    cultural_appropriateness: number;
    technical_precision: number;
}
/**
 * Enhanced Query Parser for intelligent multi-language query processing
 */
export declare class QueryParser {
    private languageDetector;
    private intentClassifier;
    private entityExtractor;
    private contextAnalyzer;
    private complexityAnalyzer;
    private domainClassifier;
    private agentRouter;
    private queryExpander;
    private culturalAnalyzer;
    private temporalAnalyzer;
    private ayurvedicVocabulary;
    private modernTerminology;
    private crossLinguisticMappings;
    private culturalContexts;
    private domainOntologies;
    constructor();
    /**
     * Main parsing method - processes query through all analysis stages
     */
    parseQuery(input: QueryParserInput): Promise<ParsedQuery>;
    /**
     * Advanced query preprocessing with multi-language support
     */
    private preprocessQuery;
    /**
     * Multi-language detection with cultural context awareness
     */
    private analyzeLanguage;
    /**
     * Intent detection with context awareness
     */
    private detectIntent;
    /**
     * Entity extraction with cultural and cross-linguistic support
     */
    private extractEntities;
    /**
     * Comprehensive complexity analysis
     */
    private analyzeComplexity;
    /**
     * Domain classification with multi-domain support
     */
    private classifyDomain;
    /**
     * Contextual modifier extraction
     */
    private extractContextualModifiers;
    /**
     * Intelligent query expansion
     */
    private expandQuery;
    /**
     * Temporal aspect analysis
     */
    private analyzeTemporalAspects;
    /**
     * Cultural context analysis
     */
    private analyzeCulturalContext;
    /**
     * Agent routing and execution planning
     */
    private planAgentRouting;
    private normalizeScripts;
    private normalizeTeluguScript;
    private normalizeTransliteration;
    private handleTransliteration;
    private preserveCulturalTerms;
    private calculateOverallConfidence;
    private averageConfidence;
    private initializeKnowledgeBases;
}
