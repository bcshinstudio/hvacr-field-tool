# Brain 2.0.10 — Pattern Reasoning & State-Aware System Check

This release was driven by the independent 80-case WIC master validation suite.

## Main changes
- Expanded reusable field-guidance paths for pressure/SH/SC combinations rather than one-off case patches.
- Added state-specific System Check language for Defrost, Startup, Satisfied/Off, Post-defrost, and Pump-down.
- Expanded confirmed-finding preservation for suction/head pressure, subcooling, load, infiltration, sensor, demand, and runtime evidence.
- Added multi-fault guidance for condenser fan + high head, iced evaporator + dirty condenser, no-demand + dirty condenser, multiple TXV input faults, iced coil + low suction, solenoid + low suction, and high-load + low-compression patterns.
- Corrected master-runner semantic mappings and replaced unreliable prose-similarity negative assertions with diagnosis-ID checks.

## Validation
- WIC master validation: 80/80 PASS with runner v1.2.1.
- The expected 80-case HVAC answer key was not changed for this release.
- Legacy regression suites were rerun; one obsolete wording assertion was updated to the new state-specific Defrost headline.
