# Knowledge Coverage — Phase 4: Scenario Mapping

**Explicit scenario expectation mapping only. No claims of independently validated diagnosis.**

- faults: 69
- datasets: 13
- cases: 552
- cases_with_explicit_fault_expectations: 209
- faults_with_positive_scenarios: 61
- faults_with_any_scenario_link: 61
- integrity_issues: 0

## Dataset inventory

| Dataset | Cases | Linked expectations | Unlinked |
|---|---:|---:|---:|
| tests/knowledge_cases.json | 20 | 17 | 3 |
| tests/diagnostic_cases.json | 24 | 0 | 24 |
| tests/wic_fact_adapter_cases.json | 20 | 0 | 20 |
| tests/wic_system_check_presentation_cases.json | 2 | 0 | 2 |
| tests/master_validation/wic_master_diagnostic_cases.json | 80 | 0 | 80 |
| tests/residential_ac/residential_ac_master_cases.json | 40 | 0 | 40 |
| tests/residential_ac_deep/residential_ac_deep_cases.json | 80 | 80 | 0 |
| tests/electrical_service_calls/electrical_service_call_cases.json | 6 | 1 | 5 |
| tests/textbook_volume1/textbook_volume1_cases.json | 20 | 0 | 20 |
| tests/challenge_validation/wic_challenge_cases_v1.json | 50 | 20 | 30 |
| tests/challenge_validation_2/wic_challenge_cases_v2.json | 60 | 0 | 60 |
| tests/challenge_validation_3/wic_challenge_cases_v3.json | 70 | 43 | 27 |
| tests/challenge_validation_4/wic_challenge_cases_v4.json | 80 | 48 | 32 |

## Fault coverage

