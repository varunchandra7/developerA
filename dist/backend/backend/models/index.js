"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Literature = exports.Compound = exports.UserModel = exports.HerbModel = exports.AgentModel = void 0;
var Agent_1 = require("./Agent");
Object.defineProperty(exports, "AgentModel", { enumerable: true, get: function () { return Agent_1.AgentModel; } });
var Herb_1 = require("./Herb");
Object.defineProperty(exports, "HerbModel", { enumerable: true, get: function () { return Herb_1.HerbModel; } });
var User_1 = require("./User");
Object.defineProperty(exports, "UserModel", { enumerable: true, get: function () { return User_1.UserModel; } });
var Compound_1 = require("./Compound");
Object.defineProperty(exports, "Compound", { enumerable: true, get: function () { return __importDefault(Compound_1).default; } });
var Literature_1 = require("./Literature");
Object.defineProperty(exports, "Literature", { enumerable: true, get: function () { return __importDefault(Literature_1).default; } });
