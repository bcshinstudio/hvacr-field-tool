# Knowledge Coverage — Phase 2

Static taxonomy, equipment-scope, traceability and duplication review. **Not a diagnostic validation certificate.**

- Fault concepts: 69; direct rules: 65; no direct rules: 4
- Test source files scanned: 68; faults mentioned literally: 65 (not validated)
- Unknown rule source IDs: 0

## Provisional taxonomy
- Compressor and oil: 7
- Condenser and head-pressure control: 2
- Electrical and controls: 13
- Evaporator, airflow and defrost: 10
- Load, envelope and capacity: 3
- Metering and refrigerant feed: 11
- Refrigerant charge and quality: 9
- Refrigerant circuit restrictions and valves: 7
- Unclassified — manual review: 7

## Equipment scope matrix

| Fault ID | Proposed family | APP_AC_PACKAGE | APP_AC_SPLIT | APP_RIC | APP_RIF | APP_WIC | APP_WIF | Rule count | Source count | Test ID mention |
|---|---|---|---|---|---|---|---|---:|---:|---|
| CAUSE_LOW_REFRIGERANT_CHARGE | Refrigerant charge and quality | Declared | Declared | — | — | Declared | Declared | 3 | 5 | Yes (unverified) |
| CAUSE_REFRIGERANT_LEAK | Refrigerant charge and quality | — | — | — | — | — | — | 0 | 0 | No |
| CAUSE_OVERCHARGE | Refrigerant charge and quality | Declared | Declared | Declared | Declared | Declared | Declared | 2 | 2 | Yes (unverified) |
| CAUSE_NONCONDENSABLES | Refrigerant charge and quality | Declared | Declared | Declared | Declared | Declared | Declared | 2 | 2 | Yes (unverified) |
| CAUSE_LIQUID_LINE_RESTRICTION | Refrigerant circuit restrictions and valves | Declared | Declared | Declared | Declared | Declared | Declared | 1 | 2 | Yes (unverified) |
| CAUSE_FILTER_DRIER_RESTRICTION | Refrigerant circuit restrictions and valves | Declared | Declared | Declared | Declared | Declared | Declared | 2 | 4 | Yes (unverified) |
| CAUSE_SOLENOID_RESTRICTION | Refrigerant circuit restrictions and valves | — | — | — | — | — | — | 0 | 0 | No |
| CAUSE_TXV_UNDERFEED | Metering and refrigerant feed | Declared | Declared | — | — | Declared | Declared | 1 | 3 | Yes (unverified) |
| CAUSE_TXV_OVERFEED | Metering and refrigerant feed | Declared | Declared | — | — | Declared | Declared | 1 | 2 | Yes (unverified) |
| CAUSE_TXV_BULB_INSTALLATION | Metering and refrigerant feed | Declared | Declared | — | — | Declared | Declared | 1 | 2 | Yes (unverified) |
| CAUSE_TXV_EQUALIZER_FAULT | Metering and refrigerant feed | Declared | Declared | — | — | Declared | Declared | 1 | 2 | Yes (unverified) |
| CAUSE_TXV_INCORRECT_SIZE | Metering and refrigerant feed | — | — | — | — | — | — | 0 | 0 | No |
| CAUSE_EVAP_AIRFLOW_RESTRICTION | Refrigerant circuit restrictions and valves | Declared | Declared | Declared | Declared | Declared | Declared | 1 | 3 | Yes (unverified) |
| CAUSE_EVAP_FAN_FAILURE | Evaporator, airflow and defrost | Declared | Declared | Declared | Declared | Declared | Declared | 1 | 2 | Yes (unverified) |
| CAUSE_EVAP_COIL_DIRTY | Compressor and oil | Declared | Declared | Declared | Declared | Declared | Declared | 1 | 2 | Yes (unverified) |
| CAUSE_EVAP_ICING | Evaporator, airflow and defrost | Declared | Declared | Declared | Declared | Declared | Declared | 1 | 1 | Yes (unverified) |
| CAUSE_COND_AIRFLOW_RESTRICTION | Refrigerant circuit restrictions and valves | Declared | Declared | Declared | Declared | Declared | Declared | 1 | 3 | Yes (unverified) |
| CAUSE_COND_FAN_FAILURE | Evaporator, airflow and defrost | Declared | Declared | Declared | Declared | Declared | Declared | 1 | 3 | Yes (unverified) |
| CAUSE_COND_COIL_DIRTY | Compressor and oil | Declared | Declared | Declared | Declared | Declared | Declared | 1 | 3 | Yes (unverified) |
| CAUSE_HOT_AIR_RECIRCULATION | Unclassified — manual review | Declared | Declared | Declared | Declared | Declared | Declared | 1 | 1 | Yes (unverified) |
| CAUSE_HIGH_AMBIENT | Unclassified — manual review | Declared | Declared | Declared | Declared | Declared | Declared | 1 | 1 | Yes (unverified) |
| CAUSE_EXCESSIVE_LOAD | Load, envelope and capacity | — | — | — | — | Declared | Declared | 1 | 2 | Yes (unverified) |
| CAUSE_AIR_INFILTRATION | Unclassified — manual review | — | — | — | — | Declared | Declared | 1 | 1 | Yes (unverified) |
| CAUSE_DEFROST_INADEQUATE | Evaporator, airflow and defrost | — | — | — | — | Declared | Declared | 1 | 2 | Yes (unverified) |
| CAUSE_DRAIN_HEATER_OR_DRAIN_FAULT | Evaporator, airflow and defrost | — | — | — | — | Declared | Declared | 1 | 2 | Yes (unverified) |
| CAUSE_WET_SYSTEM_TXV_ICE | Metering and refrigerant feed | — | — | — | — | Declared | Declared | 2 | 2 | Yes (unverified) |
| CAUSE_LP_CONTROL_SETTING_OR_FAULT | Electrical and controls | — | — | — | — | Declared | Declared | 2 | 1 | Yes (unverified) |
| CAUSE_HP_CONTROL_SETTING_OR_FAULT | Electrical and controls | — | — | — | — | — | — | 0 | 0 | No |
| CAUSE_LLSV_CONTROL_OR_MECHANICAL_FAULT | Electrical and controls | — | — | — | — | Declared | Declared | 1 | 1 | Yes (unverified) |
| CAUSE_CONTROLLER_SETTING_OR_SENSOR_FAULT | Electrical and controls | — | — | — | — | Declared | Declared | 1 | 1 | Yes (unverified) |
| CAUSE_COMPRESSOR_INEFFICIENCY | Compressor and oil | Declared | Declared | Declared | Declared | Declared | Declared | 2 | 2 | Yes (unverified) |
| CAUSE_SYSTEM_UNDERSIZED | Unclassified — manual review | Declared | Declared | Declared | Declared | Declared | Declared | 3 | 1 | Yes (unverified) |
| CAUSE_TXV_INLET_RESTRICTION | Metering and refrigerant feed | Declared | Declared | — | — | Declared | Declared | 1 | 2 | Yes (unverified) |
| CAUSE_TXV_POWER_ELEMENT_OR_BULB_CHARGE_FAULT | Refrigerant charge and quality | Declared | Declared | — | — | Declared | Declared | 1 | 2 | Yes (unverified) |
| CAUSE_WRONG_REFRIGERANT_OR_TXV_MATCH | Metering and refrigerant feed | Declared | Declared | — | — | Declared | Declared | 1 | 1 | Yes (unverified) |
| CAUSE_HEAD_PRESSURE_CONTROL_FAULT | Condenser and head-pressure control | — | — | — | — | Declared | Declared | 1 | 2 | Yes (unverified) |
| CAUSE_DEFROST_HEATER_FAILURE | Evaporator, airflow and defrost | — | — | — | — | Declared | Declared | 2 | 1 | Yes (unverified) |
| CAUSE_DEFROST_TERMINATION_SENSOR_FAULT | Evaporator, airflow and defrost | — | — | — | — | Declared | Declared | 1 | 1 | Yes (unverified) |
| CAUSE_EVAP_FAN_DELAY_CONTROL_FAULT | Evaporator, airflow and defrost | — | — | — | — | Declared | Declared | 1 | 1 | Yes (unverified) |
| CAUSE_COMPRESSOR_NOT_RUNNING | Compressor and oil | Declared | Declared | Declared | Declared | Declared | Declared | 1 | 1 | Yes (unverified) |
| CAUSE_CONTACTOR_FAILURE | Electrical and controls | Declared | Declared | Declared | Declared | Declared | Declared | 2 | 0 | Yes (unverified) |
| CAUSE_COMPRESSOR_START_COMPONENT_FAULT | Compressor and oil | Declared | Declared | Declared | Declared | Declared | Declared | 1 | 0 | Yes (unverified) |
| CAUSE_CONTROL_POWER_OR_SAFETY_OPEN | Electrical and controls | Declared | Declared | Declared | Declared | Declared | Declared | 2 | 1 | Yes (unverified) |
| CAUSE_DRAIN_REFREEZE | Evaporator, airflow and defrost | — | — | — | — | Declared | Declared | 1 | 0 | Yes (unverified) |
| CAUSE_SOLENOID_LEAKING_OR_NOT_CLOSING | Refrigerant charge and quality | — | — | — | — | Declared | Declared | 1 | 0 | Yes (unverified) |
| CAUSE_SENSOR_LOCATION_OR_CALIBRATION | Electrical and controls | — | — | — | — | Declared | Declared | 1 | 0 | Yes (unverified) |
| CAUSE_PRODUCT_LOAD_PULLDOWN | Load, envelope and capacity | — | — | — | — | Declared | Declared | 1 | 0 | Yes (unverified) |
| CAUSE_CONDENSER_RECIRCULATION | Condenser and head-pressure control | — | — | — | — | Declared | Declared | 1 | 0 | Yes (unverified) |
| CAUSE_SOLENOID_NOT_OPENING_MECHANICAL | Refrigerant circuit restrictions and valves | — | — | — | — | Declared | Declared | 1 | 0 | Yes (unverified) |
| CAUSE_ANTI_SHORT_CYCLE_DELAY | Electrical and controls | Declared | Declared | Declared | Declared | Declared | Declared | 1 | 0 | Yes (unverified) |
| CAUSE_HEAD_CONTROL_FLOOD_CHARGE | Refrigerant charge and quality | — | — | — | — | Declared | Declared | 1 | 0 | Yes (unverified) |
| CAUSE_FUSE_OPEN_REQUIRES_CAUSE | Unclassified — manual review | Declared | Declared | Declared | Declared | Declared | Declared | 1 | 0 | Yes (unverified) |
| CAUSE_CONFIRMED_REFRIGERANT_LEAK_LOW_CHARGE | Refrigerant charge and quality | Declared | Declared | Declared | Declared | Declared | Declared | 1 | 0 | Yes (unverified) |
| CAUSE_TXV_POWER_ELEMENT_OR_VALVE_FAULT | Metering and refrigerant feed | Declared | Declared | — | — | Declared | Declared | 1 | 0 | Yes (unverified) |
| CAUSE_MOISTURE_CONTAMINATION | Refrigerant charge and quality | — | — | — | — | Declared | Declared | 1 | 1 | Yes (unverified) |
| CAUSE_NO_LINE_POWER | Unclassified — manual review | Declared | Declared | — | — | — | — | 1 | 3 | Yes (unverified) |
| CAUSE_TRANSFORMER_FAILURE | Unclassified — manual review | Declared | Declared | — | — | — | — | 1 | 3 | Yes (unverified) |
| CAUSE_LOW_VOLTAGE_FUSE_OR_SHORT | Electrical and controls | Declared | Declared | — | — | — | — | 1 | 3 | Yes (unverified) |
| CAUSE_THERMOSTAT_Y_OR_CONTROL_FAULT | Electrical and controls | Declared | Declared | — | — | — | — | 1 | 3 | Yes (unverified) |
| CAUSE_RUN_CAPACITOR_FAILURE | Electrical and controls | Declared | Declared | — | — | — | — | 1 | 3 | Yes (unverified) |
| CAUSE_COMPRESSOR_WINDING_FAILURE | Compressor and oil | Declared | Declared | — | — | — | — | 1 | 3 | Yes (unverified) |
| CAUSE_COMPRESSOR_GROUNDED | Compressor and oil | Declared | Declared | — | — | — | — | 1 | 3 | Yes (unverified) |
| CAUSE_COND_FAN_MOTOR_FAILURE | Evaporator, airflow and defrost | Declared | Declared | — | — | — | — | 1 | 3 | Yes (unverified) |
| CAUSE_INDOOR_BLOWER_MOTOR_FAILURE | Load, envelope and capacity | Declared | Declared | — | — | — | — | 1 | 3 | Yes (unverified) |
| CAUSE_DIRTY_FILTER_OR_DUCT_RESTRICTION | Refrigerant circuit restrictions and valves | Declared | Declared | — | — | — | — | 2 | 3 | Yes (unverified) |
| CAUSE_FIXED_ORIFICE_RESTRICTION | Metering and refrigerant feed | Declared | Declared | — | — | — | — | 1 | 3 | Yes (unverified) |
| CAUSE_FIXED_ORIFICE_INCORRECT_SIZE | Metering and refrigerant feed | Declared | Declared | — | — | — | — | 1 | 3 | Yes (unverified) |
| CAUSE_LINE_VOLTAGE_OUT_OF_RANGE | Electrical and controls | Declared | Declared | — | — | — | — | 2 | 3 | Yes (unverified) |
| CAUSE_CONTACTOR_WELDED_CLOSED | Electrical and controls | Declared | Declared | — | — | — | — | 1 | 3 | Yes (unverified) |

