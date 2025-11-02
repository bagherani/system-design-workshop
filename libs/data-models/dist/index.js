"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = void 0;
const tslib_1 = require("tslib");
// Export all generated types and client functions
tslib_1.__exportStar(require("./types"), exports);
// Re-export the API client function
var sdk_gen_1 = require("./types/sdk.gen");
Object.defineProperty(exports, "getUsers", { enumerable: true, get: function () { return sdk_gen_1.getUsers; } });
