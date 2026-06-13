# CONSTRUCT-MIGRATION: SuperInstance-Starter-Agent

**Date:** 2026-06-04 · **Source:** TypeScript → Rust

This document shows how to port each Equipment in SuperInstance-Starter-Agent to a Rust skill compatible with construct-core and ternary-registry.

---

## Overview

SuperInstance-Starter-Agent defines 4 concrete Equipment implementations:
1. **HierarchicalMemoryEquipment** (MEMORY slot)
2. **EscalationEngineEquipment** (REASONING slot)
3. **TripartiteConsensusEquipment** (CONSENSUS slot)
4. **POLLNInterfaceEquipment** (SPREADSHEET slot)

Plus the core `OriginCore` agent that manages equip/unequip lifecycle.

---

## Equipment 1: HierarchicalMemoryEquipment → Rust Skill

### Source Signature (TypeScript)

```typescript
class HierarchicalMemoryEquipment extends BaseEquipment {
  readonly name = 'HierarchicalMemory';
  readonly slot: EquipmentSlot = 'MEMORY';
  readonly version = '1.0.0';
  readonly cost: CostMetrics = { memoryBytes: 10_000_000, cpuPercent: 5, latencyMs: 1, costPerUse: 0 };
  // 4-tier memory: Working, Episodic, Semantic, Procedural
}
```

### Rust Skill Definition

```rust
use ternary_registry::*;

fn hierarchical_memory_skill() -> Skill {
    Skill::new(
        SkillId::new("superinstance", "HierarchicalMemory", SemVersion::new(1, 0, 0)),
        SkillTier::Basic,
        "4-tier cognitive memory: Working, Episodic, Semantic, Procedural",
    )
    .with_capability("state_persistence")
    .with_capability("context_recall")
    .with_capability("skill_learning")
    .with_capability("read")
    .with_capability("query")
    .with_capability("persist")
}

/// Native Rust implementation of HierarchicalMemory skill.
pub struct HierarchicalMemory {
    working: HashMap<String, MemoryEntry>,
    episodic: Vec<EpisodicEntry>,
    semantic: HashMap<String, MemoryEntry>,
    procedural: HashMap<String, ProceduralEntry>,
}

struct MemoryEntry {
    value: Vec<u8>,
    timestamp: u64,
    importance: f32,
}

struct EpisodicEntry {
    event: Vec<u8>,
    timestamp: u64,
}

struct ProceduralEntry {
    pattern: Vec<u8>,
    trigger: TriggerConfig,
}

impl HierarchicalMemory {
    pub fn new() -> Self {
        Self {
            working: HashMap::new(),
            episodic: Vec::new(),
            semantic: HashMap::new(),
            procedural: HashMap::new(),
        }
    }

    pub fn remember(&mut self, key: &str, value: &[u8], tier: &str) {
        match tier {
            "working" => { self.working.insert(key.to_string(), MemoryEntry { value: value.to_vec(), timestamp: current_ts(), importance: 0.5 }); }
            "semantic" => { self.semantic.insert(key.to_string(), MemoryEntry { value: value.to_vec(), timestamp: current_ts(), importance: 0.7 }); }
            _ => {}
        }
    }

    pub fn recall(&self, key: &str) -> Option<&[u8]> {
        // Search working → semantic → procedural
        self.working.get(key)
            .or_else(|| self.semantic.get(key))
            .map(|e| e.value.as_slice())
    }

    pub fn consolidate(&mut self) {
        let threshold = 0.6;
        let mut promoted = Vec::new();
        for (key, entry) in &self.working {
            if entry.importance > threshold {
                promoted.push((key.clone(), entry.clone()));
            }
        }
        for (key, entry) in promoted {
            self.semantic.insert(key, entry);
            self.working.remove(&key); // safe: collected above
        }
    }
}
```

### construct-core Layer: L1 (SyncConstruct)

Memory needs heap allocation (`HashMap`) but not async. Maps to `SyncConstruct::load_skill(SkillId)`.

### Dependencies

```toml
[dependencies]
ternary-registry = { path = "../ternary-registry" }
construct-core = { path = "../construct-core", features = ["alloc"] }
```

---

## Equipment 2: EscalationEngineEquipment → Rust Skill

### Source Signature (TypeScript)

```typescript
class EscalationEngineEquipment extends BaseEquipment {
  readonly name = 'EscalationEngine';
  readonly slot: EquipmentSlot = 'REASONING';
  readonly version = '1.0.0';
  readonly cost: CostMetrics = { memoryBytes: 1_000_000, cpuPercent: 2, latencyMs: 0.1, costPerUse: 0.001 };
  // Routes: Bot → Brain → Human based on stakes/urgency/novelty
}
```

### Rust Skill Definition

