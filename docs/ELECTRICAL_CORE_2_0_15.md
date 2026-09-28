# Electrical / Controls Evidence Layer — 2.0.15

This update closes the first UI-to-Brain evidence gaps exposed by the independent Practice Service Call review.

## Design rule
Technicians enter observations and meter results. The UI does not ask them to choose a diagnosis. Evidence remains reusable across WIC, split AC, package AC, heat pump, freezer and other future profiles.

## Added case-wide inputs
- outdoor/condensing-unit line power available / unavailable
- contactor coil state and measured coil voltage
- contactor physical state
- contactor line-side and load-side voltage
- voltage drop across a suspect contact
- contactor output state
- compressor terminal voltage and terminal-power state

## Compressor power-off tests
Existing numeric C-R, C-S and R-S resistance fields remain. New continuity/OL fields allow a technician to record an open winding (`OL`) without abusing a numeric resistance field.

## Existing reusable electrical evidence preserved
Compressor supply/current/nameplate/ground tests, condenser-fan and evaporator-fan electrical fields, fan capacitor rated/measured capacitance, safeties, fuse state, solenoid command/flow, cooling demand and operating-state context remain intact.

## Scope
2.0.15 is an evidence-capture foundation. It does not hard-code textbook answers. Additional Electrical CORE hypotheses/rules will be added only after the Practice Service Call evidence audit validates the required distinctions.

## Regression
All existing 340 WIC master/challenge cases must remain green. Run:

node tests\\master_validation\\master_brain_runner.mjs
node tests\\challenge_validation\\challenge_brain_runner.mjs
node tests\\challenge_validation_2\\challenge_2_brain_runner.mjs
node tests\\challenge_validation_3\\challenge_3_brain_runner.mjs
node tests\\challenge_validation_4\\challenge_4_brain_runner.mjs
node tests\\electrical_core_ui_acceptance.mjs