| Fault | Positive scenarios | Negative scenarios | Alternative scenarios | Prior assertion links | Status |
|---|---:|---:|---:|---:|---|
| CAUSE_LOW_REFRIGERANT_CHARGE | 7 | 11 | 0 | 5 | SCENARIO_EXPECTATION_LINKED |
| CAUSE_REFRIGERANT_LEAK | 0 | 0 | 0 | 0 | NO_EXPLICIT_SCENARIO_LINK |
| CAUSE_OVERCHARGE | 4 | 8 | 0 | 0 | SCENARIO_EXPECTATION_LINKED |
| CAUSE_NONCONDENSABLES | 4 | 2 | 0 | 0 | SCENARIO_EXPECTATION_LINKED |
| CAUSE_LIQUID_LINE_RESTRICTION | 3 | 2 | 0 | 2 | SCENARIO_EXPECTATION_LINKED |
| CAUSE_FILTER_DRIER_RESTRICTION | 11 | 0 | 0 | 3 | SCENARIO_EXPECTATION_LINKED |
| CAUSE_SOLENOID_RESTRICTION | 0 | 0 | 0 | 0 | NO_EXPLICIT_SCENARIO_LINK |
| CAUSE_TXV_UNDERFEED | 1 | 3 | 0 | 3 | SCENARIO_EXPECTATION_LINKED |
| CAUSE_TXV_OVERFEED | 1 | 0 | 0 | 0 | SCENARIO_EXPECTATION_LINKED |
| CAUSE_TXV_BULB_INSTALLATION | 8 | 0 | 0 | 1 | SCENARIO_EXPECTATION_LINKED |
| CAUSE_TXV_EQUALIZER_FAULT | 4 | 0 | 0 | 1 | SCENARIO_EXPECTATION_LINKED |
| CAUSE_TXV_INCORRECT_SIZE | 0 | 0 | 0 | 0 | NO_EXPLICIT_SCENARIO_LINK |
| CAUSE_EVAP_AIRFLOW_RESTRICTION | 4 | 0 | 0 | 0 | SCENARIO_EXPECTATION_LINKED |
| CAUSE_EVAP_FAN_FAILURE | 9 | 1 | 0 | 0 | SCENARIO_EXPECTATION_LINKED |
| CAUSE_EVAP_COIL_DIRTY | 2 | 1 | 0 | 0 | SCENARIO_EXPECTATION_LINKED |
| CAUSE_EVAP_ICING | 3 | 0 | 0 | 0 | SCENARIO_EXPECTATION_LINKED |
| CAUSE_COND_AIRFLOW_RESTRICTION | 6 | 0 | 0 | 0 | SCENARIO_EXPECTATION_LINKED |
| CAUSE_COND_FAN_FAILURE | 9 | 2 | 0 | 0 | SCENARIO_EXPECTATION_LINKED |
| CAUSE_COND_COIL_DIRTY | 12 | 2 | 0 | 0 | SCENARIO_EXPECTATION_LINKED |
| CAUSE_HOT_AIR_RECIRCULATION | 2 | 0 | 0 | 0 | SCENARIO_EXPECTATION_LINKED |
| CAUSE_HIGH_AMBIENT | 1 | 0 | 0 | 0 | SCENARIO_EXPECTATION_LINKED |
| CAUSE_EXCESSIVE_LOAD | 1 | 1 | 0 | 0 | SCENARIO_EXPECTATION_LINKED |
| CAUSE_AIR_INFILTRATION | 6 | 0 | 0 | 0 | SCENARIO_EXPECTATION_LINKED |
| CAUSE_DEFROST_INADEQUATE | 3 | 0 | 0 | 0 | SCENARIO_EXPECTATION_LINKED |
| CAUSE_DRAIN_HEATER_OR_DRAIN_FAULT | 0 | 0 | 0 | 0 | NO_EXPLICIT_SCENARIO_LINK |
| CAUSE_WET_SYSTEM_TXV_ICE | 2 | 0 | 0 | 0 | SCENARIO_EXPECTATION_LINKED |
| CAUSE_LP_CONTROL_SETTING_OR_FAULT | 4 | 0 | 0 | 0 | SCENARIO_EXPECTATION_LINKED |
| CAUSE_HP_CONTROL_SETTING_OR_FAULT | 0 | 0 | 0 | 0 | NO_EXPLICIT_SCENARIO_LINK |
| CAUSE_LLSV_CONTROL_OR_MECHANICAL_FAULT | 1 | 0 | 0 | 0 | SCENARIO_EXPECTATION_LINKED |
| CAUSE_CONTROLLER_SETTING_OR_SENSOR_FAULT | 4 | 0 | 0 | 0 | SCENARIO_EXPECTATION_LINKED |
| CAUSE_COMPRESSOR_INEFFICIENCY | 10 | 1 | 0 | 0 | SCENARIO_EXPECTATION_LINKED |
| CAUSE_SYSTEM_UNDERSIZED | 3 | 2 | 0 | 0 | SCENARIO_EXPECTATION_LINKED |
| CAUSE_TXV_INLET_RESTRICTION | 4 | 0 | 0 | 1 | SCENARIO_EXPECTATION_LINKED |
| CAUSE_TXV_POWER_ELEMENT_OR_BULB_CHARGE_FAULT | 0 | 0 | 0 | 1 | ASSERTION_LINK_ONLY |
| CAUSE_WRONG_REFRIGERANT_OR_TXV_MATCH | 3 | 0 | 0 | 0 | SCENARIO_EXPECTATION_LINKED |
| CAUSE_HEAD_PRESSURE_CONTROL_FAULT | 0 | 0 | 0 | 0 | NO_EXPLICIT_SCENARIO_LINK |
| CAUSE_DEFROST_HEATER_FAILURE | 3 | 0 | 0 | 0 | SCENARIO_EXPECTATION_LINKED |
| CAUSE_DEFROST_TERMINATION_SENSOR_FAULT | 3 | 0 | 0 | 0 | SCENARIO_EXPECTATION_LINKED |
| CAUSE_EVAP_FAN_DELAY_CONTROL_FAULT | 3 | 0 | 0 | 0 | SCENARIO_EXPECTATION_LINKED |
| CAUSE_COMPRESSOR_NOT_RUNNING | 0 | 0 | 0 | 0 | NO_EXPLICIT_SCENARIO_LINK |
| CAUSE_CONTACTOR_FAILURE | 5 | 2 | 0 | 0 | SCENARIO_EXPECTATION_LINKED |
| CAUSE_COMPRESSOR_START_COMPONENT_FAULT | 2 | 0 | 0 | 0 | SCENARIO_EXPECTATION_LINKED |
| CAUSE_CONTROL_POWER_OR_SAFETY_OPEN | 2 | 0 | 0 | 0 | SCENARIO_EXPECTATION_LINKED |
| CAUSE_DRAIN_REFREEZE | 3 | 0 | 0 | 0 | SCENARIO_EXPECTATION_LINKED |
| CAUSE_SOLENOID_LEAKING_OR_NOT_CLOSING | 3 | 0 | 0 | 0 | SCENARIO_EXPECTATION_LINKED |
| CAUSE_SENSOR_LOCATION_OR_CALIBRATION | 3 | 0 | 0 | 0 | SCENARIO_EXPECTATION_LINKED |
| CAUSE_PRODUCT_LOAD_PULLDOWN | 3 | 0 | 0 | 0 | SCENARIO_EXPECTATION_LINKED |
| CAUSE_CONDENSER_RECIRCULATION | 2 | 0 | 0 | 0 | SCENARIO_EXPECTATION_LINKED |
| CAUSE_SOLENOID_NOT_OPENING_MECHANICAL | 4 | 0 | 0 | 0 | SCENARIO_EXPECTATION_LINKED |
| CAUSE_ANTI_SHORT_CYCLE_DELAY | 3 | 0 | 0 | 0 | SCENARIO_EXPECTATION_LINKED |
| CAUSE_HEAD_CONTROL_FLOOD_CHARGE | 2 | 0 | 0 | 0 | SCENARIO_EXPECTATION_LINKED |
| CAUSE_FUSE_OPEN_REQUIRES_CAUSE | 2 | 0 | 0 | 0 | SCENARIO_EXPECTATION_LINKED |
| CAUSE_CONFIRMED_REFRIGERANT_LEAK_LOW_CHARGE | 4 | 0 | 0 | 0 | SCENARIO_EXPECTATION_LINKED |
| CAUSE_TXV_POWER_ELEMENT_OR_VALVE_FAULT | 2 | 0 | 0 | 0 | SCENARIO_EXPECTATION_LINKED |
| CAUSE_MOISTURE_CONTAMINATION | 2 | 0 | 0 | 0 | SCENARIO_EXPECTATION_LINKED |
| CAUSE_NO_LINE_POWER | 4 | 0 | 0 | 0 | SCENARIO_EXPECTATION_LINKED |
| CAUSE_TRANSFORMER_FAILURE | 2 | 0 | 0 | 0 | SCENARIO_EXPECTATION_LINKED |
| CAUSE_LOW_VOLTAGE_FUSE_OR_SHORT | 2 | 0 | 0 | 0 | SCENARIO_EXPECTATION_LINKED |
| CAUSE_THERMOSTAT_Y_OR_CONTROL_FAULT | 2 | 0 | 0 | 0 | SCENARIO_EXPECTATION_LINKED |
| CAUSE_RUN_CAPACITOR_FAILURE | 4 | 0 | 0 | 0 | SCENARIO_EXPECTATION_LINKED |
| CAUSE_COMPRESSOR_WINDING_FAILURE | 2 | 0 | 0 | 0 | SCENARIO_EXPECTATION_LINKED |
| CAUSE_COMPRESSOR_GROUNDED | 2 | 0 | 0 | 0 | SCENARIO_EXPECTATION_LINKED |
| CAUSE_COND_FAN_MOTOR_FAILURE | 2 | 0 | 0 | 0 | SCENARIO_EXPECTATION_LINKED |
| CAUSE_INDOOR_BLOWER_MOTOR_FAILURE | 2 | 0 | 0 | 0 | SCENARIO_EXPECTATION_LINKED |
| CAUSE_DIRTY_FILTER_OR_DUCT_RESTRICTION | 8 | 0 | 0 | 0 | SCENARIO_EXPECTATION_LINKED |
| CAUSE_FIXED_ORIFICE_RESTRICTION | 2 | 0 | 0 | 0 | SCENARIO_EXPECTATION_LINKED |
| CAUSE_FIXED_ORIFICE_INCORRECT_SIZE | 2 | 0 | 0 | 0 | SCENARIO_EXPECTATION_LINKED |
| CAUSE_LINE_VOLTAGE_OUT_OF_RANGE | 4 | 0 | 0 | 0 | SCENARIO_EXPECTATION_LINKED |
| CAUSE_CONTACTOR_WELDED_CLOSED | 2 | 0 | 0 | 0 | SCENARIO_EXPECTATION_LINKED |

## Integrity findings
- No missing dataset or unknown canonical fault IDs in mapped expectation fields.

## Interpretation
- Scenario expectation is not a passing case assertion
- Suite PASS does not prove every scenario passed unless runner provides per-case outcomes
- Expected answers are not independently verified here
- Cases without canonical IDs may test safety, UI, measurements or operating-state behavior
- Multiple expectations may represent alternatives, not simultaneous confirmed faults
- Scope declarations are not runtime applicability proof

## Next
- Audit runner-to-case execution results and add explicit per-case PASS/FAIL where supported.
- Review unlinked cases manually; do not manufacture cause IDs for UI/safety tests.
- Review fault taxonomy before making categories canonical.
- Add Chapter 7 cases as a separate source-linked dataset, with reference answer status and blind production-engine output.
