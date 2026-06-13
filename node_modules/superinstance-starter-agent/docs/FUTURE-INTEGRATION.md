# Future Integration: SuperInstance-Starter-Agent

## Current State
A minimal agent framework built on Origin-Centric Data Systems and Tile Algebra. Agents start minimal and self-equip capabilities via a modular equipment system. Features origin-centric computation with full provenance tracking, dynamic equip/unequip, and self-optimization through "muscle memory" triggers.

## Integration Opportunities

### With construct-core
The Starter Agent IS the prototype for construct-core's layered trait system. Its equip/unequip mechanism maps directly to `SyncConstruct::load_skill()` / `unload_skill()`. The origin-centric provenance maps to construct-core's capability introspection. The upgrade path: refactor the TypeScript equip system into Rust `SkillSpec` structs, maintaining the same self-equipping philosophy but targeting construct-core's three hardware tiers. The Starter becomes the **agent bootstrap template** — fork it, equip what you need, compile for your tier.

### With agent-template
The Starter Agent's philosophy (start minimal, self-equip) should become the default agent-template pattern. Instead of agents shipping with all skills pre-loaded, they boot with BareMetalConstruct capabilities and dynamically load SyncConstruct/AsyncConstruct skills as the room demands. The template becomes: "fork this, deploy to any tier, equip from the room."

### With room-as-codespace
When a new Codespace spins up for a room, it uses the Starter Agent pattern: boot minimal, query the room registry for required skills, load them, begin ticking. When the Codespace suspends, skills are unloaded gracefully. This is exactly how the Starter Agent's equip lifecycle works.

## Dormant Ideas Now Unlockable
The "muscle memory" self-optimization was blocked because there was no runtime target for the optimized code. Now agentic-compiler provides JIT compilation to Numba/Rust/CUDA, and construct-core provides the layered trait system as the deployment target. The full loop: Starter Agent profiles its own skill usage → agentic-compiler hot-swaps slow skills → construct-core installs the optimized version at the appropriate tier.

## Potential in Mature Systems
Every ensign in every room is a Starter Agent instance — booted minimal, equipped with room-specific skills, ticking the ternary-cell cycle, self-optimizing over time. The Starter is the DNA of the fleet.

## Cross-Pollination Ideas
- **agentic-compiler**: Muscle memory triggers the compiler, which produces optimized skills
- **Equipment-CellLogic-Distiller**: Audits which equipment the agent actually uses vs carries
- **polyformalism-turbo-shell**: The creative cognition engine becomes an equippable skill

## Dependencies for Next Steps
- TypeScript → Rust bridge for equip/unequip → load_skill/unload_skill
- construct-core SkillSpec format alignment
- Room registry API for skill discovery on boot
