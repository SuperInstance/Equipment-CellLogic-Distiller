/**
 * Equipment System - Modular capabilities for the Origin Core
 * 
 * Equipment can be equipped/unequipped dynamically.
 * When unequipped, triggers are extracted for "muscle memory".
 */

import type {
  Equipment,
  EquipmentSlot,
  OriginCore,
  Tile,
  CostMetrics,
  BenefitMetrics,
  TriggerThresholds,
  EquipmentDescription,
} from '../types';

// ============================================
// Base Equipment Class
// ============================================

export abstract class BaseEquipment implements Equipment {
  abstract readonly name: string;
  abstract readonly slot: EquipmentSlot;
  abstract readonly version: string;
  abstract readonly description: string;
  
  abstract readonly cost: CostMetrics;
  abstract readonly benefit: BenefitMetrics;
  abstract readonly triggerThresholds: TriggerThresholds;
  
  async equip(agent: OriginCore): Promise<void> {
    // Override in subclass
  }
  
  async unequip(agent: OriginCore): Promise<void> {
    // Override in subclass
  }
  
  describe(): EquipmentDescription {
    return {
      name: this.name,
      slot: this.slot,
      purpose: this.description,
      whenToUse: [],
      whenToRemove: [],
      dependencies: [],
      conflicts: [],
    };
  }
  
  abstract asTile(): Tile;
}

// ============================================
// Memory Equipment
// ============================================

export interface HierarchicalMemoryConfig {
  workingCapacity?: number;
  autoConsolidate?: boolean;
}

export class HierarchicalMemoryEquipment extends BaseEquipment {
  readonly name = 'HierarchicalMemory';
  readonly slot: EquipmentSlot = 'MEMORY';
  readonly version = '1.0.0';
  readonly description = '4-tier cognitive memory: Working, Episodic, Semantic, Procedural';
  
  readonly cost: CostMetrics = {
    memoryBytes: 10_000_000, // 10MB
    cpuPercent: 5,
    latencyMs: 1,
    costPerUse: 0,
  };
  
  readonly benefit: BenefitMetrics = {
    accuracyBoost: 0.15,
    speedMultiplier: 1.5,
    confidenceBoost: 0.2,
    capabilityGain: ['state_persistence', 'context_recall', 'skill_learning'],
  };
  
  readonly triggerThresholds: TriggerThresholds = {
    equipWhen: [
      { metric: 'complexity', operator: '>', value: 0.4 },
      { metric: 'confidence', operator: '<', value: 0.7 },
    ],
    unequipWhen: [
      { metric: 'memory', operator: '>', value: 0.95 },
    ],
    callTeacher: { low: 0.3, high: 0.7 },
  };
  
  private config: HierarchicalMemoryConfig;
  private memory: Map<string, any>;
  
  constructor(config: HierarchicalMemoryConfig = {}) {
    super();
    this.config = config;
    this.memory = new Map();
  }
  
  async equip(agent: OriginCore): Promise<void> {
    // Initialize memory structure
    this.memory.set('working', new Map());
    this.memory.set('episodic', []);
    this.memory.set('semantic', new Map());
    this.memory.set('procedural', new Map());
  }
  
  async unequip(agent: OriginCore): Promise<void> {
    // Before unequipping, save trigger patterns
    this.memory.clear();
  }
  
  asTile(): Tile {
    return {
      inputType: { type: 'object', properties: { action: { type: 'primitive', name: 'string' }, data: { type: 'primitive', name: 'string' } } },
      outputType: { type: 'union', members: [{ type: 'primitive', name: 'string' }, { type: 'primitive', name: 'null' }] },
      compute: (input: { action: string; data?: any }) => {
        const { action, data } = input;
        
        switch (action) {
          case 'remember':
            this.remember(data);
            return { status: 'remembered', key: data?.key };
          case 'recall':
            return this.recall(data?.key);
          case 'consolidate':
            this.consolidate();
            return { status: 'consolidated' };
          default:
            return null;
        }
      },
      confidence: () => 0.9,
      trace: (input) => `Memory.${input.action}`,
    };
  }
  
  private remember(data: { key: string; value: any; tier?: string }): void {
    const tier = data.tier ?? 'working';
    const tierMemory = this.memory.get(tier);
    if (tierMemory instanceof Map) {
      tierMemory.set(data.key, { value: data.value, timestamp: Date.now() });
    }
  }
  
  private recall(key: string): any {
    // Search all tiers
    for (const tier of ['working', 'semantic', 'procedural']) {
      const tierMemory = this.memory.get(tier);
      if (tierMemory instanceof Map && tierMemory.has(key)) {
        return tierMemory.get(key);
      }
    }
    return null;
  }
  
