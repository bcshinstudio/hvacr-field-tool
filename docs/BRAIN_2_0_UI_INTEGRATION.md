# Brain 2.0 UI Integration — Zeta

This checkpoint connects the validated semantic Brain to technician-entered case context.

Implemented:
- Operating-state selector in System Check: stable cooling, pull-down, satisfied, pump-down, defrost, post-defrost/fan delay, startup, off, unknown.
- Pressure-evidence quality selectors so suspect/invalid readings can reduce pressure-derived diagnostic confidence.
- Room/control evidence inputs for infiltration, warm product load, sensor disagreement, cooling demand, anti-short-cycle delay, wiring/control scheme, HP/LP control state, contactor coil/output, fuse state, and liquid-solenoid command/flow.
- Compressor temperature/protection observations in component data.
- State and evidence quality are passed through the real app snapshot -> WIC fact adapter -> hypothesis engine path.
- Technician-facing state-gate and questionable-measurement messages.
- Eleven UI-shaped end-to-end assertions in addition to the 88 independent semantic scenarios.

Manufacturer basis remains the Phase 1-5 source set. Danfoss cold-room guidance supports state/control/load/airflow/defrost branches; Parker/Sporlan troubleshooting supports sensor, pressure-transducer, liquid-condition, charge, valve and filter checks before component replacement.
