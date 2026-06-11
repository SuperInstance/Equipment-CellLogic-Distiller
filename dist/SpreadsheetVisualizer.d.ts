/**
 * SpreadsheetVisualizer - Converts logic tiles to spreadsheet format
 *
 * This module transforms decomposed logic tiles into spreadsheet-compatible
 * cell structures with formatting, formulas, and visualization metadata.
 */
import type { LogicTile, SpreadsheetCell, LogicSpreadsheet, ReverseEngineerResult } from './types';
/**
 * SpreadsheetVisualizer class
 * Converts logic tiles into spreadsheet-compatible formats
 */
export declare class SpreadsheetVisualizer {
    /** Default column definitions */
    private readonly defaultColumns;
    /** Color palette for cell types */
    private readonly colorPalette;
    /**
     * Convert logic tiles to a full spreadsheet
     */
    visualize(tiles: LogicTile[], sourcePrompt?: string, sourceResponse?: string): LogicSpreadsheet;
    /**
     * Extract cell value for a given column
     */
    private extractCellValue;
    /**
     * Generate formula for a cell
     */
    private generateFormula;
    /**
     * Get cell formatting based on type and confidence
     */
    private getCellFormatting;
    /**
     * Generate comments for a cell
     */
    private generateComments;
    /**
     * Get cell dependencies
     */
    private getDependencies;
    /**
     * Generate cell ID from row and column
     */
    private cellId;
    /**
     * Convert column index to Excel-style name
     */
    private columnIndexToName;
    /**
     * Export spreadsheet to CSV format
     */
    toCSV(spreadsheet: LogicSpreadsheet): string;
    /**
     * Export spreadsheet to JSON format
     */
    toJSON(spreadsheet: LogicSpreadsheet): object;
    /**
     * Export spreadsheet to HTML table
     */
    toHTML(spreadsheet: LogicSpreadsheet): string;
    /**
     * Convert formatting object to CSS style string
     */
    private formattingToStyle;
    /**
     * Escape HTML special characters
     */
    private escapeHtml;
    /**
     * Reverse-engineer a cell to explain its logic
     */
    reverseEngineerCell(cell: SpreadsheetCell, tiles: Map<string, LogicTile>): ReverseEngineerResult;
    /**
     * Create a summary visualization
     */
    createSummaryVisualization(tiles: LogicTile[]): string;
}
export default SpreadsheetVisualizer;
//# sourceMappingURL=SpreadsheetVisualizer.d.ts.map