  private consolidate(): void {
    // Move items from working to semantic based on importance
    const working = this.memory.get('working') as Map<string, any>;
    const semantic = this.memory.get('semantic') as Map<string, any>;
    
    for (const [key, entry] of working) {
      if (entry.importance && entry.importance > 0.6) {
        semantic.set(key, entry);
        working.delete(key);
      }
    }
  }
}

// ============================================
// Reasoning Equipment
// ============================================

export interface EscalationEngineConfig {
  botMinConfidence?: number;
  brainMinConfidence?: number;
  highStakesThreshold?: number;
}

export class EscalationEngineEquipment extends BaseEquipment {
  readonly name = 'EscalationEngine';
  readonly slot: EquipmentSlot = 'REASONING';
  readonly version = '1.0.0';
  readonly description = 'Intelligent LLM routing: Bot → Brain → Human (40x cost reduction)';
  
  readonly cost: CostMetrics = {
    memoryBytes: 1_000_000,
    cpuPercent: 2,
    latencyMs: 0.1,
    costPerUse: 0.001,
  };
  
  readonly benefit: BenefitMetrics = {
    accuracyBoost: 0.1,
    speedMultiplier: 2.0,
    confidenceBoost: 0.15,
    capabilityGain: ['intelligent_routing', 'cost_optimization', 'escalation'],
  };
  
  readonly triggerThresholds: TriggerThresholds = {
    equipWhen: [
      { metric: 'complexity', operator: '>', value: 0.3 },
    ],
    unequipWhen: [
      { metric: 'confidence', operator: '>', value: 0.95 },
    ],
    callTeacher: { low: 0.2, high: 0.8 },
  };
  
  private config: EscalationEngineConfig;
  private metrics: { totalRequests: number; costSaved: number };
  
  constructor(config: EscalationEngineConfig = {}) {
    super();
    this.config = {
      botMinConfidence: 0.7,
      brainMinConfidence: 0.5,
      highStakesThreshold: 0.7,
      ...config,
    };
    this.metrics = { totalRequests: 0, costSaved: 0 };
  }
  
  asTile(): Tile {
    return {
      inputType: { type: 'object', properties: { context: { type: 'primitive', name: 'string' } } },
      outputType: { type: 'object', properties: { tier: { type: 'primitive', name: 'string' }, reason: { type: 'primitive', name: 'string' } } },
      compute: (input: { context: any }) => this.route(input.context),
      confidence: (input: { context: any }) => {
        const decision = this.route(input.context);
        return decision.tier === 'bot' ? 0.9 : decision.tier === 'brain' ? 0.7 : 0.5;
      },
      trace: () => 'EscalationEngine.route',
    };
  }
  
  private route(context: any): { tier: string; reason: string } {
    this.metrics.totalRequests++;
    
    const stakes = context?.stakes ?? 0.5;
    const urgency = context?.urgencyMs ?? 5000;
    const isNovel = context?.isNovel ?? false;
    
    if (stakes >= this.config.highStakesThreshold!) {
      this.metrics.costSaved += 0.028; // Would have cost $0.03, now $0.002
      return { tier: 'human', reason: 'High stakes threshold exceeded' };
    }
    
    if (urgency < 100) {
      return { tier: 'bot', reason: 'Urgent request, fast response' };
    }
    
    if (!isNovel && stakes < 0.5) {
      return { tier: 'bot', reason: 'Known pattern, low stakes' };
    }
    
    return { tier: 'brain', reason: 'Medium complexity, local processing' };
  }
  
  getMetrics(): { totalRequests: number; costSaved: number } {
    return { ...this.metrics };
  }
}

// ============================================
// Consensus Equipment
// ============================================

export class TripartiteConsensusEquipment extends BaseEquipment {
  readonly name = 'TripartiteConsensus';
  readonly slot: EquipmentSlot = 'CONSENSUS';
  readonly version = '1.0.0';
  readonly description = '3-agent deliberation: Pathos (Intent) + Logos (Logic) + Ethos (Truth)';
  
  readonly cost: CostMetrics = {
    memoryBytes: 5_000_000,
    cpuPercent: 10,
    latencyMs: 500,
    costPerUse: 0.01,
  };
  
  readonly benefit: BenefitMetrics = {
    accuracyBoost: 0.25,
    speedMultiplier: 0.8, // Slower but more accurate
    confidenceBoost: 0.3,
    capabilityGain: ['reliable_decisions', 'safety_verification', 'multi_perspective'],
  };
  
  readonly triggerThresholds: TriggerThresholds = {
    equipWhen: [
      { metric: 'complexity', operator: '>', value: 0.6 },
      { metric: 'load', operator: '<', value: 0.7 },
    ],
    unequipWhen: [
      { metric: 'complexity', operator: '<', value: 0.3 },
    ],
    callTeacher: { low: 0.4, high: 0.9 },
  };
  
