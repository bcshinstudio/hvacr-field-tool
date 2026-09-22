# WIC Diagnostic Coverage Audit — Brain 0.4.0

Coverage-driven validation replaces case-patching. This does not claim every physically possible fault in every equipment design is enumerable; model-specific controls and sequences require equipment-specific modules.

## Audited families
\n- Refrigerant charge / leaks\n- Liquid line / filter drier / solenoid\n- TXV / metering device\n- Evaporator / airflow\n- Defrost / drain / fan delay\n- Condenser / high side / head-pressure control\n- Compressor / pumping / capacity\n- Controls / sensors / pressure controls\n- Load / infiltration / sizing\n- Moisture / contamination\n- Multiple simultaneous faults and ambiguous symptoms

## Policy
- Field observations are evidence, not discoveries.\n- Do not require impractical measurements when manufacturer-supported checks exist.\n- Do not invent universal thresholds.\n- Broad conditions are not root causes.\n- Missing data stays unknown.\n- Multiple faults may coexist.\n- Manufacturer/model targets override generic fallbacks.\n- Every encoded cause has a reachability audit plus ambiguity/localization tests.\n