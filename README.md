## Brain 2.0.14 validation checkpoint

Brain 2.0.14 addresses the 25 independent Challenge #4 failures through generalized diagnostic reasoning and field guidance rather than case-ID-specific rules. The update strengthens direct-fault preservation across transient/unknown states, pump-down interpretation, contactor load-side localization, compressor thermal/current guidance, conflicting measurement handling, confirmed-leak workflow, control/sensor prioritization, and multi-fault presentation.

Validation: Master 80/80, Challenge #1 50/50, Challenge #2 60/60, Challenge #3 70/70, Challenge #4 80/80 = 340/340. All Node `.mjs` suites pass.


## Brain 2.0.12 validation checkpoint

Brain 2.0.12 addresses the 16 independent Challenge #2 failures with reusable diagnostic guidance for configuration-aware subcooling, model-specific targets, load/capacity separation, transient operating states, compressor current/temperature isolation, multi-fault preservation, moisture contamination, and evaporator distribution. It also tightens challenge-runner negative diagnostic assertions.

Validation: Master 80/80, Challenge #1 50/50, Challenge #2 60/60. All Node `.mjs` test suites pass.

# HVAC/R Field Tool

Current knowledge release: Brain 2.0.14 — Challenge #4 Generalization.

Run locally with a simple web server, for example `python -m http.server 8000`, then open `http://localhost:8000`.

Technical release notes are under `docs/`.

## Brain 2.0.11 validation checkpoint
- Master validation: 80/80 PASS
- Challenge Validation v1: 50/50 PASS
- See `docs/BRAIN_2_0_11_UPDATE.md`.


## v2.0.18 — Electrical Brain Integration

- Added `Not Running`, `Attempts To Start`, and `Cycles On Overload` to condenser/evaporator fan operating-state inputs.
- Bridged condenser and evaporator fan Electrical-tab operating states into WIC diagnostic facts.
- Fixed compressor `not_running` state preservation in the WIC fact adapter.
- Bridged contactor L1-T1 / L2-T2 voltage-drop evidence into the contactor power-path diagnosis.
- System Check now prioritizes an energized contactor that is not passing line voltage ahead of downstream compressor/fan conclusions, even when the manual refrigeration operating-state selector is still Unknown.
- Added automated electrical service-call regression tests under `tests/electrical_service_calls/`.
- Project-root documentation policy: maintain this single `README.md`; do not create version-specific README/install files.

### v2.0.18 validation

- Existing WIC diagnostic suites: 340/340 passing.
- Electrical service-call semantic tests: 5/5 passing.
- Electrical UI bridge acceptance: 6/6 passing.
- Existing Electrical/Workspace UI acceptance remains passing.

## v2.0.19 — Textbook electrical service-call batch validation

- Added upstream main-power evidence to the WIC electrical Brain bridge.
- Added direct System Check handling for missing condensing-unit line power.
- Added condenser-fan Slow state, blade/shaft condition, and C-R/C-S/R-S winding inputs.
- Added interpretation for a normal single-phase fan winding relationship and an open compressor start-winding pattern.
- Added all four supplied Practice Service Calls as a permanent automated regression suite under `tests/electrical_service_calls/`.
- Preserved all 340 existing WIC master/challenge validation cases.
- Documentation policy: keep this single `README.md`; do not create per-version README/INSTALL files.

Run the new batch with:
`node tests\\electrical_service_calls\\textbook_service_call_runner.mjs`

## v2.0.20 — Full textbook service-call source bank

Added `tests/textbook_volume1/` covering all 20 cases in the user-supplied *20 HVACR Troubleshooting Problems, Volume 1* PDF. The suite keeps source expected answers separate from current executable coverage so unsupported equipment/UI evidence is not fabricated. Current structured Brain inputs can execute 6 of the 20 cases directly; the remaining 14 are explicitly classified as `future_ui` or `future_system` for later system expansion.

Run: `node tests/textbook_volume1/textbook_volume1_runner.mjs`
