# CONSTRUCT-MIGRATION: Equipment-CellLogic-Distiller

**Date:** 2026-06-04 · **Source:** TypeScript → Rust

This document shows how to port the CellLogicDistiller Equipment to a Rust skill compatible with construct-core and ternary-registry.

---

## Source Overview

The CellLogicDistiller is a `DISTILLATION`-slot Equipment that:
- Takes LLM prompts/responses and decomposes them into structured **LogicTiles**
- Each LogicTile has: `dataOrigin`, `decisionLogic`, `transformation`, `confidence`, `namedInterface`
- Exports to spreadsheet-compatible formats (CSV, JSON, HTML)
- Can reverse-engineer tiles back into natural language explanations

```typescript
class CellLogicDistiller implements Equipment {
  readonly name = 'CellLogicDistiller';
  readonly slot: EquipmentSlot = 'DISTILLATION';
  readonly version = '1.0.0';
  readonly cost: CostMetrics = { memoryBytes: 50_000_000, cpuPercent: 15, latencyMs: 500, costPerUse: 0.001 };
}
```

---

## Rust Skill Definition

### ternary-registry Registration

```rust
use ternary_registry::*;

fn cell_logic_distiller_skill() -> Skill {
    Skill::new(
        SkillId::new("superinstance", "CellLogicDistiller", SemVersion::new(1, 0, 0)),
        SkillTier::Standard,
        "Breaks down LLM logic into spreadsheet-visualized cells with tile decomposition",
    )
    .with_capability("logic_distillation")
    .with_capability("spreadsheet_generation")
    .with_capability("tile_decomposition")
    .with_capability("reverse_engineering")
    .with_capability("nlp_documentation")
    .with_capability("read")
    .with_capability("query")
    .with_capability("write")
    .with_capability("compute")
}
```

### Core Rust Types

```rust
use std::collections::HashMap;

/// A decomposed logic tile with full metadata.
#[derive(Debug, Clone)]
pub struct LogicTile {
    pub id: String,
    pub name: String,
    pub data_origin: DataOrigin,
    pub decision_logic: DecisionLogic,
    pub transformation: TransformationInfo,
    pub confidence: f32,
    pub named_interface: NamedInterface,
    pub nlp_description: String,
    pub source_segment: String,
    pub source_position: (usize, usize),
    pub dependencies: Vec<String>,
}

#[derive(Debug, Clone)]
pub struct DataOrigin {
    pub origin_type: DataOriginType,
    pub source_id: String,
    pub timestamp: u64,
    pub description: String,
}

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum DataOriginType {
    Prompt,
    Response,
    Reasoning,
    ToolOutput,
    External,
    Derived,
}

#[derive(Debug, Clone)]
pub struct DecisionLogic {
    pub logic_type: LogicType,
    pub conditions: Vec<LogicCondition>,
    pub rule: String,
    pub formal_rule: Option<String>,
    pub extraction_confidence: f32,
}

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum LogicType {
    Conditional,
    Selection,
    Ranking,
    Filtering,
    Aggregation,
    Generation,
    Verification,
}

#[derive(Debug, Clone)]
pub struct LogicCondition {
    pub id: String,
    pub left: String,
    pub operator: LogicOperator,
    pub right: String,
    pub negated: bool,
    pub description: String,
}

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum LogicOperator {
    Eq, Neq, Lt, Gt, Lte, Gte,
    Contains, StartsWith, EndsWith, Matches,
    In, NotIn, Exists, NotExists,
}

#[derive(Debug, Clone)]
pub struct TransformationInfo {
    pub transform_type: TransformType,
    pub description: String,
    pub signature: String,
}

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum TransformType {
    Map, Filter, Reduce, Transform, Compose, Split, Merge, Extract,
}

#[derive(Debug, Clone)]
pub struct NamedInterface {
    pub name: String,
    pub parameters: Vec<InterfaceParameter>,
    pub return_type: String,
    pub documentation: String,
}

#[derive(Debug, Clone)]
pub struct InterfaceParameter {
    pub name: String,
    pub param_type: String,
    pub optional: bool,
    pub description: String,
}
```

### Core Implementation