```rust
fn escalation_engine_skill() -> Skill {
    Skill::new(
        SkillId::new("superinstance", "EscalationEngine", SemVersion::new(1, 0, 0)),
        SkillTier::Advanced,
        "Intelligent LLM routing: Bot → Brain → Human (40x cost reduction)",
    )
    .with_capability("intelligent_routing")
    .with_capability("cost_optimization")
    .with_capability("escalation")
    .with_capability("read")
    .with_capability("query")
    .with_capability("write")
    .with_capability("compute")
    .with_capability("network")
    .with_capability("persist")
}

pub struct EscalationEngine {
    config: EscalationConfig,
    metrics: RoutingMetrics,
}

struct EscalationConfig {
    bot_min_confidence: f32,
    brain_min_confidence: f32,
    high_stakes_threshold: f32,
}

struct RoutingMetrics {
    total_requests: u64,
    cost_saved_micro: u64,
}

impl EscalationEngine {
    pub fn new() -> Self {
        Self {
            config: EscalationConfig {
                bot_min_confidence: 0.7,
                brain_min_confidence: 0.5,
                high_stakes_threshold: 0.7,
            },
            metrics: RoutingMetrics {
                total_requests: 0,
                cost_saved_micro: 0,
            },
        }
    }

    pub fn route(&mut self, stakes: f32, urgency_ms: u32, is_novel: bool) -> RoutingDecision {
        self.metrics.total_requests += 1;

        if stakes >= self.config.high_stakes_threshold {
            self.metrics.cost_saved_micro += 28000;
            return RoutingDecision { tier: "human", reason: "High stakes threshold exceeded" };
        }

        if urgency_ms < 100 {
            return RoutingDecision { tier: "bot", reason: "Urgent request, fast response" };
        }

        if !is_novel && stakes < 0.5 {
            return RoutingDecision { tier: "bot", reason: "Known pattern, low stakes" };
        }

        RoutingDecision { tier: "brain", reason: "Medium complexity, local processing" }
    }
}

struct RoutingDecision {
    tier: &'static str,
    reason: &'static str,
}
```

### construct-core Layer: L2 (AsyncConstruct)

Reasoning requires network access for LLM calls. Needs `AsyncConstruct::query_async()`.

### Dependencies

```toml
[dependencies]
ternary-registry = { path = "../ternary-registry" }
construct-core = { path = "../construct-core", features = ["std"] }
```

---

## Equipment 3: TripartiteConsensusEquipment → Rust Skill

### Source Signature (TypeScript)

```typescript
class TripartiteConsensusEquipment extends BaseEquipment {
  readonly name = 'TripartiteConsensus';
  readonly slot: EquipmentSlot = 'CONSENSUS';
  readonly version = '1.0.0';
  readonly cost: CostMetrics = { memoryBytes: 5_000_000, cpuPercent: 10, latencyMs: 500, costPerUse: 0.01 };
  // 3-agent deliberation: Pathos + Logos + Ethos
}
```

### Rust Skill Definition

```rust
fn tripartite_consensus_skill() -> Skill {
    Skill::new(
        SkillId::new("superinstance", "TripartiteConsensus", SemVersion::new(1, 0, 0)),
        SkillTier::Expert,
        "3-agent deliberation: Pathos (Intent) + Logos (Logic) + Ethos (Truth)",
    )
    .with_capability("reliable_decisions")
    .with_capability("safety_verification")
    .with_capability("multi_perspective")
    // Expert tier = all capabilities including admin and delegate
}

pub struct TripartiteConsensus {
    domain_weights: HashMap<String, DomainWeights>,
}

struct DomainWeights {
    pathos: f32,
    logos: f32,
    ethos: f32,
}

impl TripartiteConsensus {
    pub fn new() -> Self {
        let mut weights = HashMap::new();
        weights.insert("factual".into(), DomainWeights { pathos: 0.2, logos: 0.5, ethos: 0.3 });
        weights.insert("emotional".into(), DomainWeights { pathos: 0.5, logos: 0.2, ethos: 0.3 });
        weights.insert("sensitive".into(), DomainWeights { pathos: 0.2, logos: 0.2, ethos: 0.6 });
        weights.insert("creative".into(), DomainWeights { pathos: 0.4, logos: 0.3, ethos: 0.3 });
        weights.insert("general".into(), DomainWeights { pathos: 0.33, logos: 0.34, ethos: 0.33 });
        Self { domain_weights: weights }
    }

    pub fn deliberate(&self, query: &str, domain: &str) -> ConsensusResult {
        let weights = self.domain_weights.get(domain)
            .unwrap_or(&DomainWeights { pathos: 0.33, logos: 0.34, ethos: 0.33 });

        let confidence = weights.ethos * 0.9 + weights.logos * 0.85 + weights.pathos * 0.8;

        ConsensusResult {
            decision: format!("Consensus decision for: {}", query),
            confidence,
        }
    }
}
```

### construct-core Layer: L2 (AsyncConstruct)

Consensus requires multiple async LLM calls. Needs `AsyncConstruct`.

### Dependencies

```toml
[dependencies]
ternary-registry = { path = "../ternary-registry" }
construct-core = { path = "../construct-core", features = ["std"] }
```

---

## Equipment 4: POLLNInterfaceEquipment → Rust Skill

### Source Signature (TypeScript)

