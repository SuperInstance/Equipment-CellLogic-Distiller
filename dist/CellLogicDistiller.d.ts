/**
 * CellLogicDistiller - Main Equipment Class
 *
 * Equipment that breaks down LLM logic into spreadsheet-visualized cells
 * with tile decomposition. Implements the Equipment interface for integration
 * with the SuperInstance ecosystem.
 */
import type { Equipment, EquipmentSlot, OriginCore, Tile, CostMetrics, BenefitMetrics, TriggerThresholds, EquipmentDescription } from 'superinstance-starter-agent';
import type { LogicTile, DecompositionResult, DistillationInput, DistillationOptions, ReverseEngineerResult, LogicSpreadsheet } from './types';
/**
 * CellLogicDistiller Equipment
 *
 * This equipment takes LLM prompts/responses and breaks them into named tiles,
 * outputs spreadsheet-compatible cell structures, generates NLP descriptions,
 * and can reverse-engineer cells to explain logic.
 */
export declare class CellLogicDistiller implements Equipment {
    readonly name = "CellLogicDistiller";
    readonly slot: EquipmentSlot;
    readonly version = "1.0.0";
    readonly description = "Breaks down LLM logic into spreadsheet-visualized cells with tile decomposition";
    readonly cost: CostMetrics;
    readonly benefit: BenefitMetrics;
    readonly triggerThresholds: TriggerThresholds;
    private decomposer;
    private visualizer;
    private lastResult;
    private tileCache;
    constructor(options?: DistillationOptions);
    /**
     * Equip the agent with this equipment
     */
    equip(_agent: OriginCore): Promise<void>;
    /**
     * Unequip the agent from this equipment
     */
    unequip(_agent: OriginCore): Promise<void>;
    /**
     * Get equipment description
     */
    describe(): EquipmentDescription;
    /**
     * Convert this equipment to a Tile
     */
    asTile(): Tile;
    /**
     * Distill LLM logic into tiles and spreadsheet
     */
    distill(input: DistillationInput): DecompositionResult;
    /**
     * Create a full spreadsheet visualization
     */
    visualize(tiles: LogicTile[], sourcePrompt?: string, sourceResponse?: string): LogicSpreadsheet;
    /**
     * Distill and visualize in one step
     */
    distillAndVisualize(input: DistillationInput): {
        result: DecompositionResult;
        spreadsheet: LogicSpreadsheet;
    };
    /**
     * Reverse-engineer a tile by ID
     */
    reverseEngineerTile(tileId: string): string | null;
    /**
     * Reverse-engineer a cell by ID
     */
    reverseEngineerCell(cellId: string): ReverseEngineerResult | null;
    /**
     * Explain what a specific logic does
     */
    explainLogic(tileId: string): string;
    /**
     * Export spreadsheet to CSV
     */
    exportToCSV(spreadsheet: LogicSpreadsheet): string;
    /**
     * Export spreadsheet to JSON
     */
    exportToJSON(spreadsheet: LogicSpreadsheet): string;
    /**
     * Export spreadsheet to HTML
     */
    exportToHTML(spreadsheet: LogicSpreadsheet): string;
    /**
     * Generate a summary report
     */
    generateSummary(tiles: LogicTile[]): string;
    /**
     * Get cached tile by ID
     */
    getTile(tileId: string): LogicTile | undefined;
    /**
     * Get all cached tiles
     */
    getAllTiles(): LogicTile[];
    /**
     * Get the last distillation result
     */
    getLastResult(): DecompositionResult | null;
    /**
     * Clear the tile cache
     */
    clearCache(): void;
    /**
     * Get statistics about cached tiles
     */
    getStatistics(): {
        tileCount: number;
        averageConfidence: number;
        typeDistribution: Record<string, number>;
    };
}
export default CellLogicDistiller;
//# sourceMappingURL=CellLogicDistiller.d.ts.map