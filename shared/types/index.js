"use strict";
// Core entity types for AyurDiscovery AI platform
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskPriority = exports.TaskStatus = exports.TaskType = exports.AgentStatus = exports.AgentType = exports.VerificationStatus = exports.ReferenceType = exports.ActivityType = exports.TargetType = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["RESEARCHER"] = "researcher";
    UserRole["PRACTITIONER"] = "practitioner";
    UserRole["ADMIN"] = "admin";
    UserRole["GUEST"] = "guest";
})(UserRole || (exports.UserRole = UserRole = {}));
var TargetType;
(function (TargetType) {
    TargetType["PROTEIN"] = "protein";
    TargetType["ENZYME"] = "enzyme";
    TargetType["RECEPTOR"] = "receptor";
    TargetType["ION_CHANNEL"] = "ion_channel";
    TargetType["TRANSPORTER"] = "transporter";
})(TargetType || (exports.TargetType = TargetType = {}));
var ActivityType;
(function (ActivityType) {
    ActivityType["IC50"] = "IC50";
    ActivityType["EC50"] = "EC50";
    ActivityType["KI"] = "Ki";
    ActivityType["KD"] = "Kd";
    ActivityType["BINDING_AFFINITY"] = "binding_affinity";
    ActivityType["INHIBITION"] = "inhibition";
})(ActivityType || (exports.ActivityType = ActivityType = {}));
var ReferenceType;
(function (ReferenceType) {
    ReferenceType["JOURNAL_ARTICLE"] = "journal_article";
    ReferenceType["BOOK"] = "book";
    ReferenceType["BOOK_CHAPTER"] = "book_chapter";
    ReferenceType["THESIS"] = "thesis";
    ReferenceType["CONFERENCE"] = "conference";
    ReferenceType["WEB_RESOURCE"] = "web_resource";
    ReferenceType["TRADITIONAL_TEXT"] = "traditional_text";
})(ReferenceType || (exports.ReferenceType = ReferenceType = {}));
var VerificationStatus;
(function (VerificationStatus) {
    VerificationStatus["VERIFIED"] = "verified";
    VerificationStatus["PENDING"] = "pending";
    VerificationStatus["DISPUTED"] = "disputed";
    VerificationStatus["REJECTED"] = "rejected";
})(VerificationStatus || (exports.VerificationStatus = VerificationStatus = {}));
var AgentType;
(function (AgentType) {
    AgentType["DATA_COLLECTOR"] = "data_collector";
    AgentType["COMPOUND_ANALYZER"] = "compound_analyzer";
    AgentType["TARGET_PREDICTOR"] = "target_predictor";
    AgentType["TOXICITY_ASSESSOR"] = "toxicity_assessor";
    AgentType["DRUG_DESIGNER"] = "drug_designer";
    AgentType["KNOWLEDGE_CURATOR"] = "knowledge_curator";
})(AgentType || (exports.AgentType = AgentType = {}));
var AgentStatus;
(function (AgentStatus) {
    AgentStatus["ACTIVE"] = "active";
    AgentStatus["INACTIVE"] = "inactive";
    AgentStatus["TRAINING"] = "training";
    AgentStatus["ERROR"] = "error";
    AgentStatus["MAINTENANCE"] = "maintenance";
})(AgentStatus || (exports.AgentStatus = AgentStatus = {}));
var TaskType;
(function (TaskType) {
    TaskType["HERB_ANALYSIS"] = "herb_analysis";
    TaskType["COMPOUND_EXTRACTION"] = "compound_extraction";
    TaskType["TARGET_PREDICTION"] = "target_prediction";
    TaskType["TOXICITY_ASSESSMENT"] = "toxicity_assessment";
    TaskType["DRUG_OPTIMIZATION"] = "drug_optimization";
    TaskType["LITERATURE_MINING"] = "literature_mining";
})(TaskType || (exports.TaskType = TaskType = {}));
var TaskStatus;
(function (TaskStatus) {
    TaskStatus["PENDING"] = "pending";
    TaskStatus["IN_PROGRESS"] = "in_progress";
    TaskStatus["COMPLETED"] = "completed";
    TaskStatus["FAILED"] = "failed";
    TaskStatus["CANCELLED"] = "cancelled";
})(TaskStatus || (exports.TaskStatus = TaskStatus = {}));
var TaskPriority;
(function (TaskPriority) {
    TaskPriority["LOW"] = "low";
    TaskPriority["MEDIUM"] = "medium";
    TaskPriority["HIGH"] = "high";
    TaskPriority["URGENT"] = "urgent";
})(TaskPriority || (exports.TaskPriority = TaskPriority = {}));
