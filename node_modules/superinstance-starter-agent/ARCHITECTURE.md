# SuperInstance Starter Agent Architecture

## Core Philosophy

The SuperInstance Starter Agent is built on the principle that intelligence emerges from **Origin-Centric computation** with **modular equipment** that can be dynamically equipped and unequipped based on task demands.

### The SuperInstance Paradigm

1. **Origin-Centric**: Every computation tracks its provenance chain, transformation history, and local reference frame
2. **Tile-Based**: Logic is decomposed into typed computational units with confidence tracking
3. **Equipment-First**: The agent starts minimal and equips what it needs
4. **Self-Optimizing**: Equipment can be removed once muscle memory/triggers are established

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    SUPERINSTANCE STARTER AGENT                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                      ORIGIN CORE (Minimal)                       │   │
│  │  • Identity (id, reference frame, state)                        │   │
│  │  • Provenance Chain (immutable, append-only)                    │   │
│  │  • Rate-Based State (dD/dt, dT/dt, dΦ/dt)                       │   │
│  │  • Equipment Registry (equipped, available, triggers)            │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                   │                                     │
│                                   ▼                                     │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    EQUIPMENT SLOTS                               │   │
│  │                                                                  │   │
│  │  [SLOT 1: MEMORY]    [SLOT 2: REASONING]    [SLOT 3: CONSENSUS] │   │
│  │       │                    │                      │              │   │
│  │       ▼                    ▼                      ▼              │   │
│  │  ┌─────────┐          ┌─────────┐           ┌─────────┐        │   │
│  │  │Hierarch.│          │Escalation│           │Tripartite│       │   │
│  │  │ Memory  │          │ Engine  │           │ Consensus│       │   │
│  │  └─────────┘          └─────────┘           └─────────┘        │   │
│  │                                                                  │   │
│  │  [SLOT 4: SPREADSHEET]  [SLOT 5: DISTILLATION]  [SLOT 6: ...]  │   │
│  │       │                       │                                  │   │
│  │       ▼                       ▼                                  │   │
│  │  ┌─────────────┐          ┌─────────────┐                       │   │
│  │  │  POLLN Tile │          │Model Distill│                       │   │
│  │  │  Interface  │          │   Engine    │                       │   │
│  │  └─────────────┘          └─────────────┘                       │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                   │                                     │
│                                   ▼                                     │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    TRIGGER SYSTEM                                │   │
│  │  • Threshold Monitors (confidence, load, complexity)             │   │
│  │  • Deadband Controllers (when to call teacher)                   │   │
│  │  • Equipment Recommendations (auto-equip/unequip)                │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. Origin Core

The minimal starting point - a self-contained computational unit:

```typescript
interface OriginCore {
  // Identity
  id: string;                              // Unique identifier
  referenceFrame: LocalCoordinateSystem;    // Local R_i
  state: OriginState;                      // Local S_i
  
  // Provenance
  provenance: ProvenanceChain;              // O = (o_0, t_1, o_1, ...)
  
  // Rate-based state
  dataRate: Rate<dD/dt>;                    // Rate of data change
  transformRate: Rate<dT/dt>;               // Rate of transformation
  functionRate: Rate<dΦ/dt>;                // Rate of function change
  
  // Equipment
  equipment: Map<SlotType, Equipment>;
  triggers: TriggerRegistry;
}
```

### 2. Equipment Slots

The agent has 6 primary equipment slots, each representing a capability domain:

| Slot | Purpose | Default Equipment | Alternative Equipment |
|------|---------|-------------------|----------------------|
| MEMORY | State persistence | HierarchicalMemory | SimpleCache, VectorDB |
| REASONING | Decision routing | EscalationEngine | DirectLLM, RuleEngine |
| CONSENSUS | Reliable decisions | TripartiteConsensus | SimpleVote, WeightedAverage |
| SPREADSHEET | Logic visualization | POLLNInterface | MarkdownOut, JSONExport |
| DISTILLATION | Model compression | ModelDistiller | None (equippable) |
| PERCEPTION | Input processing | TextProcessor | VisionProcessor, AudioProcessor |

### 3. Equipment Interface

Each equipment follows a standard interface:

```typescript
interface Equipment {
  // Identity
  name: string;
  slot: SlotType;
  version: string;
  
  // Lifecycle
  equip(agent: OriginCore): Promise<void>;
  unequip(agent: OriginCore): Promise<void>;
  
  // Performance
  cost: CostMetrics;         // Memory, CPU, latency
  benefit: BenefitMetrics;   // Accuracy, speed, confidence
  
  // Triggers
  triggerThresholds: {
    equipWhen: Condition[];
    unequipWhen: Condition[];
    callTeacher: Condition;  // Deadband range
  };
  
  // Self-description
  describe(): EquipmentDescription;
}
```

### 4. Trigger System

The trigger system monitors thresholds and decides when to equip/unequip:

```typescript
interface TriggerSystem {
  // Threshold monitoring
  thresholds: {
    confidence: { low: number, high: number };  // e.g., [0.6, 0.9]
    load: { low: number, high: number };         // e.g., [0.3, 0.8]
    complexity: { low: number, high: number };   // e.g., [0.2, 0.7]
  };
  
  // Deadband control
  deadband: {
    range: [number, number];   // Where to operate autonomously
    teacherEndpoint?: string;  // Call when outside deadband
  };
  
  // Auto-equipment
  recommendations: EquipmentRecommendation[];
}
```

## Self-Equipping Logic

### Equipping Process

