export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    affiliations: string[];
    specializations: string[];
    createdAt: Date;
    updatedAt: Date;
}
export declare enum UserRole {
    RESEARCHER = "researcher",
    PRACTITIONER = "practitioner",
    ADMIN = "admin",
    GUEST = "guest"
}
export interface AyurvedicHerb {
    id: string;
    name: {
        sanskrit: string;
        english: string;
        telugu: string;
        botanical: string;
    };
    description: string;
    properties: {
        rasa: string[];
        virya: string;
        vipaka: string;
        guna: string[];
        dosha: string[];
    };
    therapeuticUses: string[];
    contraindications: string[];
    compounds: ChemicalCompound[];
    references: Reference[];
    verificationStatus: VerificationStatus;
    createdAt: Date;
    updatedAt: Date;
}
export interface ChemicalCompound {
    id: string;
    name: string;
    molecularFormula: string;
    smiles: string;
    inchi: string;
    molecularWeight: number;
    structure: string;
    bioactivity: BioactivityData;
    drugLikeness: DrugLikenessScore;
    sources: string[];
}
export interface BioactivityData {
    targets: Target[];
    activities: Activity[];
    toxicity: ToxicityProfile;
    pharmacokinetics: PharmacokineticData;
}
export interface Target {
    id: string;
    name: string;
    type: TargetType;
    organism: string;
    pathway: string[];
    description: string;
}
export declare enum TargetType {
    PROTEIN = "protein",
    ENZYME = "enzyme",
    RECEPTOR = "receptor",
    ION_CHANNEL = "ion_channel",
    TRANSPORTER = "transporter"
}
export interface Activity {
    targetId: string;
    activityType: ActivityType;
    value: number;
    unit: string;
    assayType: string;
    confidence: number;
    source: string;
}
export declare enum ActivityType {
    IC50 = "IC50",
    EC50 = "EC50",
    KI = "Ki",
    KD = "Kd",
    BINDING_AFFINITY = "binding_affinity",
    INHIBITION = "inhibition"
}
export interface ToxicityProfile {
    ld50: number;
    cytotoxicity: number;
    hepatotoxicity: number;
    cardiotoxicity: number;
    mutagenicity: boolean;
    carcinogenicity: boolean;
    teratogenicity: boolean;
}
export interface PharmacokineticData {
    absorption: number;
    distribution: number;
    metabolism: number;
    excretion: number;
    bioavailability: number;
    halfLife: number;
    clearance: number;
}
export interface DrugLikenessScore {
    lipinski: boolean;
    veber: boolean;
    egan: boolean;
    muegge: boolean;
    qed: number;
    sa: number;
    np: number;
}
export interface Reference {
    id: string;
    type: ReferenceType;
    title: string;
    authors: string[];
    journal?: string;
    year: number;
    doi?: string;
    pmid?: string;
    url?: string;
    pages?: string;
    volume?: string;
    issue?: string;
}
export declare enum ReferenceType {
    JOURNAL_ARTICLE = "journal_article",
    BOOK = "book",
    BOOK_CHAPTER = "book_chapter",
    THESIS = "thesis",
    CONFERENCE = "conference",
    WEB_RESOURCE = "web_resource",
    TRADITIONAL_TEXT = "traditional_text"
}
export declare enum VerificationStatus {
    VERIFIED = "verified",
    PENDING = "pending",
    DISPUTED = "disputed",
    REJECTED = "rejected"
}
export interface Agent {
    id: string;
    name: string;
    type: AgentType;
    description: string;
    capabilities: string[];
    status: AgentStatus;
    configuration: Record<string, unknown>;
    metrics: AgentMetrics;
    createdAt: Date;
    updatedAt: Date;
}
export declare enum AgentType {
    DATA_COLLECTOR = "data_collector",
    COMPOUND_ANALYZER = "compound_analyzer",
    TARGET_PREDICTOR = "target_predictor",
    TOXICITY_ASSESSOR = "toxicity_assessor",
    DRUG_DESIGNER = "drug_designer",
    KNOWLEDGE_CURATOR = "knowledge_curator"
}
export declare enum AgentStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    TRAINING = "training",
    ERROR = "error",
    MAINTENANCE = "maintenance"
}
export interface AgentMetrics {
    totalTasks: number;
    successfulTasks: number;
    failedTasks: number;
    averageExecutionTime: number;
    accuracy: number;
    lastExecuted: Date;
}
export interface Task {
    id: string;
    type: TaskType;
    agentId: string;
    input: Record<string, unknown>;
    output?: Record<string, unknown>;
    status: TaskStatus;
    priority: TaskPriority;
    progress: number;
    estimatedCompletionTime?: Date;
    startedAt?: Date;
    completedAt?: Date;
    error?: string;
    metadata: Record<string, unknown>;
}
export declare enum TaskType {
    HERB_ANALYSIS = "herb_analysis",
    COMPOUND_EXTRACTION = "compound_extraction",
    TARGET_PREDICTION = "target_prediction",
    TOXICITY_ASSESSMENT = "toxicity_assessment",
    DRUG_OPTIMIZATION = "drug_optimization",
    LITERATURE_MINING = "literature_mining"
}
export declare enum TaskStatus {
    PENDING = "pending",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    FAILED = "failed",
    CANCELLED = "cancelled"
}
export declare enum TaskPriority {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    URGENT = "urgent"
}
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
    timestamp: Date;
    requestId: string;
}
export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}
export interface SearchQuery {
    query: string;
    filters: Record<string, unknown>;
    sort: {
        field: string;
        order: 'asc' | 'desc';
    };
    pagination: {
        page: number;
        limit: number;
    };
}
