/**
 * SuperInstance-Starter-Agent — Tests
 * OriginCore: the minimal agent at the center of everything
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { OriginCore } from '../src/OriginCore';
import type { Equipment, EquipmentSlot, Task } from '../src/types';

// Mock equipment for testing
function makeEquipment(name: string, slot: EquipmentSlot): Equipment {
  return {
    name,
    slot,
    version: '1.0.0',
    description: `Test ${name}`,
    cost: { tokens: 10, latencyMs: 50, financialUsd: 0.001 },
    benefit: { accuracy: 0.9, coverage: 0.8, versatility: 0.7 },
    triggerThresholds: { activateConfidence: 0.5, deactivateConfidence: 0.2 },
    equip: async () => {},
    unequip: async () => {},
    asTile: () => ({ id: `tile-${name}`, type: 'skill' as const, name, content: {}, metadata: {}, createdAt: new Date(), updatedAt: new Date(), usageCount: 0 }),
    describe: () => ({ name, slot, purpose: 'test', whenToUse: ['testing'], whenToRemove: ['done'] }),
  };
}

describe('OriginCore', () => {
  let core: OriginCore;
  beforeEach(() => { core = new OriginCore(); });

  it('should create with default config', () => {
    expect(core).toBeDefined();
    expect(core.id).toBeDefined();
  });

  it('should create with custom config', () => {
    const custom = new OriginCore({ id: 'test-agent', name: 'Test Agent' });
    expect(custom.id).toBeDefined();
  });

  it('should have reference frame', () => {
    expect(core.referenceFrame).toBeDefined();
  });

  it('should have empty equipment map', () => {
    expect(core.equipment.size).toBe(0);
  });

  it('should register equipment', () => {
    const eq = makeEquipment('test-eq', 'memory');
    core.registerEquipment(eq);
    expect(core.availableEquipment.has('test-eq')).toBe(true);
  });

  it('should equip registered equipment', async () => {
    const eq = makeEquipment('test-eq', 'memory');
    core.registerEquipment(eq);
    const result = await core.equip('test-eq');
    expect(result).toBe(true);
    expect(core.equipment.has('memory')).toBe(true);
  });

  it('should unequip equipment', async () => {
    const eq = makeEquipment('test-eq', 'memory');
    core.registerEquipment(eq);
    await core.equip('test-eq');
    const result = await core.unequipSlot('memory');
    expect(result).toBe(true);
    expect(core.equipment.has('memory')).toBe(false);
  });

  it('should check if equipment is equipped', async () => {
    const eq = makeEquipment('test-eq', 'memory');
    core.registerEquipment(eq);
    expect(core.hasEquipment('memory')).toBe(false);
    await core.equip('test-eq');
    expect(core.hasEquipment('memory')).toBe(true);
  });

  it('should list equipped equipment', async () => {
    const eq1 = makeEquipment('eq1', 'memory');
    const eq2 = makeEquipment('eq2', 'reasoning');
    core.registerEquipment(eq1);
    core.registerEquipment(eq2);
    await core.equip('eq1');
    await core.equip('eq2');
    const equipped = core.getEquippedEquipment();
    expect(equipped.length).toBe(2);
  });

  it('should process a task', async () => {
    const task: Task = {
      id: 't-1',
      type: 'analysis',
      query: 'Test query',
    };
    const result = await core.processTask(task);
    expect(result).toBeDefined();
  });

  it('should process task with context', async () => {
    const task: Task = {
      id: 't-2',
      type: 'generation',
      query: 'Generate something',
      context: { domain: 'test' },
    };
    const result = await core.processTask(task);
    expect(result).toBeDefined();
  });

  it('should have state', () => {
    expect(core.state).toBeDefined();
  });

  it('should have tiles map', () => {
    expect(core.tiles).toBeDefined();
    expect(core.tiles.size).toBe(0);
  });

  it('should have rates', () => {
    expect(core.rates).toBeDefined();
  });

  it('should have history', () => {
    expect(core.history).toBeDefined();
  });

  it('should return false for unknown equipment equip', async () => {
    const result = await core.equip('nonexistent');
    expect(result).toBe(false);
  });

  it('should optimize', async () => {
    await core.optimize();
    // Should not throw
  });

  it('should handle multiple equipment registrations', () => {
    for (let i = 0; i < 5; i++) {
      core.registerEquipment(makeEquipment(`eq-${i}`, `memory` as EquipmentSlot));
    }
    expect(core.availableEquipment.size).toBeGreaterThanOrEqual(5);
  });
});
