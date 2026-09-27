# Brain 2.0.11 — Challenge Generalization Update

## Purpose
Brain 2.0.11 addresses diagnostic families exposed by the independent 50-case Challenge Validation v1 while preserving the original 80-case Master Validation suite.

## Generalized additions
- compressor weak-pumping / internal leakage field paths
- startup migration/floodback context and post-defrost liquid-return handling
- high discharge temperature and high-current/high-head compressor protection paths
- high-head discrimination after condenser airflow is verified
- direct noncondensable and overcharge evidence paths
- TXV underfeed after liquid supply is verified, no-response behavior, application mismatch, and EEV sensor-input checks
- defrost heater electrical isolation, fan-delay sequence, and state-aware reading guidance
- LP control setting/sequence checks
- load-vs-capacity reasoning after airflow/feed/controls are verified
- multi-fault preservation and localized restriction priority over generic charge patterns

## Engine robustness
Knowledge Engine 0.8 candidate handling now preserves multiple independent rules for the same cause instead of allowing the last rule to overwrite earlier evidence paths. Supported diagnoses are deduplicated by candidate after scoring.

## Challenge calibration correction
CH-F001 previously described a long off-cycle/startup context but supplied only a hot-compressor fact. The setup now explicitly supplies FACT_LONG_OFF_CYCLE_STARTUP. The expected HVAC answer was not changed.

Challenge semantic matching now normalizes common HVAC equivalents such as SH/superheat, SC/subcooling, noncondensable(s), and excess refrigerant/overcharge. This changes matcher wording tolerance, not the expected answer key.

## Validation
- Master Validation: 80/80 PASS
- Challenge Validation v1: 50/50 PASS
- Node regression/validation suites: 27/27 PASS
