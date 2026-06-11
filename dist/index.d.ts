/**
 * @superinstance/equipment-cell-logic-distiller
 *
 * Equipment that breaks down LLM logic into spreadsheet-visualized cells
 * with tile decomposition.
 *
 * @packageDocumentation
 */
export { CellLogicDistiller, default as default } from './CellLogicDistiller.js';
export { TileDecomposer } from './TileDecomposer.js';
export { SpreadsheetVisualizer } from './SpreadsheetVisualizer.js';
export type { LogicTile, DataOrigin, DecisionLogic, TransformationInfo, NamedInterface, LogicCondition, LogicOperator, SpreadsheetCell, SpreadsheetCellType, CellFormatting, LogicSpreadsheet, SpreadsheetMetadata, DecompositionResult, DecompositionStatistics, DistillationInput, DistillationOptions, ReverseEngineerResult, LogicTileAdapter, InterfaceParameter, } from './types.js';
/**
 * Quick factory function to create a distiller instance
 */
export declare function createDistiller(options?: import('./types.js').DistillationOptions): CellLogicDistiller;
/**
 * Quick distillation function - distill and return result
 */
export declare function distill(prompt: string, response: string, options?: import('./types.js').DistillationOptions): import('./types.js').DecompositionResult;
/**
 * Quick visualization function - distill and return spreadsheet
 */
export declare function visualize(prompt: string, response: string, options?: import('./types.js').DistillationOptions): import('./types.js').LogicSpreadsheet;
//# sourceMappingURL=index.d.ts.map