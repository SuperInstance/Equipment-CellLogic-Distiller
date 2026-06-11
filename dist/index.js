"use strict";
/**
 * @superinstance/equipment-cell-logic-distiller
 *
 * Equipment that breaks down LLM logic into spreadsheet-visualized cells
 * with tile decomposition.
 *
 * @packageDocumentation
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpreadsheetVisualizer = exports.TileDecomposer = exports.default = exports.CellLogicDistiller = void 0;
exports.createDistiller = createDistiller;
exports.distill = distill;
exports.visualize = visualize;
// Main equipment class
var CellLogicDistiller_js_1 = require("./CellLogicDistiller.js");
Object.defineProperty(exports, "CellLogicDistiller", { enumerable: true, get: function () { return CellLogicDistiller_js_1.CellLogicDistiller; } });
Object.defineProperty(exports, "default", { enumerable: true, get: function () { return __importDefault(CellLogicDistiller_js_1).default; } });
// Core modules
var TileDecomposer_js_1 = require("./TileDecomposer.js");
Object.defineProperty(exports, "TileDecomposer", { enumerable: true, get: function () { return TileDecomposer_js_1.TileDecomposer; } });
var SpreadsheetVisualizer_js_1 = require("./SpreadsheetVisualizer.js");
Object.defineProperty(exports, "SpreadsheetVisualizer", { enumerable: true, get: function () { return SpreadsheetVisualizer_js_1.SpreadsheetVisualizer; } });
/**
 * Quick factory function to create a distiller instance
 */
function createDistiller(options) {
    return new CellLogicDistiller(options);
}
/**
 * Quick distillation function - distill and return result
 */
function distill(prompt, response, options) {
    const distiller = new CellLogicDistiller(options);
    return distiller.distill({ prompt, response });
}
/**
 * Quick visualization function - distill and return spreadsheet
 */
function visualize(prompt, response, options) {
    const distiller = new CellLogicDistiller(options);
    const { spreadsheet } = distiller.distillAndVisualize({ prompt, response });
    return spreadsheet;
}
//# sourceMappingURL=index.js.map