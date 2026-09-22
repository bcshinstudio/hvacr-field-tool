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

## Phase 2 validated research notes
Operating state is a diagnostic gate. Defrost, post-defrost, pump-down, startup and satisfied/off-cycle behavior must not be interpreted as if the system were in stable cooling.

Evaporator icing is treated as a condition with competing causes. Danfoss identifies defrost setup, fan operation, air infiltration/moisture, drain issues, low evaporating temperature and refrigerant-feed problems as relevant branches. Parker controller documentation confirms that defrost is a sequence including refrigerant interruption, termination/failsafe, optional drip/drain time, refrigeration restart and fan delay. Therefore the Brain must diagnose the failed sequence step when evidence supports it.

## Phase 3 validated research notes
High condensing pressure is a condition with multiple causes. Danfoss lists noncondensables, excessive charge, condenser/air-side problems and condensing-pressure regulation among the branches. Air-cooled condenser checks include dirt, fan/blade faults, restricted or reversed airflow, high ambient and recirculation.

Low condensing pressure also has multiple causes, including low evaporator load/feed, regulator settings, cold receiver effects and compressor valve leakage. Parker documents that low-ambient head-pressure controls intentionally flood/restrict condenser flow and may bypass discharge gas to maintain receiver/head pressure; their malfunction patterns therefore require configuration-aware diagnosis.

Compressor overheating is treated as a system effect until evidence localizes the compressor. Copeland notes that high compression ratio can result from high head, very low suction, or both, and model/application/refrigerant data are required for pump-down limits. No universal pump-down threshold is encoded.

## Phase 4 validated research notes
Electrical diagnosis is now explicitly path-based. Copeland's service manual directs the technician, when there is no voltage at compressor terminals, to trace backward through the wiring diagram and controls to the power source; if power is present but the compressor will not run, voltage under the starting attempt and start components/protection become a different branch. This prevents a generic 'compressor won't run = bad compressor' rule.

Controls are also treated as system evidence. Danfoss cold-room guidance identifies setpoint, differential, sensor location/calibration, defrost timing, fan logic, compressor cut-in/cut-out, anti-short-cycle delay, pump-down logic, door/load pattern and alarm history as relevant checks.

Pump-down is modeled as a state sequence rather than as a low-suction fault. Exact LP cut-in/cut-out values and wiring are equipment-specific and are not encoded generically.

Warm-room/load diagnosis separates door/infiltration and product load from refrigeration capacity. 'Undersized system' is intentionally a late-stage conclusion after airflow, feed/charge, controls and actual/design load have been established.

## Phase 5 cross-domain validation notes
The final research phase joins the individual domains rather than adding another isolated fault family. Danfoss's cold-room guidance explicitly maps the same top-level complaints to multiple branches: room temperature, airflow, refrigerant feed/charge, condenser performance, compressor condition, controls and sizing. Parker troubleshooting likewise maps high or erratic superheat to multiple possible checks rather than a single component conclusion.

The resulting policy is: establish operating state; validate measurement/reference applicability; identify system condition; maintain all compatible hypotheses; apply contradictions; promote a root cause only with localized/direct evidence; preserve multiple independently supported faults; then choose an uncompleted practical check that best separates the remaining hypotheses.

Thirty-six Phase 5 scenarios cross the Phase 1-4 domains. They include state vetoes, contradictory measurements, model-vs-generic reference precedence, repeated-check suppression, ambiguous next-check selection, and simultaneous faults.

A pre-integration gap audit is now included. The research specification is complete enough to begin the next stage: mapping this validated knowledge architecture into the runtime Brain and then running the independent scenarios against it.
