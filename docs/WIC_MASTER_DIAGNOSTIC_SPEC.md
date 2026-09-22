# WIC Master Diagnostic Specification — Validation Draft

This document defines the knowledge domains that must be validated before the generic WIC Brain is considered mature. It is deliberately broader than the current code.

## 1. Operating state and validity
OFF; startup; stable cooling; pull-down; satisfied; pump-down; defrost; post-defrost; unknown.
Before interpreting SH/SC/head/suction patterns, determine whether the readings are meaningful for the current operating state.

## 2. Refrigerant charge and liquid inventory
Undercharge/leak; overcharge; receiver inventory; flash gas/lack of liquid condition; wrong refrigerant/blend/service procedure; non-condensables where relevant.
Evidence may include SH, SC when an applicable reference exists, sight glass, pressures, receiver/system configuration, leak evidence and service history.

## 3. Liquid line
Filter drier; solenoid; receiver/king valve; kink/restriction; excessive pressure drop; flash gas; moisture/contamination.
Use localized temperature/pressure evidence where practical. Do not diagnose a restriction from starvation alone.

## 4. Metering device
TXV underfeed/overfeed/hunting; adjustment; bulb mounting/contact/location; equalizer; inlet strainer/orifice; power element; sizing; refrigerant compatibility; available pressure differential.
Specific diagnosis requires localized evidence rather than SH alone.

## 5. Evaporator / air side
Fan operation; dirty/blocked coil; iced coil; airflow restriction; load; evaporating temperature; air entering/leaving temperatures; uneven feed.
Separate airflow/load faults from refrigerant-feed faults when they create similar suction/temperature symptoms.

## 6. Defrost / drain
Defrost initiation/schedule; heater or hot-gas function; termination; fan delay; drain/drain heater; refreeze; infiltration/door load.
Evaluate as a sequence, not only as an 'iced coil' symptom.

## 7. Condenser / high side
Dirty condenser; fan failure/rotation/speed; restricted airflow; recirculation; high ambient; overcharge; non-condensables; head-pressure controls; undersized heat rejection.
High head is a condition, not automatically a dirty condenser.

## 8. Compressor
Electrical supply/control; overload/protection; starting/running; pumping/capacity; valve leakage/internal inefficiency; abnormal discharge temperature; operating envelope.
Separate compressor failure from system conditions that make the compressor look bad.

## 9. Controls and pump-down
Thermostat/controller; sensors; LP/HP controls; solenoid; pump-down sequence; fan controls; defrost controls; wiring/control power.
Sequence/state evidence is required.

## 10. Load / infiltration / sizing
Door/gasket/infiltration; product load; room load; ambient; equipment capacity/selection.
Avoid diagnosing undersizing until service/operational faults are excluded.

## 11. Multiple and conflicting faults
The engine must allow two real localized faults, preserve contradictory evidence, and avoid collapsing uncertainty into a single diagnosis.

## Validation rule for every domain
A domain is not marked validated merely because a rule exists. Validation requires:
- source-backed physical reasoning;
- applicable measurements/observations;
- positive fault scenario;
- look-alike scenario;
- contradictory/negative scenario where applicable;
- completed-check suppression;
- technician-facing explanation;
- corrective direction and post-repair verification;
- end-to-end test from field input to presentation.

## Current manufacturer-backed anchors
Danfoss cold-room troubleshooting groups common faults around room-temperature failure, compressor overrun, evaporator icing, high-pressure trips, and expansion-valve/refrigerant-feed problems, and recommends structured checks across airflow, charge, valve operation, controls, defrost and sizing.
Danfoss low-suction guidance includes lack of subcooling ahead of the expansion valve, excessive evaporator SH, valve sizing/blockage/charge issues and evaporator icing among possible causes.
Parker Sporlan TEV guidance treats underfeeding as a multi-check problem involving adjustment, bulb installation, liquid condition, restrictions and valve/application factors.
Copeland training material supports a logical system-level approach spanning refrigeration, compressor and electrical troubleshooting.
