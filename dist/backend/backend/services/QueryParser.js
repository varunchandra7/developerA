"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryParser = void 0;
const logger_1 = __importDefault(require("../utils/logger"));
/**
 * Enhanced Query Parser for intelligent multi-language query processing
 */
class QueryParser {
    languageDetector;
    intentClassifier;
    entityExtractor;
    contextAnalyzer;
    complexityAnalyzer;
    domainClassifier;
    agentRouter;
    queryExpander;
    culturalAnalyzer;
    temporalAnalyzer;
    // Knowledge bases and vocabularies
    ayurvedicVocabulary;
    modernTerminology;
    crossLinguisticMappings;
    culturalContexts;
    domainOntologies;
    constructor() {
        this.languageDetector = new LanguageDetector();
        this.intentClassifier = new IntentClassifier();
        this.entityExtractor = new EntityExtractor();
        this.contextAnalyzer = new ContextAnalyzer();
        this.complexityAnalyzer = new ComplexityAnalyzer();
        this.domainClassifier = new DomainClassifier();
        this.agentRouter = new AgentRouter();
        this.queryExpander = new QueryExpander();
        this.culturalAnalyzer = new CulturalAnalyzer();
        this.temporalAnalyzer = new TemporalAnalyzer();
        this.ayurvedicVocabulary = new Map();
        this.modernTerminology = new Map();
        this.crossLinguisticMappings = new Map();
        this.culturalContexts = new Map();
        this.domainOntologies = new Map();
        this.initializeKnowledgeBases();
    }
    /**
     * Main parsing method - processes query through all analysis stages
     */
    async parseQuery(input) {
        const startTime = Date.now();
        try {
            logger_1.default.info(`Starting query parsing for: "${input.rawQuery}"`);
            // Stage 1: Basic preprocessing and normalization
            const normalizedQuery = await this.preprocessQuery(input.rawQuery);
            // Stage 2: Language detection and analysis
            const language = await this.analyzeLanguage(normalizedQuery, input.userContext);
            // Stage 3: Intent detection and classification
            const intent = await this.detectIntent(normalizedQuery, language, input.userContext, input.sessionContext);
            // Stage 4: Entity extraction and recognition
            const entities = await this.extractEntities(normalizedQuery, language, intent);
            // Stage 5: Complexity analysis
            const complexity = await this.analyzeComplexity(normalizedQuery, entities, intent, input.userContext);
            // Stage 6: Domain classification
            const domain = await this.classifyDomain(normalizedQuery, entities, intent, input.userContext);
            // Stage 7: Contextual modifier extraction
            const contextualModifiers = await this.extractContextualModifiers(normalizedQuery, entities, input.userContext, input.sessionContext);
            // Stage 8: Query expansion
            const queryExpansion = await this.expandQuery(normalizedQuery, entities, domain, language, input.options);
            // Stage 9: Temporal analysis
            const temporalAspects = await this.analyzeTemporalAspects(normalizedQuery, entities);
            // Stage 10: Cultural context analysis
            const culturalContext = await this.analyzeCulturalContext(normalizedQuery, entities, language, input.userContext);
            // Stage 11: Agent routing and execution planning
            const routing = await this.planAgentRouting(intent, entities, complexity, domain, input.options);
            const processingTime = Date.now() - startTime;
            const parsedQuery = {
                originalQuery: input.rawQuery,
                normalizedQuery,
                language,
                intent,
                entities,
                complexity,
                domain,
                routing,
                contextualModifiers,
                queryExpansion,
                temporalAspects,
                culturalContext,
                processingMetadata: {
                    processingTime,
                    confidence: this.calculateOverallConfidence([
                        language.confidence,
                        intent.confidence,
                        domain.confidence,
                        ...entities.map(e => e.confidence)
                    ]),
                    processingSteps: [
                        { step: 'preprocessing', duration: 50, confidence: 0.95 },
                        { step: 'language_detection', duration: 100, confidence: language.confidence },
                        { step: 'intent_classification', duration: 150, confidence: intent.confidence },
                        { step: 'entity_extraction', duration: 200, confidence: this.averageConfidence(entities.map(e => e.confidence)) },
                        { step: 'complexity_analysis', duration: 100, confidence: 0.85 },
                        { step: 'domain_classification', duration: 120, confidence: domain.confidence },
                        { step: 'agent_routing', duration: 80, confidence: 0.90 }
                    ],
                    dataSourcesUsed: [
                        'Ayurvedic vocabulary',
                        'Modern terminology',
                        'Cross-linguistic mappings',
                        'Cultural contexts',
                        'Domain ontologies'
                    ],
                    algorithms: [
                        { algorithm: 'Multi-language NLP', purpose: 'Language detection', confidence: 0.92 },
                        { algorithm: 'Intent classification', purpose: 'Intent detection', confidence: 0.88 },
                        { algorithm: 'NER + Cultural NER', purpose: 'Entity extraction', confidence: 0.85 },
                        { algorithm: 'Complexity scoring', purpose: 'Query complexity', confidence: 0.90 }
                    ],
                    qualityAssessment: {
                        overall_quality: 0.87,
                        completeness: 0.85,
                        accuracy: 0.89,
                        cultural_appropriateness: 0.92,
                        technical_precision: 0.84
                    },
                    limitations: [
                        'Cultural context inference may vary',
                        'Intent classification depends on query specificity',
                        'Entity disambiguation may require user feedback'
                    ],
                    suggestions: [
                        'Consider adding context for ambiguous terms',
                        'Specify cultural or methodological preferences',
                        'Use specific terminology for better precision'
                    ]
                }
            };
            logger_1.default.info(`Query parsing completed in ${processingTime}ms with confidence ${parsedQuery.processingMetadata.confidence}`);
            return parsedQuery;
        }
        catch (error) {
            logger_1.default.error(`Query parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            throw error;
        }
    }
    /**
     * Advanced query preprocessing with multi-language support
     */
    async preprocessQuery(rawQuery) {
        let normalized = rawQuery.trim();
        // Remove excessive whitespace
        normalized = normalized.replace(/\s+/g, ' ');
        // Handle mixed scripts (Devanagari, Telugu, Latin)
        normalized = this.normalizeScripts(normalized);
        // Handle transliteration variants
        normalized = this.handleTransliteration(normalized);
        // Preserve cultural and traditional terms
        normalized = this.preserveCulturalTerms(normalized);
        return normalized;
    }
    /**
     * Multi-language detection with cultural context awareness
     */
    async analyzeLanguage(query, userContext) {
        // Mock implementation with enhanced language detection
        const detectedLanguage = await this.languageDetector.detect(query, userContext);
        return {
            detected: detectedLanguage.primary,
            confidence: detectedLanguage.confidence,
            alternatives: detectedLanguage.alternatives,
            script: detectedLanguage.script,
            dialect: detectedLanguage.dialect,
            formalityLevel: detectedLanguage.formalityLevel
        };
    }
    /**
     * Intent detection with context awareness
     */
    async detectIntent(query, language, userContext, sessionContext) {
        return await this.intentClassifier.classify(query, language, userContext, sessionContext);
    }
    /**
     * Entity extraction with cultural and cross-linguistic support
     */
    async extractEntities(query, language, intent) {
        return await this.entityExtractor.extract(query, language, intent);
    }
    /**
     * Comprehensive complexity analysis
     */
    async analyzeComplexity(query, entities, intent, userContext) {
        return await this.complexityAnalyzer.analyze(query, entities, intent, userContext);
    }
    /**
     * Domain classification with multi-domain support
     */
    async classifyDomain(query, entities, intent, userContext) {
        return await this.domainClassifier.classify(query, entities, intent, userContext);
    }
    /**
     * Contextual modifier extraction
     */
    async extractContextualModifiers(query, entities, userContext, sessionContext) {
        return await this.contextAnalyzer.extractModifiers(query, entities, userContext, sessionContext);
    }
    /**
     * Intelligent query expansion
     */
    async expandQuery(query, entities, domain, language, options) {
        return await this.queryExpander.expand(query, entities, domain, language, options);
    }
    /**
     * Temporal aspect analysis
     */
    async analyzeTemporalAspects(query, entities) {
        return await this.temporalAnalyzer.analyze(query, entities);
    }
    /**
     * Cultural context analysis
     */
    async analyzeCulturalContext(query, entities, language, userContext) {
        return await this.culturalAnalyzer.analyze(query, entities, language, userContext);
    }
    /**
     * Agent routing and execution planning
     */
    async planAgentRouting(intent, entities, complexity, domain, options) {
        return await this.agentRouter.plan(intent, entities, complexity, domain, options);
    }
    // Helper methods for preprocessing
    normalizeScripts(text) {
        // Handle Devanagari normalization
        text = text.normalize('NFD');
        // Handle Telugu script normalization
        text = this.normalizeTeluguScript(text);
        // Handle transliteration consistency
        text = this.normalizeTransliteration(text);
        return text;
    }
    normalizeTeluguScript(text) {
        // Telugu script specific normalizations
        // This would include handling of various Telugu Unicode forms
        return text;
    }
    normalizeTransliteration(text) {
        // Standardize common transliteration variants
        const transliterationMap = new Map([
            ['ashwagandha', 'aswagandha'],
            ['ayurveda', 'āyurveda'],
            // Add more mappings
        ]);
        for (const [variant, standard] of transliterationMap) {
            text = text.replace(new RegExp(variant, 'gi'), standard);
        }
        return text;
    }
    handleTransliteration(text) {
        // Handle common transliteration patterns between scripts
        return text;
    }
    preserveCulturalTerms(text) {
        // Identify and preserve important cultural/traditional terms
        return text;
    }
    // Utility methods
    calculateOverallConfidence(confidences) {
        if (confidences.length === 0)
            return 0;
        return confidences.reduce((sum, conf) => sum + conf, 0) / confidences.length;
    }
    averageConfidence(confidences) {
        if (confidences.length === 0)
            return 0;
        return confidences.reduce((sum, conf) => sum + conf, 0) / confidences.length;
    }
    initializeKnowledgeBases() {
        logger_1.default.info('Initializing query parser knowledge bases...');
        // Initialize Ayurvedic vocabulary
        this.ayurvedicVocabulary.set('haridra', ['turmeric', 'curcuma longa', 'manjal']);
        this.ayurvedicVocabulary.set('ashwagandha', ['withania somnifera', 'winter cherry']);
        // Initialize modern terminology
        this.modernTerminology.set('anti-inflammatory', ['inflammation reducer', 'inflammation inhibitor']);
        // Initialize cross-linguistic mappings
        const englishToSanskrit = new Map([
            ['turmeric', 'haridra'],
            ['ginger', 'ardraka']
        ]);
        this.crossLinguisticMappings.set('en-sa', englishToSanskrit);
        logger_1.default.info('Query parser knowledge bases initialized successfully');
    }
}
exports.QueryParser = QueryParser;
// Component classes for the query parser (mock implementations)
class LanguageDetector {
    async detect(query, userContext) {
        // Mock language detection
        return {
            primary: 'english',
            confidence: 0.92,
            alternatives: [{ language: 'telugu', confidence: 0.15 }],
            script: 'latin',
            dialect: 'indian_english',
            formalityLevel: 'formal'
        };
    }
}
class IntentClassifier {
    async classify(query, language, userContext, sessionContext) {
        // Mock intent classification
        return {
            primary: 'search',
            secondary: ['analysis'],
            confidence: 0.88,
            intentHierarchy: {
                category: 'informational',
                subcategory: 'research',
                specificity: 'focused',
                urgency: 'medium'
            },
            actionType: 'retrieve',
            informationNeed: {
                type: 'factual',
                depth: 'moderate',
                breadth: 'focused',
                timeframe: 'immediate'
            },
            responseExpectation: {
                format: 'structured',
                detail_level: 'detailed',
                evidence_required: true,
                comparative_analysis: false,
                cultural_context_needed: true,
                modern_validation_needed: true
            }
        };
    }
}
class EntityExtractor {
    async extract(query, language, intent) {
        // Mock entity extraction
        return [
            {
                entity: 'curcumin',
                type: 'compound',
                category: 'chemical',
                confidence: 0.95,
                position: { start: 0, end: 8, context: 'curcumin benefits', importance: 'primary' },
                attributes: [
                    { attribute: 'molecular_formula', value: 'C21H20O6', confidence: 1.0, source: 'knowledge_base' }
                ],
                relationships: [
                    { relatedEntity: 'turmeric', relationshipType: 'derived_from', direction: 'backward', strength: 0.9, confidence: 0.95 }
                ],
                culturalContext: {
                    traditionalName: { sanskrit: 'haridra', telugu: 'pasupu' },
                    culturalSignificance: 'Sacred healing spice',
                    sacredContext: true
                },
                disambiguation: {
                    isAmbiguous: false,
                    resolved: true
                }
            }
        ];
    }
}
class ContextAnalyzer {
    async extractModifiers(query, entities, userContext, sessionContext) {
        // Mock contextual modifier extraction
        return [
            {
                type: 'cultural',
                value: 'traditional',
                impact: { affects: ['search_scope'], modification: 'filter', strength: 0.8 },
                confidence: 0.85,
                scope: 'query'
            }
        ];
    }
}
class ComplexityAnalyzer {
    async analyze(query, entities, intent, userContext) {
        // Mock complexity analysis
        return {
            overall: 'moderate',
            dimensions: {
                linguistic: 2,
                conceptual: 3,
                analytical: 2,
                cultural: 3,
                technical: 2,
                interdisciplinary: 3
            },
            processingRequirements: {
                nlpComplexity: 'intermediate',
                knowledgeIntegration: 'cross_domain',
                reasoningLevel: 'analysis',
                computationalIntensity: 'medium'
            },
            estimatedResourceNeeds: {
                estimatedTime: 45,
                agentsRequired: 2,
                databaseQueries: 5,
                computationalLoad: 'medium',
                memoryRequirement: 'moderate'
            }
        };
    }
}
class DomainClassifier {
    async classify(query, entities, intent, userContext) {
        // Mock domain classification
        return {
            primary: 'ayurveda',
            secondary: ['modern_medicine', 'pharmacology'],
            confidence: 0.92,
            domainMix: {
                traditional_percentage: 60,
                modern_percentage: 30,
                cultural_percentage: 40,
                technical_percentage: 20
            },
            specialization: [
                {
                    area: 'rasayana_therapy',
                    confidence: 0.85,
                    requiredExpertise: 'specialized',
                    culturalSpecificity: true
                }
            ],
            crossDomainConnections: [
                {
                    fromDomain: 'ayurveda',
                    toDomain: 'modern_medicine',
                    connectionType: 'validating',
                    strength: 0.7
                }
            ]
        };
    }
}
class AgentRouter {
    async plan(intent, entities, complexity, domain, options) {
        // Mock agent routing
        return {
            recommendedAgents: [
                {
                    agentType: 'literature',
                    priority: 1,
                    suitabilityScore: 0.92,
                    expectedContribution: 'Traditional knowledge search',
                    requiredCapabilities: ['ayurvedic_texts', 'multi_language'],
                    estimatedExecutionTime: 30
                },
                {
                    agentType: 'compound',
                    priority: 2,
                    suitabilityScore: 0.85,
                    expectedContribution: 'Chemical analysis',
                    requiredCapabilities: ['molecular_analysis', 'property_prediction'],
                    estimatedExecutionTime: 45
                }
            ],
            routingStrategy: {
                type: 'sequential',
                coordination: 'coordinated',
                optimization: 'balanced'
            },
            executionPlan: {
                phases: [
                    {
                        phaseId: 'phase_1',
                        name: 'Literature Search',
                        agents: ['literature'],
                        inputs: ['query', 'entities'],
                        outputs: ['literature_results'],
                        estimatedTime: 30,
                        priority: 1
                    },
                    {
                        phaseId: 'phase_2',
                        name: 'Compound Analysis',
                        agents: ['compound'],
                        inputs: ['entities', 'literature_results'],
                        outputs: ['compound_analysis'],
                        estimatedTime: 45,
                        priority: 2
                    }
                ],
                dependencies: [
                    {
                        dependentPhase: 'phase_2',
                        prerequisitePhase: 'phase_1',
                        dependencyType: 'soft',
                        criticalPath: false
                    }
                ],
                criticalPath: ['phase_1'],
                estimatedDuration: 75
            },
            fallbackOptions: [
                {
                    condition: 'literature_agent_unavailable',
                    alternative: 'cross_reference_agent',
                    performance_impact: 'moderate',
                    implementation: 'Use cross-reference for traditional knowledge'
                }
            ]
        };
    }
}
class QueryExpander {
    async expand(query, entities, domain, language, options) {
        // Mock query expansion
        return {
            expandedTerms: [
                {
                    original: 'curcumin',
                    expanded: ['diferuloylmethane', 'turmeric extract', 'haridra'],
                    expansion_type: 'synonym',
                    confidence: 0.9,
                    source: 'cultural_knowledge'
                }
            ],
            synonyms: [
                {
                    core_concept: 'anti-inflammatory',
                    synonyms: ['inflammation reducer', 'anti-swelling'],
                    language: 'english',
                    domain: 'medical',
                    confidence: 0.85
                }
            ],
            relatedConcepts: [
                {
                    concept: 'turmeric',
                    relationship: 'source_plant',
                    strength: 0.95,
                    domain: 'botany',
                    cultural_relevance: 0.9
                }
            ],
            culturalVariants: [
                {
                    original: 'turmeric',
                    variant: 'haridra',
                    culture: 'sanskrit',
                    context: 'traditional_medicine',
                    usage_frequency: 0.8
                }
            ],
            linguisticVariations: [
                {
                    base_form: 'curcumin',
                    variations: ['curcuma', 'curcuminoid'],
                    variation_type: 'morphological',
                    language: 'english'
                }
            ],
            conceptualExtensions: [
                {
                    base_concept: 'anti-inflammatory',
                    extensions: ['pain relief', 'swelling reduction', 'healing promotion'],
                    extension_rationale: 'Related therapeutic effects',
                    semantic_distance: 0.7
                }
            ]
        };
    }
}
class CulturalAnalyzer {
    async analyze(query, entities, language, userContext) {
        // Mock cultural analysis
        return {
            culturalFramework: {
                primary: 'ayurvedic',
                secondary: ['modern_scientific'],
                worldview: 'holistic_medicine',
                epistemology: 'empirical_traditional',
                practiceContext: 'integrative_healthcare'
            },
            traditionalPerspective: {
                traditionName: 'ayurveda',
                coreValues: ['holism', 'natural_healing', 'prevention'],
                methodologyAlignment: 'traditional_texts',
                authoritySource: ['classical_texts', 'lineage_knowledge'],
                practiceIntegration: true
            },
            modernIntegration: {
                integrationLevel: 'complementary',
                validationApproach: 'scientific_validation',
                evidenceStandards: ['clinical_trials', 'molecular_studies'],
                reconciliationStrategy: 'bridge_building'
            },
            culturalSensitivity: {
                sensitivityLevel: 'high',
                sensitiveConcepts: ['sacred_plants', 'spiritual_practices'],
                appropriateTerminology: ['traditional_medicine', 'cultural_heritage'],
                respectfulFraming: ['acknowledge_tradition', 'respect_indigenous_knowledge']
            },
            crossCulturalConsiderations: [
                {
                    aspect: 'terminology',
                    considerations: ['Use culturally appropriate terms', 'Acknowledge traditional origins'],
                    recommendations: ['Include traditional names', 'Provide cultural context'],
                    potential_conflicts: ['Appropriation concerns', 'Oversimplification']
                }
            ]
        };
    }
}
class TemporalAnalyzer {
    async analyze(query, entities) {
        // Mock temporal analysis
        return {
            hasTemporalReference: false,
            temporalEntities: [],
            historicalContext: {
                temporalSignificance: 'timeless'
            },
            temporalScope: {
                scope: 'era'
            },
            timeRelevance: {
                contemporary: 0.8,
                historical: 0.6,
                ancient: 0.9,
                timeless: 0.95
            }
        };
    }
}
