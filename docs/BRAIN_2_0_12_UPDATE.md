# Brain 2.0.12 — Challenge #2 Generalization Update

## Purpose
Resolve the 16 failures found by the frozen Brain 2.0.11 first run against Challenge Validation #2 without weakening the locked expected answers.

## Generalized improvements
- Configuration-aware subcooling: a non-applicable generic SC reference can no longer directly establish low charge.
- Manufacturer/model-specific target precedence over generic charging references.
- Warm-room reasoning when suction/head are normal: airflow, load/infiltration, sensing/control and capacity are checked before refrigerant adjustment.
- Low-suction + verified low-load differentiation from starvation/low charge.
- High compressor current with normal head: electrical/mechanical isolation path.
- Startup, satisfied/off and post-defrost transient measurement guidance.
- Anti-short-cycle delay prioritized as intentional protection when active.
- Preservation of simultaneous drier restriction + TXV bulb faults.
- Sensor-error + normal refrigeration prioritizes sensing/control.
- Verified load-over-capacity can directly support undersizing/capacity diagnosis.
- Moisture indication now distinguishes contamination from proven active TXV icing; high SH plus wet indication can support moisture-related feed restriction.
- Uneven evaporator feed with proper inlet liquid directs distributor/nozzle/circuit/TXV localization.
- Hot compressor with non-excessive head directs voltage/current, compression ratio, return-gas and overload-history checks.

## Test-harness integrity
Challenge runners now enforce common negative diagnostic assertions against supported diagnoses instead of only validating positive headline/finding/next-action intent. Action prohibitions are not incorrectly treated as diagnosis prohibitions.

## Validation
- Master: 80/80 PASS
- Challenge #1: 50/50 PASS
- Challenge #2: 60/60 PASS
- All Node `.mjs` suites: PASS