```rust
/// CellLogicDistiller — decomposes LLM logic into structured tiles.
pub struct CellLogicDistiller {
    decomposer: TileDecomposer,
    visualizer: SpreadsheetVisualizer,
    tile_cache: HashMap<String, LogicTile>,
    last_result: Option<DecompositionResult>,
}

#[derive(Debug, Clone)]
pub struct DecompositionResult {
    pub tiles: Vec<LogicTile>,
    pub spreadsheet: LogicSpreadsheet,
    pub statistics: DecompositionStatistics,
    pub warnings: Vec<String>,
    pub timestamp: u64,
}

#[derive(Debug, Clone)]
pub struct DecompositionStatistics {
    pub total_characters: usize,
    pub segment_count: usize,
    pub condition_count: usize,
    pub transformation_count: usize,
    pub average_confidence: f32,
    pub processing_time_ms: u64,
}

#[derive(Debug, Clone)]
pub struct DistillationInput {
    pub prompt: String,
    pub response: String,
    pub context: Option<HashMap<String, String>>,
    pub source_id: Option<String>,
}

impl CellLogicDistiller {
    pub fn new() -> Self {
        Self {
            decomposer: TileDecomposer::new(),
            visualizer: SpreadsheetVisualizer::new(),
            tile_cache: HashMap::new(),
            last_result: None,
        }
    }

    /// Distill LLM logic into tiles and spreadsheet.
    pub fn distill(&mut self, input: &DistillationInput) -> DecompositionResult {
        let tiles = self.decomposer.decompose(input);

        // Cache tiles
        for tile in &tiles {
            self.tile_cache.insert(tile.id.clone(), tile.clone());
        }

        let spreadsheet = self.visualizer.visualize(&tiles, &input.prompt, &input.response);

        let result = DecompositionResult {
            tiles,
            spreadsheet,
            statistics: self.decomposer.statistics(),
            warnings: Vec::new(),
            timestamp: current_timestamp_ms(),
        };

        self.last_result = Some(result.clone());
        result
    }

    /// Get a cached tile by ID.
    pub fn get_tile(&self, tile_id: &str) -> Option<&LogicTile> {
        self.tile_cache.get(tile_id)
    }

    /// Export spreadsheet to CSV.
    pub fn export_csv(&self, spreadsheet: &LogicSpreadsheet) -> String {
        self.visualizer.to_csv(spreadsheet)
    }

    /// Export spreadsheet to JSON.
    pub fn export_json(&self, spreadsheet: &LogicSpreadsheet) -> String {
        self.visualizer.to_json(spreadsheet)
    }
}
```

### Spreadsheet Visualization

```rust
#[derive(Debug, Clone)]
pub struct LogicSpreadsheet {
    pub id: String,
    pub name: String,
    pub cells: HashMap<String, SpreadsheetCell>,
    pub dimensions: (usize, usize),
    pub column_headers: Vec<String>,
    pub row_headers: Vec<String>,
}

#[derive(Debug, Clone)]
pub struct SpreadsheetCell {
    pub id: String,
    pub row: usize,
    pub column: usize,
    pub value: String,
    pub formula: Option<String>,
    pub tile_id: String,
    pub cell_type: CellType,
    pub confidence: f32,
    pub depends_on: Vec<String>,
}

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum CellType {
    Input, Output, Logic, Transformation, Decision, Reference, Constant, Formula, Metadata,
}

pub struct SpreadsheetVisualizer;

impl SpreadsheetVisualizer {
    pub fn new() -> Self { Self }

    pub fn visualize(
        &self,
        tiles: &[LogicTile],
        _source_prompt: &str,
        _source_response: &str,
    ) -> LogicSpreadsheet {
        let mut cells = HashMap::new();
        let mut headers = vec![
            "Data Origin".into(),
            "Decision Logic".into(),
            "Transformation".into(),
            "Confidence".into(),
            "Interface".into(),
        ];

        for (row, tile) in tiles.iter().enumerate() {
            // One row per tile, columns for each metadata field
            let add_cell = |col: usize, ct: CellType, val: &str| -> SpreadsheetCell {
                SpreadsheetCell {
                    id: format!("{}{}", (b'A' + col as u8) as char, row + 1),
                    row, column: col,
                    value: val.to_string(),
                    formula: None,
                    tile_id: tile.id.clone(),
                    cell_type: ct,
                    confidence: tile.confidence,
                    depends_on: tile.dependencies.clone(),
                }
            };

            cells.insert(format!("A{}", row + 1), add_cell(0, CellType::Input, &tile.data_origin.description));
            cells.insert(format!("B{}", row + 1), add_cell(1, CellType::Logic, &tile.decision_logic.rule));
            cells.insert(format!("C{}", row + 1), add_cell(2, CellType::Transformation, &tile.transformation.description));
            cells.insert(format!("D{}", row + 1), add_cell(3, CellType::Metadata, &format!("{:.2}", tile.confidence)));
            cells.insert(format!("E{}", row + 1), add_cell(4, CellType::Reference, &tile.named_interface.name));
        }

        LogicSpreadsheet {
            id: format!("ss_{}", current_timestamp_ms()),
            name: "Logic Decomposition".into(),
            cells,
            dimensions: (tiles.len(), 5),
            column_headers: headers,
            row_headers: tiles.iter().map(|t| t.name.clone()).collect(),
        }
    }

    pub fn to_csv(&self, spreadsheet: &LogicSpreadsheet) -> String {
        let mut csv = spreadsheet.column_headers.join(",") + "\n";
        for row in 0..spreadsheet.dimensions.0 {
            let cells: Vec<String> = (0..spreadsheet.dimensions.1)
                .map(|col| {
                    let cell_id = format!("{}{}", (b'A' + col as u8) as char, row + 1);
                    spreadsheet.cells.get(&cell_id)
                        .map(|c| c.value.clone())
                        .unwrap_or_default()
                })
                .collect();
            csv += &cells.join(",");
            csv += "\n";
        }
        csv
    }

    pub fn to_json(&self, spreadsheet: &LogicSpreadsheet) -> String {
        serde_json::to_string_pretty(spreadsheet).unwrap_or_default()
    }
}
```

