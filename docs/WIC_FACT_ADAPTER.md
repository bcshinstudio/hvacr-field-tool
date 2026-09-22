# WIC Fact Adapter

## Purpose
`src/knowledge/wic_fact_adapter.js` is the boundary between the current Walk-In Cooler UI/data model and the Knowledge Hub.

It does not diagnose faults. It translates known app information into stable `FACT_*` IDs.

## Rule
The adapter may translate:
- direct observations,
- calculations against explicit application/manufacturer references,
- semantic states already established by another calculation/control module.

The adapter must NOT invent universal thresholds.

Example:
- `evaporatorSuperheat = 18°F` alone -> no HIGH_SH fact.
- `evaporatorSuperheat = 18°F` plus explicit target 8–12°F -> `FACT_EVAP_SH_HIGH`.

## Why separate this module
UI field names can change without rewriting diagnostic knowledge.
Knowledge IDs can remain stable across WIC, freezer, reach-in and later systems.

## Current first-step coverage
Direct mapping exists for:
- condenser airflow/coil/fan/recirculation,
- evaporator airflow/coil icing/dirty coil/fan,
- sight-glass flashing and moisture,
- solenoid operation,
- TXV hunting/bulb/equalizer observations,
- oil/leak evidence,
- reference-based evaporator/condensing SAT,
- reference-based SH/SC,
- caller-established semantic states such as drier drop, load, defrost, controls and compressor performance.

## Not integrated yet
The live `buildSystemCheckTool()` still uses `diagnostic_engine.js`.
That is intentional for this checkpoint.

Next integration step:
1. build a snapshot from the existing measurement/observation Maps,
2. call `buildWicKnowledgeFacts(snapshot)`,
3. feed returned facts into Knowledge Engine v0.7.1,
4. render technician-facing diagnosis / next check,
5. retain old System Check temporarily for A/B regression comparison.
