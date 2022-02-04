"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Release = exports.ReleaseSchema = exports.Description = void 0;
const database_1 = require("../../database");
const _Util_1 = require("../_Util");
const index_json_1 = __importDefault(require("../../../../data/entities/common/Release/index.json"));
Object.defineProperty(exports, "Description", { enumerable: true, get: function () { return index_json_1.default; } });
require("../User");
exports.ReleaseSchema = (0, _Util_1.descriptionToSchema)(index_json_1.default, database_1.options);
exports.ReleaseSchema.plugin(require('mongoose-autopopulate'));
exports.Release = (0, database_1.model)('Release', exports.ReleaseSchema);
//# sourceMappingURL=index.js.map