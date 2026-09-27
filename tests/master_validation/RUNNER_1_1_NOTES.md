# Master Brain Runner 1.1

Calibration update after the first 30/80 run.

- Makes formerly abstract operating-state cases executable with concrete semantic evidence.
- Makes WIC-E080 a concrete unknown-state + evaporator-fan-fault case.
- Expands Next Action matching to the same check labels, field-guidance relationship/steps/record locations, and diagnosis corrective actions used by System Check.
- Separates runner mapping failures from Brain/presentation failures.
- Writes detailed evidence, state, diagnoses, conditions, next check, and active guides to `master_brain_report.json`.

The master expected HVAC result remains the authority. A FAIL is not converted to PASS merely because the current Brain produces a different result.
