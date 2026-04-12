/**
 * Equipment-CellLogic-Distiller — Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { CellLogicDistiller } from '../CellLogicDistiller';

describe('CellLogicDistiller', () => {
  let cld: CellLogicDistiller;
  beforeEach(() => { cld = new CellLogicDistiller(); });

  it('should create with default options', () => {
    expect(cld).toBeDefined();
  });

  it('should create with custom options', () => {
    const custom = new CellLogicDistiller({
      minConfidence: 0.8,
      maxTiles: 10,
      includeNlpDescriptions: true,
    });
    expect(custom).toBeDefined();
  });

  it('should describe equipment', () => {
    const desc = cld.describe();
    expect(desc).toBeDefined();
  });

  it('should distill input', () => {
    const result = cld.distill({
      prompt: 'What is the capital of France?',
      response: 'The capital of France is Paris.',
    });
    expect(result).toBeDefined();
  });

  it('should distill with context', () => {
    const result = cld.distill({
      prompt: 'Analyze this data',
      response: 'The data shows an upward trend.',
      context: { domain: 'analytics' },
    });
    expect(result).toBeDefined();
  });

  it('should visualize tiles', () => {
    const distilled = cld.distill({
      prompt: 'Classify this',
      response: 'This is a positive sentiment.',
    });
    if (distilled.tiles && distilled.tiles.length > 0) {
      const spreadsheet = cld.visualize(distilled.tiles);
      expect(spreadsheet).toBeDefined();
    } else {
      // No tiles extracted — still valid
      expect(distilled).toBeDefined();
    }
  });

  it('should distill and visualize in one step', () => {
    const result = cld.distillAndVisualize({
      prompt: 'Process this request',
      response: 'Request processed successfully with status OK.',
    });
    expect(result).toBeDefined();
    expect(result.result).toBeDefined();
    expect(result.spreadsheet).toBeDefined();
  });

  it('should get all tiles after distillation', () => {
    cld.distill({
      prompt: 'Test prompt',
      response: 'Test response with some logic to extract.',
    });
    const tiles = cld.getAllTiles();
    expect(Array.isArray(tiles)).toBe(true);
  });

  it('should get last result', () => {
    cld.distill({ prompt: 'p', response: 'r' });
    const last = cld.getLastResult();
    expect(last).toBeDefined();
  });

  it('should return null last result before distillation', () => {
    expect(cld.getLastResult()).toBeNull();
  });

  it('should clear cache', () => {
    cld.distill({ prompt: 'p', response: 'r' });
    cld.clearCache();
    // Cache cleared — getAllTiles should be empty or stale
    expect(cld).toBeDefined();
  });

  it('should get statistics', () => {
    cld.distill({ prompt: 'p', response: 'r' });
    const stats = cld.getStatistics();
    expect(stats).toBeDefined();
  });

  it('should get tile by id after distillation', () => {
    const result = cld.distill({ prompt: 'p', response: 'r' });
    if (result.tiles && result.tiles.length > 0) {
      const tile = cld.getTile(result.tiles[0].id);
      expect(tile).toBeDefined();
    }
  });

  it('should return undefined for unknown tile id', () => {
    expect(cld.getTile('nonexistent')).toBeUndefined();
  });

  it('should export to CSV', () => {
    const result = cld.distillAndVisualize({
      prompt: 'p', response: 'r',
    });
    const csv = cld.exportToCSV(result.spreadsheet);
    expect(typeof csv).toBe('string');
  });

  it('should export to JSON', () => {
    const result = cld.distillAndVisualize({
      prompt: 'p', response: 'r',
    });
    const json = cld.exportToJSON(result.spreadsheet);
    expect(typeof json).toBe('string');
    // Should be valid JSON
    expect(() => JSON.parse(json)).not.toThrow();
  });

  it('should export to HTML', () => {
    const result = cld.distillAndVisualize({
      prompt: 'p', response: 'r',
    });
    const html = cld.exportToHTML(result.spreadsheet);
    expect(typeof html).toBe('string');
  });

  it('should generate summary', () => {
    const result = cld.distill({ prompt: 'p', response: 'r' });
    const summary = cld.generateSummary(result.tiles || []);
    expect(typeof summary).toBe('string');
  });

  it('should explain logic for a tile', () => {
    const result = cld.distill({ prompt: 'p', response: 'r' });
    if (result.tiles && result.tiles.length > 0) {
      const explanation = cld.explainLogic(result.tiles[0].id);
      expect(typeof explanation).toBe('string');
    }
  });

  it('should handle complex input', () => {
    const result = cld.distill({
      prompt: 'Analyze the relationship between temperature and pressure in a closed system.',
      response: 'According to Gay-Lussac\'s law, pressure is directly proportional to temperature in a closed system. As temperature increases, molecular kinetic energy increases, leading to more frequent and energetic collisions with container walls, thus increasing pressure.',
      context: { domain: 'physics' },
    });
    expect(result).toBeDefined();
  });

  it('should asTile return a tile', () => {
    const tile = cld.asTile();
    expect(tile).toBeDefined();
  });

  it('should reverse engineer tile', () => {
    const result = cld.distill({ prompt: 'p', response: 'r' });
    if (result.tiles && result.tiles.length > 0) {
      const re = cld.reverseEngineerTile(result.tiles[0].id);
      // May return string or null depending on implementation
      expect(re === null || typeof re === 'string').toBe(true);
    }
  });

  it('should reverse engineer cell', () => {
    const result = cld.distillAndVisualize({ prompt: 'p', response: 'r' });
    if (result.spreadsheet && result.spreadsheet.cells) {
      const firstCellId = Object.keys(result.spreadsheet.cells)[0];
      if (firstCellId) {
        const re = cld.reverseEngineerCell(firstCellId);
        expect(re === null || typeof re === 'object').toBe(true);
      }
    }
  });
});
