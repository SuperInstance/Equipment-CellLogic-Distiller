"use strict";
/**
 * CellLogicDistiller - Main Equipment Class
 *
 * Equipment that breaks down LLM logic into spreadsheet-visualized cells
 * with tile decomposition. Implements the Equipment interface for integration
 * with the SuperInstance ecosystem.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CellLogicDistiller = void 0;
const TileDecomposer_js_1 = require("./TileDecomposer.js");
const SpreadsheetVisualizer_js_1 = require("./SpreadsheetVisualizer.js");
/**
 * CellLogicDistiller Equipment
 *
 * This equipment takes LLM prompts/responses and breaks them into named tiles,
 * outputs spreadsheet-compatible cell structures, generates NLP descriptions,
 * and can reverse-engineer cells to explain logic.
 */
class CellLogicDistiller {
    name = 'CellLogicDistiller';
    slot = 'DISTILLATION';
    version = '1.0.0';
    description = 'Breaks down LLM logic into spreadsheet-visualized cells with tile decomposition';
    cost = {
        memoryBytes: 50 * 1024 * 1024, // 50MB
        cpuPercent: 15,
        latencyMs: 500,
        costPerUse: 0.001,
    };
    benefit = {
        accuracyBoost: 0.1,
        speedMultiplier: 1.2,
        confidenceBoost: 0.15,
        capabilityGain: [
            'logic_distillation',
            'spreadsheet_generation',
            'tile_decomposition',
            'reverse_engineering',
            'nlp_documentation',
        ],
    };
    triggerThresholds = {
        equipWhen: [
            { metric: 'confidence', operator: '<', value: 0.7 },
            { metric: 'complexity', operator: '>', value: 0.5 },
        ],
        unequipWhen: [
            { metric: 'memory', operator: '>', value: 0.9 },
        ],
        callTeacher: { low: 0.3, high: 0.8 },
    };
    decomposer;
    visualizer;
    lastResult = null;
    tileCache = new Map();
    constructor(options = {}) {
        this.decomposer = new TileDecomposer_js_1.TileDecomposer(options);
        this.visualizer = new SpreadsheetVisualizer_js_1.SpreadsheetVisualizer();
    }
    /**
     * Equip the agent with this equipment
     */
    async equip(_agent) {
        // Initialize caches and resources
        this.tileCache.clear();
        this.lastResult = null;
    }
    /**
     * Unequip the agent from this equipment
     */
    async unequip(_agent) {
        // Clean up resources
        this.tileCache.clear();
        this.lastResult = null;
    }
    /**
     * Get equipment description
     */
    describe() {
        return {
            name: this.name,
            slot: this.slot,
            purpose: this.description,
            whenToUse: [
                'When you need to understand LLM logic structure',
                'When generating spreadsheet visualizations of logic',
                'When reverse-engineering cell logic',
                'When documenting LLM decision processes',
            ],
            whenToRemove: [
                'When memory is critically low',
                'When logic analysis is no longer needed',
            ],
            dependencies: [],
            conflicts: [],
        };
    }
    /**
     * Convert this equipment to a Tile
     */
    asTile() {
        return {
            inputType: {
                type: 'composite',
                properties: {
                    prompt: { type: 'string' },
                    response: { type: 'string' },
                    context: { type: 'object' },
                },
            },
            outputType: {
                type: 'composite',
                properties: {
                    tiles: { type: 'array' },
                    spreadsheet: { type: 'object' },
                    statistics: { type: 'object' },
                },
            },
            compute: (input) => {
                const typedInput = input;
                return this.distill(typedInput);
            },
            confidence: (_input) => 0.95,
            trace: (_input) => `CellLogicDistiller.distill()`,
        };
    }
    // ============================================
    // Main API Methods
    // ============================================
    /**
     * Distill LLM logic into tiles and spreadsheet
     */
    distill(input) {
        const result = this.decomposer.decompose(input);
        // Cache tiles for reverse engineering
        for (const tile of result.tiles) {
            this.tileCache.set(tile.id, tile);
        }
        this.lastResult = result;
        return result;
    }
    /**
     * Create a full spreadsheet visualization
     */
    visualize(tiles, sourcePrompt, sourceResponse) {
        return this.visualizer.visualize(tiles, sourcePrompt, sourceResponse);
    }
    /**
     * Distill and visualize in one step
     */
    distillAndVisualize(input) {
        const result = this.distill(input);
        const spreadsheet = this.visualizer.visualize(result.tiles, input.prompt, input.response);
        return { result, spreadsheet };
    }
    // ============================================
    // Reverse Engineering
    // ============================================
    /**
     * Reverse-engineer a tile by ID
     */
    reverseEngineerTile(tileId) {
        const tile = this.tileCache.get(tileId);
        if (!tile) {
            return null;
        }
        return this.decomposer.reverseEngineer(tile);
    }
    /**
     * Reverse-engineer a cell by ID
     */
    reverseEngineerCell(cellId) {
        if (!this.lastResult) {
            return null;
        }
        // Find the cell in the spreadsheet
        const cell = this.lastResult.spreadsheet.cells.get(cellId);
        if (!cell) {
            return null;
        }
        return this.visualizer.reverseEngineerCell(cell, this.tileCache);
    }
    /**
     * Explain what a specific logic does
     */
    explainLogic(tileId) {
        const tile = this.tileCache.get(tileId);
        if (!tile) {
            return `Tile "${tileId}" not found in cache.`;
        }
        const lines = [];
        lines.push(`# Logic Explanation: ${tile.name}`);
        lines.push('');
        lines.push('## Overview');
        lines.push(tile.nlpDescription);
        lines.push('');
        lines.push('## Decision Logic');
        lines.push(`- **Type:** ${tile.decisionLogic.type}`);
        lines.push(`- **Rule:** ${tile.decisionLogic.rule}`);
        if (tile.decisionLogic.conditions.length > 0) {
            lines.push('');
            lines.push('## Conditions');
            for (const cond of tile.decisionLogic.conditions) {
                lines.push(`- ${cond.left} ${cond.operator} ${cond.right}`);
            }
        }
        lines.push('');
        lines.push('## Transformation');
        lines.push(`- **Type:** ${tile.transformation.type}`);
        lines.push(`- **Description:** ${tile.transformation.description}`);
        lines.push('');
        lines.push('## Interface');
        lines.push(`\`\`\`typescript`);
        lines.push(`${tile.namedInterface.name}(${tile.namedInterface.parameters.map(p => p.name).join(', ')}): ${tile.namedInterface.returnType}`);
        lines.push(`\`\`\``);
        lines.push(tile.namedInterface.documentation);
        return lines.join('\n');
    }
    // ============================================
    // Export Methods
    // ============================================
    /**
     * Export spreadsheet to CSV
     */
    exportToCSV(spreadsheet) {
        return this.visualizer.toCSV(spreadsheet);
    }
    /**
     * Export spreadsheet to JSON
     */
    exportToJSON(spreadsheet) {
        return JSON.stringify(this.visualizer.toJSON(spreadsheet), null, 2);
    }
    /**
     * Export spreadsheet to HTML
     */
    exportToHTML(spreadsheet) {
        return this.visualizer.toHTML(spreadsheet);
    }
    /**
     * Generate a summary report
     */
    generateSummary(tiles) {
        return this.visualizer.createSummaryVisualization(tiles);
    }
    // ============================================
    // Utility Methods
    // ============================================
    /**
     * Get cached tile by ID
     */
    getTile(tileId) {
        return this.tileCache.get(tileId);
    }
    /**
     * Get all cached tiles
     */
    getAllTiles() {
        return Array.from(this.tileCache.values());
    }
    /**
     * Get the last distillation result
     */
    getLastResult() {
        return this.lastResult;
    }
    /**
     * Clear the tile cache
     */
    clearCache() {
        this.tileCache.clear();
        this.lastResult = null;
    }
    /**
     * Get statistics about cached tiles
     */
    getStatistics() {
        const tiles = Array.from(this.tileCache.values());
        const typeDistribution = {};
        let totalConfidence = 0;
        for (const tile of tiles) {
            totalConfidence += tile.confidence;
            const type = tile.decisionLogic.type;
            typeDistribution[type] = (typeDistribution[type] ?? 0) + 1;
        }
        return {
            tileCount: tiles.length,
            averageConfidence: tiles.length > 0 ? totalConfidence / tiles.length : 0,
            typeDistribution,
        };
    }
}
exports.CellLogicDistiller = CellLogicDistiller;
exports.default = CellLogicDistiller;
//# sourceMappingURL=CellLogicDistiller.js.map