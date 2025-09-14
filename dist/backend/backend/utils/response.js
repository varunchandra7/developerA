"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildApiResponse = buildApiResponse;
function buildApiResponse(options, requestId) {
    return {
        success: !options.error,
        timestamp: new Date().toISOString(),
        requestId,
        ...options
    };
}
