# WIC Master Diagnostic Validation

This folder is the single-source validation specification for manual and automated testing.

- `wic_master_diagnostic_cases.json` — machine-readable answer key.
- `wic_master_diagnostic_cases.schema.json` — schema contract.
- `WIC_MASTER_DIAGNOSTIC_MANUAL.md` — human-readable manual test instructions generated from the same cases.
- `wic_master_coverage.csv` — coverage summary.
- `validate_master_case_contract.mjs` — structural test.

Automation should compare structured concepts/IDs rather than exact prose. Exact UI prose may evolve, but diagnostic conclusion, confirmed evidence, next-action intent, active-fault preservation and MUST-NOT conclusions are normative.

## Brain runner
Run `node tests\\master_validation\\master_brain_runner.mjs` from the project root.
It executes all 80 master setups through the WIC fact adapter and hypothesis engine and writes `master_brain_report.json`.
The runner deliberately uses semantic intent checks rather than exact paragraph equality. A FAIL is a review target, not permission to change the answer key; inspect whether the Brain, presentation layer, or automation mapping is responsible.