```typescript
class POLLNInterfaceEquipment extends BaseEquipment {
  readonly name = 'POLLNInterface';
  readonly slot: EquipmentSlot = 'SPREADSHEET';
  readonly version = '1.0.0';
  readonly cost: CostMetrics = { memoryBytes: 2_000_000, cpuPercent: 3, latencyMs: 10, costPerUse: 0 };
  // Tile-based spreadsheet interface for logic visualization
}
```

### Rust Skill Definition

```rust
fn polln_interface_skill() -> Skill {
    Skill::new(
        SkillId::new("superinstance", "POLLNInterface", SemVersion::new(1, 0, 0)),
        SkillTier::Standard,
        "Tile-based spreadsheet interface for logic visualization",
    )
    .with_capability("visualization")
    .with_capability("audit_trail")
    .with_capability("tile_decomposition")
    .with_capability("read")
    .with_capability("query")
    .with_capability("write")
    .with_capability("compute")
}

pub struct PollnInterface {
    tiles: HashMap<String, TileEntry>,
}

struct TileEntry {
    id: String,
    name: String,
    tile_type: String,
    value: Vec<u8>,
    confidence: f32,
    provenance: Vec<String>,
}

impl PollnInterface {
    pub fn new() -> Self {
        Self { tiles: HashMap::new() }
    }

    pub fn create_tile(&mut self, name: &str, tile_type: &str, value: &[u8]) -> String {
        let id = format!("tile_{}", self.tiles.len());
        self.tiles.insert(id.clone(), TileEntry {
            id: id.clone(),
            name: name.to_string(),
            tile_type: tile_type.to_string(),
            value: value.to_vec(),
            confidence: 0.9,
            provenance: Vec::new(),
        });
        id
    }

    pub fn decompose(&self, cell_id: &str) -> Vec<String> {
        vec![
            format!("data_origin_tile:{}", cell_id),
            format!("decision_logic_tile:{}", cell_id),
            format!("transformation_tile:{}", cell_id),
            format!("confidence_tile:{}", cell_id),
            format!("named_interface_tile:{}", cell_id),
        ]
    }
}
```

### construct-core Layer: L1 (SyncConstruct)

Spreadsheet operations need heap but not async.

---

## OriginCore → Rust Construct Agent

The `OriginCore` class maps to a construct-core agent that implements `SyncConstruct` (or `AsyncConstruct`):

```rust
use construct_core::{SyncConstruct, BareMetalConstruct};
use ternary_registry::{SkillRegistry, SkillId, SkillDependencyResolver};

pub struct ConstructAgent {
    // BareMetalConstruct
    lookup_table: [TritAction; 256],
    // SyncConstruct
    loaded_skills: Vec<SkillId>,
    // Equipment system (bridged)
    registry: SkillRegistry,
    available_equipment: HashMap<String, Box<dyn EquipmentSkill>>,
    equipped: HashMap<String, String>, // slot -> skill name
}

pub trait EquipmentSkill: Send + Sync {
    fn name(&self) -> &str;
    fn slot(&self) -> &str;
    fn compute(&self, input: &[u8]) -> Vec<u8>;
    fn confidence(&self, input: &[u8]) -> f32;
}

impl BareMetalConstruct for ConstructAgent {
    fn query_lookup(&self, index: u16) -> TritAction {
        self.lookup_table[(index % 256) as usize]
    }
    fn capabilities(&self) -> BareMetalCapabilities {
        BareMetalCapabilities::new(256, true, 0xFF, 4096)
    }
}

impl SyncConstruct for ConstructAgent {
    fn load_skill(&mut self, id: SkillId) -> Result<(), ConstructError> {
        // Resolve dependencies first
        let resolver = SkillDependencyResolver::new(self.registry.clone());
        let load_order = resolver.resolve(&id).map_err(|_| ConstructError::SkillNotLoaded)?;
        for skill_id in load_order {
            if !self.loaded_skills.contains(&skill_id) {
                self.loaded_skills.push(skill_id);
            }
        }
        Ok(())
    }

    fn unload_skill(&mut self, id: SkillId) -> Result<(), ConstructError> {
        self.loaded_skills.retain(|s| s != &id);
        Ok(())
    }

    fn loaded_skills(&self) -> &[SkillId] {
        &self.loaded_skills
    }

    fn query_owned(&self, q: OwnedQuery) -> Result<OwnedResponse, ConstructError> {
        // Route to appropriate equipped skill based on query
        let action = TritAction::Explore; // default
        Ok(OwnedResponse::new(action, 0.8, q.payload))
    }
}
```

---

## Dependencies Summary

```toml
[package]
name = "superinstance-skills"
version = "0.1.0"
edition = "2021"

[dependencies]
construct-core = { path = "../construct-core", features = ["std"] }
ternary-registry = { path = "../ternary-registry" }
ternary-ensign = { path = "../ternary-ensign" }
serde = { version = "1", features = ["derive"] }
serde_json = "1"
```

## Migration Priority

1. **HierarchicalMemory** — Foundation, all other skills depend on it. L1, pure Rust.
2. **POLLNInterface** — Tile visualization. L1, pure Rust.
3. **EscalationEngine** — Needs network. L2, consider WASM bridge for TypeScript LLM routing logic.
4. **TripartiteConsensus** — Most complex, Expert tier. L2, WASM bridge recommended.
