# Knowledge Hub Test Policy

## Permanent files
- `tests/knowledge_test.html` — permanent browser runner
- `tests/knowledge_cases.json` — permanent semantic regression cases

Do not create `knowledge_test_v0x.html` or `knowledge_cases_v0x.json` for normal development.

## What stays forever
A case stays when it represents:
- a real HVAC/R diagnostic distinction,
- a bug that was found and fixed,
- missing-data behavior,
- contradictory evidence,
- simultaneous faults,
- a safety/robustness invariant.

## What is generated automatically
The runner creates robustness permutations for every core case:
1. evidence-order invariance,
2. duplicate-evidence idempotence,
3. unrelated/unknown evidence isolation.

It also runs every known evidence fact by itself to catch crashes and duplicate-counting regressions.

This lets the suite grow substantially without hand-authoring every permutation.

## Versioning
Version the reasoning engine and the suite metadata, not the filenames.
Knowledge data has its own independent version.

## Gate before live System Check integration
Do not integrate a new reasoning engine into live System Check unless:
1. knowledge integrity passes,
2. all core semantic cases pass,
3. all generated robustness tests pass,
4. diagnostic output is manually reviewed for misleading "possible" causes and next checks,
5. new HVAC knowledge is source-backed and provenance is retained.

## v0.7 presentation hierarchy and next-check gate
The suite now separately validates:
- raw supported candidates,
- presentation-level diagnoses after parent/child collapse,
- the selected next check where the expected check is known.

A parent diagnostic category may remain internally supported while a more specific
supported child replaces it in technician-facing output.