  asTile(): Tile {
    return {
      inputType: { type: 'object', properties: { query: { type: 'primitive', name: 'string' } } },
      outputType: { type: 'object', properties: { decision: { type: 'primitive', name: 'string' }, confidence: { type: 'primitive', name: 'number' } } },
      compute: (input: { query: string; domain?: string }) => this.deliberate(input.query, input.domain),
      confidence: () => 0.85,
      trace: () => 'TripartiteConsensus.deliberate',
    };
  }
  
  private deliberate(query: string, domain: string = 'general'): { decision: string; confidence: number } {
    // Simulate 3-agent deliberation
    const weights = this.getDomainWeights(domain);
    
    // In a real implementation, this would call actual LLM agents
    return {
      decision: `Consensus decision for: ${query}`,
      confidence: weights.ethos * 0.9 + weights.logos * 0.85 + weights.pathos * 0.8,
    };
  }
  
  private getDomainWeights(domain: string): { pathos: number; logos: number; ethos: number } {
    switch (domain) {
      case 'factual':
        return { pathos: 0.2, logos: 0.5, ethos: 0.3 };
      case 'emotional':
        return { pathos: 0.5, logos: 0.2, ethos: 0.3 };
      case 'sensitive':
        return { pathos: 0.2, logos: 0.2, ethos: 0.6 };
      case 'creative':
        return { pathos: 0.4, logos: 0.3, ethos: 0.3 };
      default:
        return { pathos: 0.33, logos: 0.34, ethos: 0.33 };
    }
  }
}

// ============================================
// Spreadsheet Equipment
// ============================================

export class POLLNInterfaceEquipment extends BaseEquipment {
  readonly name = 'POLLNInterface';
  readonly slot: EquipmentSlot = 'SPREADSHEET';
  readonly version = '1.0.0';
  readonly description = 'Tile-based spreadsheet interface for logic visualization';
  
  readonly cost: CostMetrics = {
    memoryBytes: 2_000_000,
    cpuPercent: 3,
    latencyMs: 10,
    costPerUse: 0,
  };
  
  readonly benefit: BenefitMetrics = {
    accuracyBoost: 0.05,
    speedMultiplier: 1.2,
    confidenceBoost: 0.1,
    capabilityGain: ['visualization', 'audit_trail', 'tile_decomposition'],
  };
  
  readonly triggerThresholds: TriggerThresholds = {
    equipWhen: [
      { metric: 'complexity', operator: '>', value: 0.5 },
    ],
    unequipWhen: [],
    callTeacher: { low: 0.2, high: 0.8 },
  };
  
  private tiles: Map<string, any>;
  
  constructor() {
    super();
    this.tiles = new Map();
  }
  
  asTile(): Tile {
    return {
      inputType: { type: 'object', properties: { operation: { type: 'primitive', name: 'string' } } },
      outputType: { type: 'object', properties: { tiles: { type: 'array', element: { type: 'primitive', name: 'string' } } } },
      compute: (input: { operation: string; data?: any }) => this.processSpreadsheetOp(input),
      confidence: () => 0.9,
      trace: () => 'POLLNInterface.process',
    };
  }
  
  private processSpreadsheetOp(input: { operation: string; data?: any }): any {
    switch (input.operation) {
      case 'create_tile':
        return this.createTile(input.data);
      case 'decompose':
        return this.decompose(input.data);
      case 'render':
        return { tiles: Array.from(this.tiles.values()) };
      default:
        return null;
    }
  }
  
  private createTile(data: { name: string; type: string; value: any }): { id: string } {
    const id = `tile_${Date.now()}`;
    this.tiles.set(id, {
      ...data,
      id,
      confidence: 0.9,
      provenance: [],
    });
    return { id };
  }
  
  private decompose(cell: any): { tiles: string[] } {
    // Decompose a cell into named tiles
    const tiles = [
      `data_origin_tile:${cell.id}`,
      `decision_logic_tile:${cell.id}`,
      `transformation_tile:${cell.id}`,
      `confidence_tile:${cell.id}`,
      `named_interface_tile:${cell.id}`,
    ];
    
    return { tiles };
  }
}

// ============================================
// Equipment Factory
// ============================================

export function createEquipment(name: string, config?: any): Equipment | null {
  switch (name) {
    case 'HierarchicalMemory':
      return new HierarchicalMemoryEquipment(config);
    case 'EscalationEngine':
      return new EscalationEngineEquipment(config);
    case 'TripartiteConsensus':
      return new TripartiteConsensusEquipment();
    case 'POLLNInterface':
      return new POLLNInterfaceEquipment();
    default:
      return null;
  }
}

export function createDefaultEquipment(): Equipment[] {
  return [
    new HierarchicalMemoryEquipment(),
    new EscalationEngineEquipment(),
    new TripartiteConsensusEquipment(),
    new POLLNInterfaceEquipment(),
  ];
}
