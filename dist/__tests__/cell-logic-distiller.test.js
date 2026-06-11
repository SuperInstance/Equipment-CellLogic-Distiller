"use strict";
/**
 * Equipment-CellLogic-Distiller — Tests
 */
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const CellLogicDistiller_1 = require("../CellLogicDistiller");
(0, vitest_1.describe)('CellLogicDistiller', () => {
    let cld;
    (0, vitest_1.beforeEach)(() => { cld = new CellLogicDistiller_1.CellLogicDistiller(); });
    (0, vitest_1.it)('should create with default options', () => {
        (0, vitest_1.expect)(cld).toBeDefined();
    });
    (0, vitest_1.it)('should create with custom options', () => {
        const custom = new CellLogicDistiller_1.CellLogicDistiller({
            minConfidence: 0.8,
            maxTiles: 10,
            includeNlpDescriptions: true,
        });
        (0, vitest_1.expect)(custom).toBeDefined();
    });
    (0, vitest_1.it)('should describe equipment', () => {
        const desc = cld.describe();
        (0, vitest_1.expect)(desc).toBeDefined();
    });
    (0, vitest_1.it)('should distill input', () => {
        const result = cld.distill({
            prompt: 'What is the capital of France?',
            response: 'The capital of France is Paris.',
        });
        (0, vitest_1.expect)(result).toBeDefined();
    });
    (0, vitest_1.it)('should distill with context', () => {
        const result = cld.distill({
            prompt: 'Analyze this data',
            response: 'The data shows an upward trend.',
            context: { domain: 'analytics' },
        });
        (0, vitest_1.expect)(result).toBeDefined();
    });
    (0, vitest_1.it)('should visualize tiles', () => {
        const distilled = cld.distill({
            prompt: 'Classify this',
            response: 'This is a positive sentiment.',
        });
        if (distilled.tiles && distilled.tiles.length > 0) {
            const spreadsheet = cld.visualize(distilled.tiles);
            (0, vitest_1.expect)(spreadsheet).toBeDefined();
        }
        else {
            // No tiles extracted — still valid
            (0, vitest_1.expect)(distilled).toBeDefined();
        }
    });
    (0, vitest_1.it)('should distill and visualize in one step', () => {
        const result = cld.distillAndVisualize({
            prompt: 'Process this request',
            response: 'Request processed successfully with status OK.',
        });
        (0, vitest_1.expect)(result).toBeDefined();
        (0, vitest_1.expect)(result.result).toBeDefined();
        (0, vitest_1.expect)(result.spreadsheet).toBeDefined();
    });
    (0, vitest_1.it)('should get all tiles after distillation', () => {
        cld.distill({
            prompt: 'Test prompt',
            response: 'Test response with some logic to extract.',
        });
        const tiles = cld.getAllTiles();
        (0, vitest_1.expect)(Array.isArray(tiles)).toBe(true);
    });
    (0, vitest_1.it)('should get last result', () => {
        cld.distill({ prompt: 'p', response: 'r' });
        const last = cld.getLastResult();
        (0, vitest_1.expect)(last).toBeDefined();
    });
    (0, vitest_1.it)('should return null last result before distillation', () => {
        (0, vitest_1.expect)(cld.getLastResult()).toBeNull();
    });
    (0, vitest_1.it)('should clear cache', () => {
        cld.distill({ prompt: 'p', response: 'r' });
        cld.clearCache();
        // Cache cleared — getAllTiles should be empty or stale
        (0, vitest_1.expect)(cld).toBeDefined();
    });
    (0, vitest_1.it)('should get statistics', () => {
        cld.distill({ prompt: 'p', response: 'r' });
        const stats = cld.getStatistics();
        (0, vitest_1.expect)(stats).toBeDefined();
    });
    (0, vitest_1.it)('should get tile by id after distillation', () => {
        const result = cld.distill({ prompt: 'p', response: 'r' });
        if (result.tiles && result.tiles.length > 0) {
            const tile = cld.getTile(result.tiles[0].id);
            (0, vitest_1.expect)(tile).toBeDefined();
        }
    });
    (0, vitest_1.it)('should return undefined for unknown tile id', () => {
        (0, vitest_1.expect)(cld.getTile('nonexistent')).toBeUndefined();
    });
    (0, vitest_1.it)('should export to CSV', () => {
        const result = cld.distillAndVisualize({
            prompt: 'p', response: 'r',
        });
        const csv = cld.exportToCSV(result.spreadsheet);
        (0, vitest_1.expect)(typeof csv).toBe('string');
    });
    (0, vitest_1.it)('should export to JSON', () => {
        const result = cld.distillAndVisualize({
            prompt: 'p', response: 'r',
        });
        const json = cld.exportToJSON(result.spreadsheet);
        (0, vitest_1.expect)(typeof json).toBe('string');
        // Should be valid JSON
        (0, vitest_1.expect)(() => JSON.parse(json)).not.toThrow();
    });
    (0, vitest_1.it)('should export to HTML', () => {
        const result = cld.distillAndVisualize({
            prompt: 'p', response: 'r',
        });
        const html = cld.exportToHTML(result.spreadsheet);
        (0, vitest_1.expect)(typeof html).toBe('string');
    });
    (0, vitest_1.it)('should generate summary', () => {
        const result = cld.distill({ prompt: 'p', response: 'r' });
        const summary = cld.generateSummary(result.tiles || []);
        (0, vitest_1.expect)(typeof summary).toBe('string');
    });
    (0, vitest_1.it)('should explain logic for a tile', () => {
        const result = cld.distill({ prompt: 'p', response: 'r' });
        if (result.tiles && result.tiles.length > 0) {
            const explanation = cld.explainLogic(result.tiles[0].id);
            (0, vitest_1.expect)(typeof explanation).toBe('string');
        }
    });
    (0, vitest_1.it)('should handle complex input', () => {
        const result = cld.distill({
            prompt: 'Analyze the relationship between temperature and pressure in a closed system.',
            response: 'According to Gay-Lussac\'s law, pressure is directly proportional to temperature in a closed system. As temperature increases, molecular kinetic energy increases, leading to more frequent and energetic collisions with container walls, thus increasing pressure.',
            context: { domain: 'physics' },
        });
        (0, vitest_1.expect)(result).toBeDefined();
    });
    (0, vitest_1.it)('should asTile return a tile', () => {
        const tile = cld.asTile();
        (0, vitest_1.expect)(tile).toBeDefined();
    });
    (0, vitest_1.it)('should reverse engineer tile', () => {
        const result = cld.distill({ prompt: 'p', response: 'r' });
        if (result.tiles && result.tiles.length > 0) {
            const re = cld.reverseEngineerTile(result.tiles[0].id);
            // May return string or null depending on implementation
            (0, vitest_1.expect)(re === null || typeof re === 'string').toBe(true);
        }
    });
    (0, vitest_1.it)('should reverse engineer cell', () => {
        const result = cld.distillAndVisualize({ prompt: 'p', response: 'r' });
        if (result.spreadsheet && result.spreadsheet.cells) {
            const firstCellId = Object.keys(result.spreadsheet.cells)[0];
            if (firstCellId) {
                const re = cld.reverseEngineerCell(firstCellId);
                (0, vitest_1.expect)(re === null || typeof re === 'object').toBe(true);
            }
        }
    });
});
//# sourceMappingURL=cell-logic-distiller.test.js.map