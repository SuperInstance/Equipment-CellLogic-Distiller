/**
 * TileDecomposer - Decomposes LLM logic into named tiles
 *
 * This module analyzes LLM prompts and responses, extracting logical components
 * and breaking them down into discrete, named tiles with full metadata.
 */
import type { LogicTile, DecompositionResult, DistillationInput, DistillationOptions } from './types';
/**
 * TileDecomposer class
 * Extracts and decomposes logic from LLM inputs into structured tiles
 */
export declare class TileDecomposer {
    private readonly minConfidence;
    private readonly maxTiles;
    private readonly generateFormalRules;
    private readonly tileCounter;
    private readonly logicPatterns;
    constructor(options?: DistillationOptions);
    /**
     * Decompose LLM input into logic tiles
     */
    decompose(input: DistillationInput): DecompositionResult;
    /**
     * Extract tiles from text
     */
    private extractTiles;
    /**
     * Extract additional logical patterns
     */
    private extractAdditionalLogic;
    /**
     * Create a logic tile from extracted data
     */
    private createTile;
    /**
     * Parse conditions from a text segment
     */
    private parseConditions;
    /**
     * Normalize operator string
     */
    private normalizeOperator;
    /**
     * Generate a name for a tile
     */
    private generateTileName;
    /**
     * Sanitize name for use in identifiers
     */
    private sanitizeName;
    /**
     * Determine origin type for a segment
     */
    private determineOriginType;
    /**
     * Infer transformation from segment and logic
     */
    private inferTransformation;
    /**
     * Create a named interface for a tile
     */
    private createNamedInterface;
    /**
     * Resolve dependencies between tiles
     */
    private resolveDependencies;
    /**
     * Generate NLP description for a tile
     */
    private generateNlpDescription;
    /**
     * Create a basic spreadsheet structure from tiles
     */
    private createSpreadsheetStructure;
    /**
     * Calculate decomposition statistics
     */
    private calculateStatistics;
    /**
     * Reverse-engineer a tile to explain its logic
     */
    reverseEngineer(tile: LogicTile): string;
}
export default TileDecomposer;
//# sourceMappingURL=TileDecomposer.d.ts.map