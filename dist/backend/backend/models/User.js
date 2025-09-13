"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const types_1 = require("@shared/types");
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
    },
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 100,
    },
    role: {
        type: String,
        enum: Object.values(types_1.UserRole),
        default: types_1.UserRole.GUEST,
        required: true,
    },
    affiliations: [{
            type: String,
            trim: true,
        }],
    specializations: [{
            type: String,
            trim: true,
        }],
}, {
    timestamps: true,
    toJSON: {
        transform: function (doc, ret) {
            ret['id'] = ret['_id'];
            delete ret['_id'];
            delete ret['__v'];
            return ret;
        }
    }
});
// Indexes for performance
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1 });
userSchema.index({ affiliations: 1 });
userSchema.index({ specializations: 1 });
exports.UserModel = (0, mongoose_1.model)('User', userSchema);