```
┌──────────────────┐
│   Task Arrives   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐     ┌──────────────────┐
│ Analyze Task     │────▶│ Check Current    │
│ Requirements     │     │ Equipment        │
└────────┬─────────┘     └────────┬─────────┘
         │                        │
         ▼                        ▼
┌──────────────────┐     ┌──────────────────┐
│ Identify Missing │────▶│ Check Available  │
│ Capabilities     │     │ Equipment        │
└────────┬─────────┘     └────────┬─────────┘
         │                        │
         └────────────┬───────────┘
                      │
                      ▼
              ┌───────────────┐
              │ Equip Needed  │
              │ Equipment     │
              └───────┬───────┘
                      │
                      ▼
              ┌───────────────┐
              │ Register      │
              │ Triggers      │
              └───────────────┘
```

### Unequipping Process

When an agent "matures into its cell":

```
┌──────────────────┐
│ Performance      │
│ Monitoring       │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ Is equipment still providing value?  │
│ (cost < benefit over recent tasks)   │
└────────┬─────────────────────────────┘
         │
    ┌────┴────┐
    │         │
   YES        NO
    │         │
    ▼         ▼
┌───────┐  ┌───────────────────┐
│ Keep  │  │ Extract Triggers  │
│       │  │ (muscle memory)   │
└───────┘  └────────┬──────────┘
                    │
                    ▼
           ┌───────────────────┐
           │ Unequip Equipment │
           │ (streamline)      │
           └────────┬──────────┘
                    │
                    ▼
           ┌───────────────────┐
           │ Triggers call     │
           │ teacher when      │
           │ outside deadband  │
           └───────────────────┘
```

## Equipment from SuperInstance Repos

### Core Equipment (Always Available)

| Equipment | Source Repo | Slot | Description |
|-----------|-------------|------|-------------|
| HierarchicalMemory | hierarchical-memory | MEMORY | 4-tier cognitive memory |
| EscalationEngine | escalation-engine | REASONING | 40x cost reduction routing |
| TripartiteConsensus | tripartite-rs | CONSENSUS | 3-agent deliberation |
| POLLNInterface | POLLN | SPREADSHEET | Tile visualization |

### Optional Equipment (Equippable)

| Equipment | Source Repo | Slot | When to Equip |
|-----------|-------------|------|---------------|
| Claude_Baton | Claude_Baton | MEMORY | Long-running tasks |
| Mycelium | Mycelium | REASONING | Behavior capture |
| SwarmOrchestration | agent-coordinator | CONSENSUS | Multi-agent tasks |
| ModelDistiller | training-data-collector | DISTILLATION | Model compression |

## Confidence Zones

Following Tile Algebra formalization:

```
           GREEN ZONE (0.9 - 1.0)
           │    High confidence
           │    Auto-process
           │    No escalation
           │
           ├───────────────────────
           │
           YELLOW ZONE (0.6 - 0.9)
           │    Medium confidence  
           │    Flag for review
           │    Consider equipping
           │
           ├───────────────────────
           │
           RED ZONE (0.0 - 0.6)
           │    Low confidence
           │    Request input
           │    Call teacher
           │    Equip new equipment
           │
           ▼
```

## Spreadsheet Integration

The agent operates within the SuperInstance spreadsheet paradigm:

### Cell Decomposition

Each "cell" the agent occupies decomposes into tiles:

```
┌─────────────────────────────────────────────────────────┐
│                    AGENT CELL                           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ DATA ORIGIN  │  │   DECISION   │  │TRANSFORMATION│  │
│  │     TILE     │  │   LOGIC TILE │  │     TILE     │  │
│  │              │  │              │  │              │  │
│  │ Who created  │  │ What rules   │  │ How changed  │  │
│  │ this data    │  │ apply        │  │              │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                         │
│  ┌──────────────┐  ┌──────────────────────────────────┐│
│  │ CONFIDENCE   │  │      NAMED INTERFACE TILE        ││
│  │    TILE      │  │                                  ││
│  │              │  │  Why I exist / What I provide    ││
│  │ How sure     │  │                                  ││
│  └──────────────┘  └──────────────────────────────────┘│
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Named Tiles for Agent Operations

| Tile Name | Purpose | Confidence Impact |
|-----------|---------|-------------------|
| `process_input` | Standard input processing | +0.1 |
| `make_decision` | Route through reasoning | +0.2 |
| `seek_consensus` | Multi-agent agreement | +0.3 |
| `distill_knowledge` | Compress to triggers | -0.1 (complex) |
| `call_teacher` | Escalate beyond deadband | -0.2 (learning) |

## Performance Metrics

| Metric | Without Equipment | With Core Equipment | Fully Equipped |
|--------|-------------------|---------------------|-----------------|
| Latency | Variable | Predictable | Optimized |
| Cost | High (API calls) | 40x lower | Minimal |
| Accuracy | Baseline | +15% | +30% |
| Memory | 0 | 20 items working | Unlimited |
| Confidence | Untracked | Tracked | Propagated |

## Getting Started

```typescript
import { SuperInstanceAgent } from '@superinstance/starter-agent';

// Create minimal agent
const agent = new SuperInstanceAgent({
  id: 'my-agent',
  origin: {
    referenceFrame: 'local',
    initialState: {}
  }
});

// Agent self-equips based on task
await agent.processTask({
  type: 'decision',
  query: 'Should I approve this request?',
  stakes: 0.8,
  urgencyMs: 5000
});

// Check what equipment was used
console.log(agent.getEquippedEquipment());
// [{ slot: 'REASONING', name: 'EscalationEngine' },
//  { slot: 'CONSENSUS', name: 'TripartiteConsensus' }]

// Agent can unequip when streamlined
await agent.optimize();
```