---

## construct-core Integration

### Layer: L1 (SyncConstruct)

The distiller needs heap (50MB memory, `HashMap` cache) but is synchronous — no async I/O. Maps to `SyncConstruct`:

```rust
impl CellLogicDistiller {
    /// Called via SyncConstruct::load_skill()
    pub fn on_load(&mut self) {
        self.tile_cache.clear();
        self.last_result = None;
    }

    /// Called via SyncConstruct::unload_skill()
    pub fn on_unload(&mut self) {
        self.tile_cache.clear();
        self.last_result = None;
    }

    /// Called via SyncConstruct::query_owned()
    pub fn on_query(&mut self, query: &OwnedQuery) -> Result<OwnedResponse, ConstructError> {
        // Deserialize DistillationInput from payload
        let input: DistillationInput = serde_json::from_slice(&query.payload)
            .map_err(|_| ConstructError::InvalidQuery)?;

        let result = self.distill(&input);

        let response_payload = serde_json::to_vec(&result)
            .map_err(|_| ConstructError::NotAvailable)?;

        Ok(OwnedResponse::new(
            TritAction::Choose,
            result.statistics.average_confidence,
            response_payload,
        ))
    }
}
```

---

## Dependencies

```toml
[package]
name = "equipment-cell-logic-distiller"
version = "0.1.0"
edition = "2021"

[dependencies]
construct-core = { path = "../construct-core", features = ["alloc"] }
ternary-registry = { path = "../ternary-registry" }
serde = { version = "1", features = ["derive"] }
serde_json = "1"
```

---

## WASM Bridge Alternative

For environments where the TypeScript implementation should be kept (e.g., complex LLM interaction patterns that are hard to replicate in Rust), use the WASM bridge:

1. Wrap `CellLogicDistiller` in the canonical WASM ABI (see EQUIPMENT-CONSTRUCT-BRIDGE.md §5)
2. Export `getManifest()`, `equip()`, `unequip()`, `compute()`
3. Compile with AssemblyScript: `asc src/wasm-wrapper.ts --outFile distiller.wasm`
4. Load in Rust via `WasmSkill::load(wasm_bytes)`

The TypeScript distillation logic stays in TypeScript; Rust just provides the `SyncConstruct` interface shell.

---

## Key Differences from TypeScript

| Aspect | TypeScript | Rust |
|---|---|---|
| Memory management | GC | Manual (clear cache on unload) |
| Type safety | Runtime (interface) | Compile-time (struct + enum) |
| Tile caching | `Map<string, LogicTile>` | `HashMap<String, LogicTile>` |
| Serialization | JSON.stringify | serde_json |
| Async | Not needed (sync distillation) | Not needed (L1/SyncConstruct) |
| Error handling | null returns | Result types |
