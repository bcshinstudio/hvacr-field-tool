## Reach-in refrigeration foundation (development candidate, not yet tagged)

Added Reach-In Refrigerator (R-134a / capillary tube) and Reach-In Freezer
(R-404A / capillary tube) selectable equipment profiles. Both reuse the
shared DX measurement, component, and diagnostic engine. Their default
configuration contains a compressor, air-cooled condenser, filter-drier,
capillary tube, and evaporator. These are **typical textbook configurations**;
real equipment may differ and manufacturer service data takes precedence.

The selected reach-in profile chooses its textbook refrigerant by default,
without preventing a technician from selecting a different refrigerant.

**Important limitation:** This milestone adds the system models and shared
measurement/diagnostic path; it does NOT yet establish Chapter 7 fault-answer
accuracy or provide validated reach-in-specific diagnostic evidence rules.
No universal charging targets or TEV superheat fallback are applied to the
capillary-tube profiles. Chapter 7 comparison and root-cause corrections are
subsequent milestones, not claimed as completed here.

Run: `node tests/reach_in_profiles.mjs`

# HVAC/R Field Tool

## v2.1.1 — Residential A/C deep validation

Residential Split A/C and Package A/C now execute against their real application scopes (`APP_AC_SPLIT` / `APP_AC_PACKAGE`) rather than the WIC application context. Shared DX rules are explicitly reusable across supported systems, while WIC-only rules remain scoped to WIC.

Deep Residential A/C validation adds 80 split/package diagnostic cases covering line/control power, transformer/thermostat, contactor, capacitor, compressor windings/ground faults, fan/blower electrical faults, airflow restrictions, condenser heat rejection, TXV and fixed-orifice feed/charging logic, compressor pumping, multi-fault cases, transient-state gating, and false-positive resistance. The initial deep suite exposed 4 failures (fixed-orifice charge interpretation and TXV low-subcooling overreach); generalized rule changes corrected them to 80/80.

Validation checkpoint: Residential A/C master 40/40; deep diagnostic 80/80; A/C fact bridge 12/12; A/C UI/bridge 10/10; existing A/C UI 9/9; WIC regression 340/340; textbook source oracle 20/20 with 6/6 currently executable.

Research basis includes Carrier and Trane troubleshooting guidance, HVAC School residential electrical/compressor diagnostic material, and metering-device-specific charging guidance (TXV by applicable subcooling target; fixed-orifice by target superheat under appropriate conditions). General values are not treated as manufacturer setpoints.

Run the new suite with:
`node tests/residential_ac_deep/residential_ac_deep_runner.mjs`

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

## v2.1.0 Residential A/C implementation candidate

Residential A/C now includes Split and Package A/C system profiles, reuse of the validated DX refrigeration/electrical evidence model, A/C electrical/control collection (including 24-V transformer evidence), shared System Check reasoning, and protected WIC regression behavior. A/C does not inherit the WIC 8–12°F superheat fallback; equipment/manufacturer charging targets remain authoritative.

Validation commands:

    node tests\residential_ac\residential_ac_master_runner.mjs
    node tests\residential_ac\residential_ac_ui_acceptance.mjs
    node tests\textbook_volume1\textbook_volume1_runner.mjs
    node tests\master_validation\master_brain_runner.mjs
    node tests\challenge_validation\challenge_brain_runner.mjs
    node tests\challenge_validation_2\challenge_2_brain_runner.mjs
    node tests\challenge_validation_3\challenge_3_brain_runner.mjs
    node tests\challenge_validation_4\challenge_4_brain_runner.mjs

The 20-case textbook oracle remains a source bank. Cases requiring heat-pump, furnace, electric-heat, ice-machine, or still-unmodeled UI evidence remain explicitly future_system/future_ui rather than being counted as diagnostic passes.


### Chapter 7 validation (integration checkpoint)

The 15 Dick Wirz Chapter 7 exercises are an external challenge set, not an official answer key.
Walk-in freezer `APP_WIF` reuses existing refrigeration rules; no case-specific
fault rules were added. The final comparison runner verifies 15/15 processing,
9 safety/coverage assertions, including 7-9 compressor-efficiency ranking,
7-4/7-11 uncertainty preservation, and 7-15 no unsupported faults.
Run `node tests/chapter7/chapter7_runner.mjs` and
`node tools/knowledge_coverage.mjs` before release. Independent root-cause
verification and manufacturer-specific PT acceptance remain outstanding.

## Chapter 7 service-problem integration (experimental validation)

Run `node tests/chapter7/chapter7_runner.mjs` to evaluate the 15 textbook service
problems against the production fact adapter and hypothesis engine. Inputs are
transcribed in `tests/chapter7/inputs.json`; results are written to
`tests/chapter7/chapter7_results.json`. The PT conversions are approximate
classroom estimates, **not** an official answer key or verified refrigerant
property table. The runner explicitly supplies exercise operating assumptions
and reference ranges; field use requires verified operating state, pressure
locations, PT data and manufacturer-specific references. The 7-6 drier
measurements require confirmation of probe locations. The 50°F low-ambient
cutoff is an illustrative runner input, not a universal HVAC threshold.

Safety assertions include no confirmed diagnoses in ambiguous 7-4 and 7-11,
compressor inefficiency ranking first in 7-9 without being confirmed,
low-ambient/head-control coverage (7-14), and no unsupported hypotheses in 7-15.
Passing the suite verifies engine behavior under these assumptions; it does
not establish that all 15 root causes are known or proven. Do not use these
outputs as field repair authorization.