## Candidate duplication review
- Repeated source URLs: 5
  - SRC_DANFOSS_COLDROOM, SRC_DANFOSS_COLDROOM_ICE, SRC_DANFOSS_COLDROOM_CONTROLS_LOAD, SRC_DANFOSS_WIC_STRUCTURED_DIAG
  - SRC_DANFOSS_HIGH_COND, SRC_DANFOSS_HIGH_CONDENSING
  - SRC_COPELAND_TROUBLESHOOT, SRC_COPELAND_TROUBLESHOOTING_FUNDAMENTALS
  - SRC_HEATCRAFT_PM, SRC_HEATCRAFT_PM_CONDENSING
  - SRC_SPORLAN_TEV_COMMON_PROBLEMS, SRC_SPORLAN_TEV_PROBLEMS
- Identical rule evidence + scope signatures: 0
- Identical normalized fault labels: 0

## Integrity
- No unresolved rule source IDs.

## Manual review queue
- CAUSE_REFRIGERANT_LEAK: no direct candidate rule; Refrigerant charge and quality
- CAUSE_SOLENOID_RESTRICTION: no direct candidate rule; Refrigerant circuit restrictions and valves
- CAUSE_TXV_INCORRECT_SIZE: no direct candidate rule; Metering and refrigerant feed
- CAUSE_HOT_AIR_RECIRCULATION: Unclassified — manual review
- CAUSE_HIGH_AMBIENT: Unclassified — manual review
- CAUSE_AIR_INFILTRATION: Unclassified — manual review
- CAUSE_HP_CONTROL_SETTING_OR_FAULT: no direct candidate rule; Electrical and controls
- CAUSE_SYSTEM_UNDERSIZED: Unclassified — manual review
- CAUSE_FUSE_OPEN_REQUIRES_CAUSE: Unclassified — manual review
- CAUSE_NO_LINE_POWER: Unclassified — manual review
- CAUSE_TRANSFORMER_FAILURE: Unclassified — manual review

## How to use
- Confirm proposed taxonomy with a domain review before treating it as canonical.
- Compare new textbook cases to existing fault IDs; do not auto-create new rules from a case.
- Validate applicability against actual runtime engine and equipment configuration.
- Map specific tests to fault IDs with explicit assertions in a later validation phase.
- Source URL duplication is not necessarily an error; investigate before merging.
