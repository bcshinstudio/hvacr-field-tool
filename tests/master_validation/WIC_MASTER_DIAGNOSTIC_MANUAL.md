# WIC Master Diagnostic Validation Suite

**Cases:** 80

This is the human-readable view of the same JSON answer key used for automation. Each case starts with **New** unless explicitly stated otherwise. Inputs marked as pattern/fact cases require the automated fact harness or corresponding UI fields when available.

## Validation rules

- Expected output is the answer key; current Brain output does not redefine it.
- `MUST NOT CONCLUDE` is a required negative assertion.
- Direct physical faults outrank generic operating-state prompts.
- Refrigerant measurements are interpreted only in a valid operating state with relevant airflow/load context.
- Multiple confirmed faults must remain active until corrected.

## WIC-A001 — Evaporator fan not running

**Setup**
- Evaporator → Fan Operation = Not Running

**Expected SYSTEM CHECK RESULT**

**Evaporator fan is not running**

**CONFIRMED FINDINGS**
- Evaporator fan is not operating.

**WHAT THIS MEANS**

This is a direct evaporator-airflow fault. Refrigerant readings can be misleading until airflow is restored.

**NEXT ACTION / CHECK**

With power safely isolated, check whether the fan blade/motor turns freely and whether ice or another obstruction is blocking it.

**EXPECTED TROUBLESHOOTING PATH**
1. Check free rotation/obstruction with power isolated.
2. If mechanically free, confirm fan should be commanded on and verify correct supply voltage.
3. If correct voltage is present, test applicable run capacitor, motor and wiring; if absent, trace fan control/relay/defrost interlock.
4. After repair verify rotation/airflow; clear ice if needed; then run normal cooling and recheck refrigeration readings.

**MUST NOT CONCLUDE**
- Do not diagnose low refrigerant charge from abnormal suction readings while evaporator airflow is lost.

**Validated against:** DANFOSS_COLD_ROOM

---

## WIC-A002 — Condenser fan not running

**Setup**
- Condenser → Fan Operation = Not Running

**Expected SYSTEM CHECK RESULT**

**Condenser fan is not running**

**CONFIRMED FINDINGS**
- Condenser fan is not operating.

**WHAT THIS MEANS**

This is a direct condenser-airflow/heat-rejection fault and can raise condensing pressure.

**NEXT ACTION / CHECK**

With power safely isolated, check for a blocked blade or mechanical obstruction.

**EXPECTED TROUBLESHOOTING PATH**
1. Check mechanical freedom/obstruction.
2. If free, confirm fan command and correct supply voltage.
3. If voltage is correct, test applicable capacitor, motor and wiring/control.
4. After repair verify rotation/airflow and recheck condensing pressure/temperature.

**MUST NOT CONCLUDE**
- Do not diagnose overcharge or noncondensables from high head until condenser airflow is restored.

**Validated against:** DANFOSS_COLD_ROOM, DANFOSS_HIGH_HEAD

---

## WIC-A003 — Evaporator coil fully iced

**Setup**
- Evaporator → Coil Condition = Fully Iced

**Expected SYSTEM CHECK RESULT**

**Evaporator coil is iced**

**CONFIRMED FINDINGS**
- Evaporator coil is iced.

**WHAT THIS MEANS**

Ice restricts evaporator airflow, but icing is a condition with multiple possible causes.

**NEXT ACTION / CHECK**

First check whether the evaporator fan is running normally and whether the air path is blocked.

**EXPECTED TROUBLESHOOTING PATH**
1. Check fan operation and airflow.
2. If airflow is normal, check defrost operation/termination, door infiltration and drain/heater issues.
3. After clearing ice and correcting the cause, run stable cooling and recheck temperatures, pressures and superheat.

**MUST NOT CONCLUDE**
- Do not call the icing itself the root cause.
- Do not diagnose charge from refrigerant readings taken with a heavily iced/airflow-restricted coil.

**Validated against:** DANFOSS_COLD_ROOM

---

## WIC-A004 — Dirty/restricted condenser coil

**Setup**
- Condenser → Coil Condition = Dirty/Restricted

**Expected SYSTEM CHECK RESULT**

**Condenser coil is dirty/restricted**

**CONFIRMED FINDINGS**
- Condenser coil is dirty/restricted.

**WHAT THIS MEANS**

The known airflow restriction reduces condenser heat rejection and can raise condensing pressure.

**NEXT ACTION / CHECK**

Clean/remove the condenser airflow restriction and confirm the fan operates normally.

**EXPECTED TROUBLESHOOTING PATH**
1. Restore condenser airflow.
2. Run stable cooling until readings stabilize.
3. Recheck condensing pressure/temperature and condenser split.

**MUST NOT CONCLUDE**
- Do not adjust refrigerant charge based on high-side readings before correcting the known condenser airflow fault.

**Validated against:** DANFOSS_COLD_ROOM, DANFOSS_HIGH_HEAD

---

## WIC-A005 — Restricted evaporator airflow

**Setup**
- Evaporator → Airflow = Blocked/Restricted

**Expected SYSTEM CHECK RESULT**

**Evaporator airflow is restricted**

**CONFIRMED FINDINGS**
- Evaporator airflow is blocked/restricted.

**WHAT THIS MEANS**

Low airflow reduces evaporator heat load and changes suction pressure, temperature difference and superheat behavior.

**NEXT ACTION / CHECK**

Find and correct the airflow restriction before judging refrigerant-side faults.

**EXPECTED TROUBLESHOOTING PATH**
1. Inspect coil for ice/dirt, fan operation and blocked return/discharge path.
2. Correct airflow.
3. Run stable cooling and recheck box temperature, suction pressure and superheat.

**MUST NOT CONCLUDE**
- Do not diagnose low charge or TXV failure from suction/superheat while airflow is abnormal.

**Validated against:** DANFOSS_COLD_ROOM

---

## WIC-A006 — Sight glass flashing/bubbles only

**Setup**
- Sight Glass → Refrigerant Appearance = Continuous Bubbles/Flashing

**Expected SYSTEM CHECK RESULT**

**Bubbles / flashing observed in the liquid-line sight glass**

**CONFIRMED FINDINGS**
- Sight glass shows flashing/bubbles.

**WHAT THIS MEANS**

This is a liquid-supply clue, not a charge diagnosis by itself. It can result from insufficient liquid inventory, inadequate subcooling, pressure drop/restriction or head-pressure conditions.

**NEXT ACTION / CHECK**

Check liquid-line temperature/pressure evidence for restriction, especially across the filter drier and other liquid-line components.

**EXPECTED TROUBLESHOOTING PATH**
1. Check localized liquid-line pressure/temperature drop.
2. Check applicable subcooling/liquid condition.
3. Look for leak/charge evidence before adding refrigerant.

**MUST NOT CONCLUDE**
- Do not add refrigerant based on sight-glass bubbles alone.

**Validated against:** DANFOSS_SIGHT_GLASS, DANFOSS_DRIER_SIGHT

---

## WIC-A007 — Moisture indicator wet

**Setup**
- Sight Glass → Moisture Indicator = Wet

**Expected SYSTEM CHECK RESULT**

**Moisture is indicated in the liquid line**

**CONFIRMED FINDINGS**
- Sight-glass moisture indicator shows wet.

**WHAT THIS MEANS**

The indicator suggests excessive moisture in the refrigerant circuit and warrants service investigation; it does not by itself identify charge level.

**NEXT ACTION / CHECK**

Confirm the indicator condition and service history, then address moisture contamination using proper refrigeration service procedures and an appropriate filter drier.

**EXPECTED TROUBLESHOOTING PATH**
1. Verify indicator/refrigerant compatibility and condition.
2. Investigate source of moisture/service exposure.
3. Replace/service filter drier as appropriate, evacuate/dehydrate per service procedure, then verify indicator returns dry after operation.

**MUST NOT CONCLUDE**
- Do not diagnose undercharge solely from a wet moisture indicator.

**Validated against:** DANFOSS_DRIER_SIGHT

---

## WIC-A008 — TXV sensing bulb poor contact

**Setup**
- Metering Device → Sensing Bulb Contact = Poor

**Expected SYSTEM CHECK RESULT**

**TXV sensing-bulb problem**

**CONFIRMED FINDINGS**
- TXV sensing-bulb mounting/contact is incorrect.

**WHAT THIS MEANS**

Poor bulb contact/location can give the TXV an incorrect temperature signal and cause incorrect refrigerant feed.

**NEXT ACTION / CHECK**

Correct sensing-bulb contact, location and mounting per the TXV manufacturer instructions.

**EXPECTED TROUBLESHOOTING PATH**
1. Correct bulb mounting/contact/location.
2. Run stable cooling until readings stabilize.
3. Recheck evaporator superheat; if still abnormal continue liquid-supply/TXV checks.

**MUST NOT CONCLUDE**
- Do not condemn the TXV power element or adjust charge before correcting the known bulb installation problem.

**Validated against:** PARKER_TEV_1011, PARKER_TEV_109

---

## WIC-A009 — TXV external equalizer issue

**Setup**
- Metering Device → External Equalizer = Issue Observed

**Expected SYSTEM CHECK RESULT**

**TXV external-equalizer problem**

**CONFIRMED FINDINGS**
- A TXV external-equalizer problem is present.

**WHAT THIS MEANS**

A blocked, leaking, disconnected or mislocated equalizer can make the TXV respond to incorrect evaporator-outlet pressure and misfeed refrigerant.

**NEXT ACTION / CHECK**

Inspect and correct the external equalizer connection, restriction, leak or location.

**EXPECTED TROUBLESHOOTING PATH**
1. Correct equalizer problem.
2. Run stable cooling.
3. Recheck superheat and refrigerant feed.

**MUST NOT CONCLUDE**
- Do not blame refrigerant charge before correcting the known equalizer fault.

**Validated against:** PARKER_TEV_1011

---

## WIC-A010 — TXV inlet/strainer restriction observed

**Setup**
- Metering Device → TXV Inlet / Strainer = Restriction Observed

**Expected SYSTEM CHECK RESULT**

**Restriction is observed at the TXV inlet**

**CONFIRMED FINDINGS**
- Restriction is observed at the TXV inlet/strainer.

**WHAT THIS MEANS**

This is localized evidence of restricted liquid flow into the metering device and can starve the evaporator.

**NEXT ACTION / CHECK**

Correct the TXV inlet/strainer restriction using proper service procedures, then verify liquid feed and superheat.

**EXPECTED TROUBLESHOOTING PATH**
1. Correct localized restriction.
2. Run stable cooling.
3. Recheck liquid condition, suction pressure and superheat.

**MUST NOT CONCLUDE**
- Do not add refrigerant merely to compensate for a known restriction.

**Validated against:** PARKER_TEV_1011

---

## WIC-A011 — TXV hunting

**Setup**
- Metering Device → Hunting = Yes

**Expected SYSTEM CHECK RESULT**

**TXV/EEV hunting is observed**

**CONFIRMED FINDINGS**
- TXV/EEV hunting is observed.

**WHAT THIS MEANS**

Hunting means refrigerant feed/superheat control is unstable; valve sizing, bulb installation, load/airflow and control settings can contribute.

**NEXT ACTION / CHECK**

First verify stable load/airflow and correct bulb installation, then observe superheat response before adjusting or replacing the valve.

**EXPECTED TROUBLESHOOTING PATH**
1. Verify operating state/load and airflow.
2. Verify bulb/equalizer installation.
3. Trend superheat/valve response; then check valve sizing/setting if instability remains.

**MUST NOT CONCLUDE**
- Do not replace the TXV from hunting alone without checking installation and load conditions.

**Validated against:** DANFOSS_COLD_ROOM, PARKER_TEV_1011

---

## WIC-A012 — Liquid-line solenoid does not open

**Setup**
- Liquid-Line Solenoid → Valve Operation = Does Not Open

**Expected SYSTEM CHECK RESULT**

**Liquid-line solenoid is not opening / passing flow**

**CONFIRMED FINDINGS**
- Liquid-line solenoid does not open.

**WHAT THIS MEANS**

A closed solenoid during a cooling demand can stop liquid feed and starve the evaporator.

**NEXT ACTION / CHECK**

Confirm there is a cooling demand and that the solenoid is commanded open; then check specified coil voltage.

**EXPECTED TROUBLESHOOTING PATH**
1. Confirm cooling demand/command.
2. Check coil voltage.
3. No voltage: trace control/wiring. Correct voltage but no opening: inspect coil/valve/mechanical condition.
4. After repair verify liquid flow and recheck suction/superheat.

**MUST NOT CONCLUDE**
- Do not diagnose low charge from starvation symptoms until solenoid operation is verified.

**Validated against:** DANFOSS_COLD_ROOM

---

## WIC-A013 — Liquid-line solenoid does not close

**Setup**
- Liquid-Line Solenoid → Valve Operation = Does Not Close

**Expected SYSTEM CHECK RESULT**

**Liquid-line solenoid is not closing**

**CONFIRMED FINDINGS**
- Liquid-line solenoid does not close.

**WHAT THIS MEANS**

Continued refrigerant flow when the valve should close can prevent normal pump-down and contribute to off-cycle migration/floodback.

**NEXT ACTION / CHECK**

Confirm the valve is commanded closed and determine whether coil voltage is removed as designed.

**EXPECTED TROUBLESHOOTING PATH**
1. Verify command and coil voltage.
2. If de-energized but flow continues, inspect stuck/leaking valve.
3. After correction verify pump-down/off-cycle behavior.

**MUST NOT CONCLUDE**
- Do not adjust LP control to mask a leaking/stuck solenoid.

**Validated against:** DANFOSS_COLD_ROOM

---

## WIC-A014 — High-pressure safety tripped

**Setup**
- Room / Control Evidence → High-Pressure Safety = Open/Tripped

**Expected SYSTEM CHECK RESULT**

**High-pressure safety is open/tripped**

**CONFIRMED FINDINGS**
- High-pressure safety is open/tripped.

**WHAT THIS MEANS**

The system stopped on a high-pressure protection condition; determine why condensing pressure rose before resetting/returning to service.

**NEXT ACTION / CHECK**

Check condenser airflow first: coil cleanliness, fan operation, blocked/recirculated discharge air and ambient condition.

**EXPECTED TROUBLESHOOTING PATH**
1. Check condenser airflow and fan.
2. If airflow is normal, evaluate charge/receiver condition, noncondensables and head-pressure control.
3. Verify safe pressure and cause corrected before reset/operation.

**MUST NOT CONCLUDE**
- Do not repeatedly reset the HP safety without correcting the cause.

**Validated against:** DANFOSS_COLD_ROOM, DANFOSS_HIGH_HEAD

---

## WIC-A015 — Compressor not running

**Setup**
- Compressor → Running State = Off
- Room / Control Evidence → Cooling Demand = Calling

**Expected SYSTEM CHECK RESULT**

**Compressor should be running but is not**

**CONFIRMED FINDINGS**
- Cooling demand is present.
- Compressor is not running.

**WHAT THIS MEANS**

The compressor circuit must be traced from demand/safeties through contactor/power/start components before condemning the compressor.

**NEXT ACTION / CHECK**

Check whether safeties/controls permit compressor operation and whether the contactor is being energized.

**EXPECTED TROUBLESHOOTING PATH**
1. Verify safeties and anti-short-cycle delay.
2. Check contactor coil and line/load voltage.
3. If terminal voltage is correct but compressor does not start, evaluate overload/start components/windings per manufacturer procedure.

**MUST NOT CONCLUDE**
- Do not condemn the compressor before verifying command, safeties and terminal voltage.

**Validated against:** DANFOSS_COLD_ROOM

---

## WIC-A016 — Door infiltration confirmed

**Setup**
- Room / Control Evidence → Door / Infiltration = Confirmed Infiltration

**Expected SYSTEM CHECK RESULT**

**Warm-air infiltration is confirmed**

**CONFIRMED FINDINGS**
- Door/air infiltration is confirmed.

**WHAT THIS MEANS**

Warm humid air adds sensible/latent load and can cause long run time, temperature problems and evaporator frost/ice.

**NEXT ACTION / CHECK**

Correct the door/gasket/closure or other infiltration path, then observe room pull-down and evaporator condition.

**EXPECTED TROUBLESHOOTING PATH**
1. Correct infiltration.
2. Clear ice if needed.
3. Run normally and recheck room temperature/run time before refrigerant diagnosis.

**MUST NOT CONCLUDE**
- Do not add refrigerant to compensate for a confirmed load/infiltration problem.

**Validated against:** DANFOSS_COLD_ROOM

---

## WIC-A017 — Large warm product load

**Setup**
- Room / Control Evidence → Warm Product Load = Large Warm Load

**Expected SYSTEM CHECK RESULT**

**High product load is present**

**CONFIRMED FINDINGS**
- Large warm product load is present.

**WHAT THIS MEANS**

The refrigeration load is temporarily elevated and can cause long run time and higher-than-normal room temperature during pull-down.

**NEXT ACTION / CHECK**

Confirm the system is in pull-down and monitor whether temperature decreases at a reasonable rate before diagnosing a refrigeration fault.

**EXPECTED TROUBLESHOOTING PATH**
1. Verify pull-down state and airflow.
2. Trend room/product temperature.
3. If pull-down stalls, then investigate refrigeration capacity/feed.

**MUST NOT CONCLUDE**
- Do not diagnose a fault solely because the compressor runs continuously during a legitimate heavy pull-down.

**Validated against:** DANFOSS_COLD_ROOM

---

## WIC-A018 — Room sensor disagrees with reference

**Setup**
- Room / Control Evidence → Sensor vs Reference = Disagrees

**Expected SYSTEM CHECK RESULT**

**Room temperature sensor reading is suspect**

**CONFIRMED FINDINGS**
- Room sensor disagrees with a trusted reference.

**WHAT THIS MEANS**

A biased/mislocated sensor can cause incorrect cycling, setpoint control and apparent room-temperature problems.

**NEXT ACTION / CHECK**

Verify sensor placement, calibration and wiring against a trusted temperature reference before changing refrigeration settings.

**EXPECTED TROUBLESHOOTING PATH**
1. Compare sensor/reference temperatures.
2. Inspect placement/wiring/calibration.
3. Correct sensor issue, then observe control operation.

**MUST NOT CONCLUDE**
- Do not adjust refrigerant charge to correct a control sensor error.

**Validated against:** DANFOSS_COLD_ROOM

---

## WIC-B019 — High superheat only — insufficient evidence

**Setup**
- Evaporator Outlet Pressure = 34 psig (R-448A)
- Evaporator Outlet Temperature = 35°F

**Expected SYSTEM CHECK RESULT**

**Possible evaporator refrigerant starvation**

**CONFIRMED FINDINGS**
- Evaporator superheat is high at approximately 24.7°F.

**WHAT THIS MEANS**

High superheat supports insufficient evaporator refrigerant feed, but does not identify whether the cause is low liquid inventory, upstream restriction or metering-device underfeeding.

**NEXT ACTION / CHECK**

If the system is in stable cooling, check the liquid-supply side next: applicable subcooling/liquid condition, filter-drier temperature/pressure drop, sight glass and TXV inlet condition.

**EXPECTED TROUBLESHOOTING PATH**
1. Verify stable cooling.
2. Check liquid-supply discriminators.
3. Use localized evidence to separate low inventory, restriction and TXV underfeeding.

**MUST NOT CONCLUDE**
- Do not diagnose low charge from high superheat alone.
- Do not condemn the TXV from high superheat alone.

**Validated against:** DANFOSS_COLD_ROOM, PARKER_TEV_1011

---

## WIC-B020 — High SH + large drier temperature drop

**Setup**
- Evaporator Outlet Pressure = 34 psig (R-448A)
- Evaporator Outlet Temperature = 35°F
- Filter Drier Inlet = 90°F
- Filter Drier Outlet = 78°F

**Expected SYSTEM CHECK RESULT**

**Restricted filter drier indicated**

**CONFIRMED FINDINGS**
- Evaporator superheat is high at approximately 24.7°F.
- Temperature decreases 12°F across the liquid-line filter drier.

**WHAT THIS MEANS**

The localized temperature decrease identifies a substantial pressure/temperature drop at the filter drier; restricted liquid flow can explain the starved evaporator.

**NEXT ACTION / CHECK**

Replace the restricted filter drier using proper recovery/service procedures, then run the system normally and recheck drier temperature difference, superheat, subcooling and pressures.

**EXPECTED TROUBLESHOOTING PATH**
1. Service/replace restricted drier.
2. Verify restriction is gone.
3. Recheck system operation after stabilization.

**MUST NOT CONCLUDE**
- Do not add refrigerant to overcome a localized filter-drier restriction.

**Validated against:** DANFOSS_DRIER_SIGHT, DANFOSS_COLD_ROOM

---

## WIC-B021 — High SH + poor TXV bulb contact

**Setup**
- Evaporator Outlet Pressure = 34 psig (R-448A)
- Evaporator Outlet Temperature = 35°F
- Metering Device → Sensing Bulb Contact = Poor

**Expected SYSTEM CHECK RESULT**

**TXV sensing-bulb problem is related to evaporator starvation**

**CONFIRMED FINDINGS**
- Evaporator superheat is high at approximately 24.7°F.
- TXV sensing-bulb mounting/contact is incorrect.

**WHAT THIS MEANS**

High superheat shows evaporator underfeeding, and the known bulb installation problem can make the TXV control feed incorrectly.

**NEXT ACTION / CHECK**

Correct the sensing bulb contact/location/mounting first; then run stable cooling and recheck evaporator superheat.

**EXPECTED TROUBLESHOOTING PATH**
1. Correct bulb.
2. Stabilize system.
3. If SH remains high, continue liquid-supply/TXV checks.

**MUST NOT CONCLUDE**
- Do not blame charge or replace the TXV before correcting the known bulb issue.

**Validated against:** PARKER_TEV_1011

---

## WIC-B022 — High SH + external equalizer issue

**Setup**
- Evaporator Outlet Pressure = 34 psig (R-448A)
- Evaporator Outlet Temperature = 35°F
- Metering Device → External Equalizer = Issue Observed

**Expected SYSTEM CHECK RESULT**

**TXV external-equalizer problem is related to evaporator starvation**

**CONFIRMED FINDINGS**
- Evaporator superheat is high at approximately 24.7°F.
- A TXV external-equalizer problem is present.

**WHAT THIS MEANS**

High superheat shows underfeeding; the observed equalizer problem can give the TXV incorrect outlet-pressure information.

**NEXT ACTION / CHECK**

Inspect and correct the equalizer connection/restriction/leak/location first, then stabilize and recheck superheat.

**EXPECTED TROUBLESHOOTING PATH**
1. Correct equalizer.
2. Stabilize.
3. If SH remains high, continue upstream liquid/TXV checks.

**MUST NOT CONCLUDE**
- Do not diagnose low charge before correcting the known equalizer fault.

**Validated against:** PARKER_TEV_1011

---

## WIC-B023 — High SH + sight-glass bubbles

**Setup**
- Evaporator Outlet Pressure = 34 psig (R-448A)
- Evaporator Outlet Temperature = 35°F
- Sight Glass = Continuous Bubbles/Flashing

**Expected SYSTEM CHECK RESULT**

**Evaporator is underfed; liquid-supply evidence is needed**

**CONFIRMED FINDINGS**
- Evaporator superheat is high.
- Sight glass shows flashing/bubbles.

**WHAT THIS MEANS**

Together these support inadequate liquid feed, but still do not distinguish insufficient refrigerant inventory from upstream pressure drop/restriction or inadequate subcooling.

**NEXT ACTION / CHECK**

Check localized liquid-line temperature/pressure drop and applicable subcooling before deciding charge.

**EXPECTED TROUBLESHOOTING PATH**
1. Check filter drier/liquid-line restriction evidence.
2. Check applicable subcooling/liquid condition.
3. Check leak/charge evidence only after restriction is excluded.

**MUST NOT CONCLUDE**
- Do not add refrigerant from high SH + bubbles alone.

**Validated against:** DANFOSS_SIGHT_GLASS, DANFOSS_COLD_ROOM

---

## WIC-B024 — High SH + bubbles + drier drop

**Setup**
- Evaporator Outlet Pressure = 34 psig (R-448A)
- Evaporator Outlet Temperature = 35°F
- Sight Glass = Continuous Bubbles/Flashing
- filter_drier_inlet_temperature = 90 °F
- filter_drier_outlet_temperature = 78 °F

**Expected SYSTEM CHECK RESULT**

**Restricted filter drier indicated**

**CONFIRMED FINDINGS**
- Evaporator superheat is high.
- Sight glass shows flashing/bubbles.
- Temperature decreases 12°F across the filter drier.

**WHAT THIS MEANS**

The localized drier temperature drop explains a liquid-supply restriction and can account for both flashing and evaporator starvation.

**NEXT ACTION / CHECK**

Service/replace the restricted filter drier first, then verify clear liquid condition and recheck SH/SC/pressures after stabilization.

**EXPECTED TROUBLESHOOTING PATH**
1. Correct drier restriction.
2. Verify liquid condition.
3. Recheck refrigeration measurements.

**MUST NOT CONCLUDE**
- Do not treat the sight-glass bubbles as proof of low charge when localized restriction evidence is present.

**Validated against:** DANFOSS_DRIER_SIGHT, DANFOSS_SIGHT_GLASS

---

## WIC-B025 — Low suction + low head + high SH + low SC

**Setup**
- Low suction + low head + high SH + low SC

**Expected SYSTEM CHECK RESULT**

**Low refrigerant inventory is strongly suspected**

**CONFIRMED FINDINGS**
- Low suction pressure.
- Low condensing pressure.
- High superheat.
- Low applicable subcooling.

**WHAT THIS MEANS**

The combined pattern is consistent with an underfed evaporator and insufficient refrigerant inventory, provided airflow/load and operating state are normal.

**NEXT ACTION / CHECK**

Check for leak evidence and verify charge using the equipment/application charging method before adding refrigerant.

**EXPECTED TROUBLESHOOTING PATH**
1. Confirm stable cooling and normal airflow/load.
2. Inspect for leak/oil evidence.
3. Verify charge by approved method; repair leak before recharge.

**MUST NOT CONCLUDE**
- Do not call low charge from one measurement alone.

**Validated against:** DANFOSS_COLD_ROOM

---

## WIC-B026 — Low suction + high SH + retained/high SC

**Setup**
- Low suction + high SH + retained/high SC

**Expected SYSTEM CHECK RESULT**

**Liquid-line or metering restriction is favored**

**CONFIRMED FINDINGS**
- Low suction pressure.
- High superheat.
- Subcooling is retained/high.

**WHAT THIS MEANS**

A starved evaporator with retained liquid on the high side favors restricted liquid feed over simple undercharge.

**NEXT ACTION / CHECK**

Check filter drier, liquid-line pressure/temperature drop, solenoid and TXV inlet/strainer to localize the restriction.

**EXPECTED TROUBLESHOOTING PATH**
1. Check drier ΔT/ΔP.
2. Check solenoid/valves/liquid line.
3. Check TXV inlet/strainer.

**MUST NOT CONCLUDE**
- Do not add refrigerant merely because suction is low/high SH.

**Validated against:** DANFOSS_COLD_ROOM

---

## WIC-B027 — High head + high SC + normal condenser airflow

**Setup**
- High head + high SC + normal condenser airflow

**Expected SYSTEM CHECK RESULT**

**Overcharge / excess liquid inventory is possible**

**CONFIRMED FINDINGS**
- Condensing pressure is high.
- Subcooling is high.
- Condenser airflow is normal.

**WHAT THIS MEANS**

With heat rejection verified, excess refrigerant inventory becomes a stronger possibility, but receiver level/application charging method still matter.

**NEXT ACTION / CHECK**

Verify receiver/charge condition and rule out noncondensables/head-pressure-control problems before recovering refrigerant.

**EXPECTED TROUBLESHOOTING PATH**
1. Confirm airflow/ambient.
2. Verify charge/receiver condition.
3. Check service history/noncondensables/head-pressure control.

**MUST NOT CONCLUDE**
- Do not recover refrigerant from high head alone.

**Validated against:** DANFOSS_HIGH_HEAD, DANFOSS_COLD_ROOM

---

## WIC-B028 — High head + dirty condenser

**Setup**
- High head + dirty condenser

**Expected SYSTEM CHECK RESULT**

**Condenser airflow restriction should be corrected first**

**CONFIRMED FINDINGS**
- Condensing pressure is high.
- Condenser coil is dirty/restricted.

**WHAT THIS MEANS**

The directly observed heat-rejection fault can explain elevated condensing pressure.

**NEXT ACTION / CHECK**

Clean/restore condenser airflow first; then stabilize and recheck head pressure before considering charge or noncondensables.

**EXPECTED TROUBLESHOOTING PATH**
1. Correct airflow.
2. Stabilize.
3. Recheck high side.

**MUST NOT CONCLUDE**
- Do not diagnose overcharge/noncondensables before correcting the known airflow fault.

**Validated against:** DANFOSS_HIGH_HEAD

---

## WIC-B029 — High head + condenser fan stopped

**Setup**
- High head + condenser fan stopped

**Expected SYSTEM CHECK RESULT**

**Condenser fan fault should be corrected first**

**CONFIRMED FINDINGS**
- Condensing pressure is high.
- Condenser fan is not operating.

**WHAT THIS MEANS**

Loss of condenser airflow can directly cause high condensing pressure.

**NEXT ACTION / CHECK**

Troubleshoot and restore condenser fan operation first; then recheck high-side readings.

**EXPECTED TROUBLESHOOTING PATH**
1. Mechanical check.
2. Voltage/control/capacitor/motor as applicable.
3. Verify airflow and high side after repair.

**MUST NOT CONCLUDE**
- Do not adjust charge before restoring fan operation.

**Validated against:** DANFOSS_HIGH_HEAD

---

## WIC-B030 — High head + airflow normal + high ambient

**Setup**
- High head + airflow normal + high ambient

**Expected SYSTEM CHECK RESULT**

**High ambient/heat-rejection load is a major contributor**

**CONFIRMED FINDINGS**
- Condensing pressure is high.
- Condenser airflow is normal.
- Ambient temperature is high.

**WHAT THIS MEANS**

High ambient raises the condensing requirement even with normal airflow; judge head pressure against the application/ambient relationship before calling a fault.

**NEXT ACTION / CHECK**

Verify condenser split/CTOA against the equipment/application target and confirm no recirculation or other heat-rejection problem.

**EXPECTED TROUBLESHOOTING PATH**
1. Confirm ambient and condenser split.
2. Check recirculation.
3. Only then investigate charge/noncondensables if pressure remains excessive.

**MUST NOT CONCLUDE**
- Do not call overcharge solely from high head during high ambient.

**Validated against:** DANFOSS_COLD_ROOM

---

## WIC-B031 — High suction + low head

**Setup**
- High suction + low head

**Expected SYSTEM CHECK RESULT**

**Compressor inefficiency / low compression is possible**

**CONFIRMED FINDINGS**
- Suction pressure is high.
- Condensing pressure is low.

**WHAT THIS MEANS**

A reduced pressure differential can indicate compressor inefficiency, but load, bypass/unloader conditions and operating state must be checked.

**NEXT ACTION / CHECK**

Confirm stable load and compressor operation, then evaluate compression ratio/current and compressor capacity per manufacturer data.

**EXPECTED TROUBLESHOOTING PATH**
1. Confirm operating state/load.
2. Check current and compression ratio.
3. Evaluate compressor capacity/valves if low differential persists.

**MUST NOT CONCLUDE**
- Do not condemn the compressor from two pressure readings without checking load/operating conditions.

**Validated against:** DANFOSS_LOW_HEAD, PARKER_TEV_1011

---

## WIC-B032 — Low head + low suction

**Setup**
- Low head + low suction

**Expected SYSTEM CHECK RESULT**

**Low load / low ambient / insufficient feed must be separated**

**CONFIRMED FINDINGS**
- Suction pressure is low.
- Condensing pressure is low.

**WHAT THIS MEANS**

Both sides low can occur with low load/ambient or insufficient evaporator feed; more context is required.

**NEXT ACTION / CHECK**

Check box/load condition, ambient/head-pressure control and evaporator feed evidence (SH/SC/liquid condition) to separate causes.

**EXPECTED TROUBLESHOOTING PATH**
1. Check load/box temp.
2. Check ambient/head-pressure control.
3. Check SH/SC/liquid feed.

**MUST NOT CONCLUDE**
- Do not call low charge from low-low pressures alone.

**Validated against:** DANFOSS_LOW_HEAD, DANFOSS_COLD_ROOM

---

## WIC-B033 — Low SH / flooding pattern

**Setup**
- Low SH / flooding pattern

**Expected SYSTEM CHECK RESULT**

**Evaporator overfeeding / floodback risk**

**CONFIRMED FINDINGS**
- Evaporator superheat is low.

**WHAT THIS MEANS**

Low superheat means vapor leaving the evaporator has little temperature margin above saturation and may indicate overfeeding/floodback risk depending on measurement location and application.

**NEXT ACTION / CHECK**

Verify measurement accuracy and stable load/airflow, then check TXV bulb/setting, valve seat/size and load before adjusting the valve.

**EXPECTED TROUBLESHOOTING PATH**
1. Verify measurement/location.
2. Check airflow/load.
3. Check TXV bulb/setting/seat/size.

**MUST NOT CONCLUDE**
- Do not automatically adjust the TXV from one low-SH reading.

**Validated against:** PARKER_TEV_1011, PARKER_TEV_109

---

## WIC-B034 — Low SH + low airflow

**Setup**
- Low SH + low airflow

**Expected SYSTEM CHECK RESULT**

**Correct evaporator airflow before TXV diagnosis**

**CONFIRMED FINDINGS**
- Evaporator superheat is low.
- Evaporator airflow is low/restricted.

**WHAT THIS MEANS**

Low airflow reduces evaporator load and can lower superheat; the known airflow problem must be corrected before judging TXV feed.

**NEXT ACTION / CHECK**

Correct evaporator airflow, stabilize the system, then recheck superheat.

**EXPECTED TROUBLESHOOTING PATH**
1. Restore airflow.
2. Stabilize.
3. Recheck SH before metering-device adjustment.

**MUST NOT CONCLUDE**
- Do not adjust/replace TXV while evaporator airflow is known abnormal.

**Validated against:** DANFOSS_COLD_ROOM, PARKER_TEV_1011

---

## WIC-B035 — Low SH + TXV bulb installation problem

**Setup**
- Low SH + TXV bulb installation problem

**Expected SYSTEM CHECK RESULT**

**Correct TXV bulb installation before adjustment**

**CONFIRMED FINDINGS**
- Evaporator superheat is low.
- TXV bulb installation/contact/location is incorrect.

**WHAT THIS MEANS**

Incorrect bulb installation can distort the TXV temperature signal and contribute to overfeeding/unstable control.

**NEXT ACTION / CHECK**

Correct bulb installation first, then stabilize and recheck superheat before adjusting or replacing the valve.

**EXPECTED TROUBLESHOOTING PATH**
1. Correct bulb.
2. Stabilize.
3. Recheck SH.

**MUST NOT CONCLUDE**
- Do not adjust valve setting before correcting bulb installation.

**Validated against:** PARKER_TEV_1011

---

## WIC-B036 — Low head + sight-glass bubbles

**Setup**
- Low head + sight-glass bubbles

**Expected SYSTEM CHECK RESULT**

**Head-pressure/subcooling condition may be causing flash gas**

**CONFIRMED FINDINGS**
- Condensing pressure is low.
- Sight glass shows bubbles/flashing.

**WHAT THIS MEANS**

Low condensing pressure can reduce available liquid pressure/subcooling and cause vapor in the liquid line even when charge is not low.

**NEXT ACTION / CHECK**

Check ambient/head-pressure control and liquid subcooling before adding refrigerant.

**EXPECTED TROUBLESHOOTING PATH**
1. Check ambient/head control.
2. Check subcooling/liquid line pressure drop.
3. Only then evaluate charge.

**MUST NOT CONCLUDE**
- Do not add refrigerant from bubbles when low head can explain flash gas.

**Validated against:** DANFOSS_SIGHT_GLASS, DANFOSS_LOW_HEAD

---

## WIC-C037 — Cooling demand absent; compressor off

**Setup**
- Cooling demand absent; compressor off

**Expected SYSTEM CHECK RESULT**

**System may be satisfied / no cooling call**

**CONFIRMED FINDINGS**
- Compressor is not running.
- No cooling demand is present.

**WHAT THIS MEANS**

Compressor-off is expected if the controller is not calling for cooling.

**NEXT ACTION / CHECK**

Verify box temperature, setpoint and controller state before troubleshooting the compressor circuit.

**EXPECTED TROUBLESHOOTING PATH**
1. Verify demand/setpoint.
2. If room should be cooling but demand is absent, troubleshoot controller/sensor.

**MUST NOT CONCLUDE**
- Do not diagnose compressor failure when there is no cooling command.

**Validated against:** DANFOSS_COLD_ROOM

---

## WIC-C038 — Cooling demand present + anti-short-cycle active

**Setup**
- Cooling demand present + anti-short-cycle active

**Expected SYSTEM CHECK RESULT**

**Anti-short-cycle delay is preventing restart**

**CONFIRMED FINDINGS**
- Cooling demand is present.
- Anti-short-cycle delay is active.

**WHAT THIS MEANS**

The control is intentionally delaying compressor restart.

**NEXT ACTION / CHECK**

Verify the delay is within the configured time and allow it to expire; if it does not release, troubleshoot the controller/input condition.

**EXPECTED TROUBLESHOOTING PATH**
1. Confirm delay timing.
2. Wait for release.
3. If abnormal, inspect controller/sensor/safety inputs.

**MUST NOT CONCLUDE**
- Do not bypass the delay or condemn compressor/contactor while the delay is legitimately active.

**Validated against:** DANFOSS_COLD_ROOM

---

## WIC-C039 — Cooling demand + contactor coil not energized

**Setup**
- Cooling demand + contactor coil not energized

**Expected SYSTEM CHECK RESULT**

**Control circuit is not energizing the contactor**

**CONFIRMED FINDINGS**
- Cooling demand is present.
- Contactor coil is not energized.

**WHAT THIS MEANS**

The fault is upstream in the control/safety circuit rather than the compressor power output.

**NEXT ACTION / CHECK**

Trace safeties, thermostat/controller output and control voltage to the contactor coil.

**EXPECTED TROUBLESHOOTING PATH**
1. Check safeties.
2. Check control voltage/output.
3. Repair wiring/control fault.

**MUST NOT CONCLUDE**
- Do not replace the compressor or contactor contacts before establishing why the coil is not energized.

**Validated against:** DANFOSS_COLD_ROOM

---

## WIC-C040 — Contactor coil energized but no output voltage

**Setup**
- Contactor coil energized but no output voltage

**Expected SYSTEM CHECK RESULT**

**Contactor is not passing power**

**CONFIRMED FINDINGS**
- Contactor coil is energized.
- Contactor output is not passing voltage.

**WHAT THIS MEANS**

The contactor is commanded on but power is not reaching the load side, indicating contact/power-path trouble.

**NEXT ACTION / CHECK**

Verify line-side voltage and contact condition; replace/repair the contactor or upstream power path as required.

**EXPECTED TROUBLESHOOTING PATH**
1. Check line voltage.
2. Check contacts/load-side voltage.
3. Correct contactor/power-path fault.

**MUST NOT CONCLUDE**
- Do not condemn the compressor before restoring correct terminal voltage.

**Validated against:** DANFOSS_COLD_ROOM

---

## WIC-C041 — Fuse open/blown

**Setup**
- Fuse open/blown

**Expected SYSTEM CHECK RESULT**

**Open fuse / power-path fault**

**CONFIRMED FINDINGS**
- Fuse is open/blown.

**WHAT THIS MEANS**

The open protective device interrupts power; the reason for the fuse opening must be investigated before replacement/restart.

**NEXT ACTION / CHECK**

With power isolated, inspect the protected circuit for shorts/ground faults/overcurrent causes and verify component condition before replacing the fuse with the correct rating.

**EXPECTED TROUBLESHOOTING PATH**
1. Find cause of overcurrent/open fuse.
2. Correct fault.
3. Replace with correct protection and verify operation.

**MUST NOT CONCLUDE**
- Do not simply replace repeatedly opening fuses without finding the cause.

**Validated against:** DANFOSS_COLD_ROOM

---

## WIC-C042 — Compressor overload open/hot compressor

**Setup**
- Compressor overload open/hot compressor

**Expected SYSTEM CHECK RESULT**

**Compressor overload protection is open**

**CONFIRMED FINDINGS**
- Compressor is hot.
- Overload protection is open/tripped.

**WHAT THIS MEANS**

The compressor has been protected from an abnormal thermal/electrical condition; causes can include high compression ratio, high head, low suction, electrical problems or cooling/feed issues.

**NEXT ACTION / CHECK**

Allow safe cooling as required, then find the cause by checking supply voltage/current, condenser airflow/high side, suction/feed and start components before restarting.

**EXPECTED TROUBLESHOOTING PATH**
1. Check electrical supply/current.
2. Check high-side heat rejection.
3. Check suction/feed and start components.
4. Restart only after cause is corrected.

**MUST NOT CONCLUDE**
- Do not repeatedly reset/force operation without finding the overheating cause.

**Validated against:** DANFOSS_COLD_ROOM

---

## WIC-C043 — HP safety open + dirty condenser

**Setup**
- HP safety open + dirty condenser

**Expected SYSTEM CHECK RESULT**

**Dirty condenser is the first corrective target**

**CONFIRMED FINDINGS**
- HP safety is tripped.
- Condenser coil is dirty/restricted.

**WHAT THIS MEANS**

The known heat-rejection restriction is a credible direct cause of high condensing pressure.

**NEXT ACTION / CHECK**

Clean/restore condenser airflow, then verify safe high-side pressure before resetting/returning to service.

**EXPECTED TROUBLESHOOTING PATH**
1. Restore airflow.
2. Verify fan.
3. Recheck head pressure; then reset per procedure.

**MUST NOT CONCLUDE**
- Do not reset HP safety first and continue running with the condenser restricted.

**Validated against:** DANFOSS_COLD_ROOM

---

## WIC-C044 — HP safety open + condenser fan stopped

**Setup**
- HP safety open + condenser fan stopped

**Expected SYSTEM CHECK RESULT**

**Condenser fan failure is the first corrective target**

**CONFIRMED FINDINGS**
- HP safety is tripped.
- Condenser fan is not running.

**WHAT THIS MEANS**

Loss of condenser airflow can directly cause the high-pressure trip.

**NEXT ACTION / CHECK**

Troubleshoot/restore condenser fan operation, then verify condensing pressure is safe before reset.

**EXPECTED TROUBLESHOOTING PATH**
1. Repair fan fault.
2. Verify airflow.
3. Verify high-side pressure and safe reset.

**MUST NOT CONCLUDE**
- Do not diagnose overcharge before restoring fan operation.

**Validated against:** DANFOSS_COLD_ROOM

---

## WIC-C045 — LP control open during pump-down

**Setup**
- LP control open during pump-down

**Expected SYSTEM CHECK RESULT**

**LP control may be performing normal pump-down control**

**CONFIRMED FINDINGS**
- Liquid-line solenoid is commanded closed.
- Low-pressure control is open.

**WHAT THIS MEANS**

In a pump-down system, the solenoid closes and the compressor pumps suction down until the LP control opens; this can be normal sequence behavior.

**NEXT ACTION / CHECK**

Confirm the system is intentionally in pump-down and verify the solenoid is closed/no longer feeding before treating the open LP control as a fault.

**EXPECTED TROUBLESHOOTING PATH**
1. Confirm pump-down state.
2. Verify solenoid closed/no flow.
3. Verify restart sequence on next cooling call.

**MUST NOT CONCLUDE**
- Do not call the LP control defective solely because it is open at the end of pump-down.

**Validated against:** DANFOSS_COLD_ROOM

---

## WIC-C046 — Solenoid commanded open but no flow

**Setup**
- Solenoid commanded open but no flow

**Expected SYSTEM CHECK RESULT**

**Liquid-line solenoid/flow path is blocking feed**

**CONFIRMED FINDINGS**
- Cooling demand is present.
- Solenoid is commanded open.
- No liquid flow is observed.

**WHAT THIS MEANS**

The evaporator can starve even though the control command is correct; separate coil/voltage from mechanical valve/restriction.

**NEXT ACTION / CHECK**

Check coil voltage; correct voltage with no flow points to coil/valve/mechanical restriction, while no voltage points to control/wiring.

**EXPECTED TROUBLESHOOTING PATH**
1. Check coil voltage.
2. Inspect valve/coil/mechanical path.
3. Verify feed after repair.

**MUST NOT CONCLUDE**
- Do not diagnose low charge before restoring commanded liquid flow.

**Validated against:** DANFOSS_COLD_ROOM

---

## WIC-C047 — Solenoid commanded closed but flow continues

**Setup**
- Solenoid commanded closed but flow continues

**Expected SYSTEM CHECK RESULT**

**Liquid-line solenoid is leaking/stuck open**

**CONFIRMED FINDINGS**
- Solenoid is commanded closed.
- Refrigerant flow continues.

**WHAT THIS MEANS**

A leaking/stuck solenoid can prevent pump-down and allow off-cycle refrigerant migration.

**NEXT ACTION / CHECK**

Verify coil is de-energized; if it is and flow continues, service/replace the leaking/stuck valve.

**EXPECTED TROUBLESHOOTING PATH**
1. Verify command/voltage removed.
2. Service valve if flow continues.
3. Verify pump-down after repair.

**MUST NOT CONCLUDE**
- Do not adjust LP control to compensate for a valve that does not close.

**Validated against:** DANFOSS_COLD_ROOM

---

## WIC-C048 — Sensor error + poor temperature control

**Setup**
- Sensor error + poor temperature control

**Expected SYSTEM CHECK RESULT**

**Control sensor/input problem should be resolved first**

**CONFIRMED FINDINGS**
- Controller/sensor error is present.
- Room temperature control is abnormal.

**WHAT THIS MEANS**

Bad sensor information can make otherwise healthy refrigeration cycle incorrectly.

**NEXT ACTION / CHECK**

Validate sensor resistance/temperature or controller input against manufacturer data and a trusted reference; correct sensor/wiring before refrigeration adjustments.

**EXPECTED TROUBLESHOOTING PATH**
1. Verify sensor/reference.
2. Inspect wiring/input.
3. Correct and retest control.

**MUST NOT CONCLUDE**
- Do not alter charge or TXV setting to compensate for a bad control sensor.

**Validated against:** DANFOSS_COLD_ROOM

---

## WIC-C049 — Compressor running continuously + warm product load

**Setup**
- Compressor running continuously + warm product load

**Expected SYSTEM CHECK RESULT**

**Heavy pull-down load may explain long runtime**

**CONFIRMED FINDINGS**
- Compressor runs continuously.
- Large warm product load is present.

**WHAT THIS MEANS**

Continuous operation can be expected during heavy pull-down if room/product temperature is steadily decreasing and equipment remains within operating limits.

**NEXT ACTION / CHECK**

Confirm pull-down progress, airflow and operating limits; investigate refrigeration capacity only if temperature stops improving or limits are exceeded.

**EXPECTED TROUBLESHOOTING PATH**
1. Trend room/product temp.
2. Check airflow/limits.
3. Escalate if pull-down stalls.

**MUST NOT CONCLUDE**
- Do not call continuous runtime a compressor fault during a legitimate heavy pull-down.

**Validated against:** DANFOSS_COLD_ROOM

---

## WIC-C050 — Compressor running continuously + no abnormal load

**Setup**
- Compressor running continuously + no abnormal load

**Expected SYSTEM CHECK RESULT**

**Cooling capacity problem requires systematic checks**

**CONFIRMED FINDINGS**
- Compressor runs continuously.
- Room is not reaching setpoint.

**WHAT THIS MEANS**

The system is operating but not removing enough heat; airflow, refrigerant feed, compressor performance, controls and sizing must be separated.

**NEXT ACTION / CHECK**

Check room/load and evaporator airflow first, then condenser airflow, refrigerant feed/TXV behavior and compressor capacity.

**EXPECTED TROUBLESHOOTING PATH**
1. Check load/door.
2. Check evap airflow.
3. Check condenser airflow.
4. Check SH/SC/feed.
5. Check compressor capacity/controls/sizing.

**MUST NOT CONCLUDE**
- Do not jump directly to refrigerant charge.

**Validated against:** DANFOSS_COLD_ROOM

---

## WIC-D051 — Iced coil + evap fan stopped

**Setup**
- Iced coil + evap fan stopped

**Expected SYSTEM CHECK RESULT**

**Evaporator fan is not running**

**CONFIRMED FINDINGS**
- Evaporator fan is not operating.
- Evaporator coil is iced.

**WHAT THIS MEANS**

The direct airflow fault can contribute to icing and should be corrected before refrigerant diagnosis.

**NEXT ACTION / CHECK**

Troubleshoot/restore the evaporator fan first; then clear ice and verify normal airflow/defrost before rechecking refrigeration readings.

**EXPECTED TROUBLESHOOTING PATH**
1. Repair fan path.
2. Clear ice.
3. Verify airflow/defrost.
4. Stabilize and remeasure.

**MUST NOT CONCLUDE**
- Do not diagnose low charge from an iced coil with a stopped fan.

**Validated against:** DANFOSS_COLD_ROOM

---

## WIC-D052 — Iced coil + fan normal + defrost incomplete

**Setup**
- Iced coil + fan normal + defrost incomplete

**Expected SYSTEM CHECK RESULT**

**Defrost problem is indicated**

**CONFIRMED FINDINGS**
- Evaporator coil is iced.
- Evaporator fan/airflow is normal during cooling.
- Defrost is incomplete.

**WHAT THIS MEANS**

With cooling airflow normal and defrost incomplete, the defrost system becomes the primary path to investigate.

**NEXT ACTION / CHECK**

Check defrost initiation, heaters/hot-gas operation, termination sensor/control and drain/drain-heater operation as applicable.

**EXPECTED TROUBLESHOOTING PATH**
1. Check defrost initiation.
2. Check heat source/current or hot-gas function.
3. Check termination/control.
4. Check drain; clear ice and verify full defrost.

**MUST NOT CONCLUDE**
- Do not adjust charge before correcting a confirmed defrost failure.

**Validated against:** DANFOSS_COLD_ROOM

---

## WIC-D053 — Iced coil + fan normal + infiltration

**Setup**
- Iced coil + fan normal + infiltration

**Expected SYSTEM CHECK RESULT**

**Air infiltration is a strong contributor to evaporator icing**

**CONFIRMED FINDINGS**
- Evaporator coil is iced.
- Evaporator fan is normal.
- Door/air infiltration is confirmed.

**WHAT THIS MEANS**

Warm humid infiltration adds moisture load that can rapidly frost/ice the evaporator.

**NEXT ACTION / CHECK**

Correct the infiltration path, clear the coil, then verify defrost and normal cooling.

**EXPECTED TROUBLESHOOTING PATH**
1. Repair gasket/door/closure.
2. Clear ice.
3. Verify defrost and room pull-down.

**MUST NOT CONCLUDE**
- Do not treat refrigerant charge as the first cause while infiltration is confirmed.

**Validated against:** DANFOSS_COLD_ROOM

---

## WIC-D054 — Iced coil + drain ice

**Setup**
- Iced coil + drain ice

**Expected SYSTEM CHECK RESULT**

**Drain/drain-heater problem may be contributing to ice**

**CONFIRMED FINDINGS**
- Evaporator coil/pan area is iced.
- Drain ice is present.

**WHAT THIS MEANS**

Water that cannot drain after defrost can refreeze and contribute to recurring ice accumulation.

**NEXT ACTION / CHECK**

Check drain line slope/blockage, drain pan and drain heater operation; correct drainage and then verify defrost completion.

**EXPECTED TROUBLESHOOTING PATH**
1. Clear drain.
2. Verify heater/slope.
3. Run defrost and confirm drainage.

**MUST NOT CONCLUDE**
- Do not assume all recurring ice is refrigerant-side.

**Validated against:** DANFOSS_COLD_ROOM

---

## WIC-D055 — Poor cooling + dirty evap coil

**Setup**
- Poor cooling + dirty evap coil

**Expected SYSTEM CHECK RESULT**

**Evaporator heat transfer is restricted**

**CONFIRMED FINDINGS**
- Room cooling is poor.
- Evaporator coil is dirty/restricted.

**WHAT THIS MEANS**

A dirty evaporator reduces airflow/heat transfer and can mimic refrigerant problems.

**NEXT ACTION / CHECK**

Clean the evaporator and verify fan/airflow; then stabilize and reassess box temperature and refrigeration readings.

**EXPECTED TROUBLESHOOTING PATH**
1. Clean coil.
2. Verify airflow.
3. Stabilize/recheck.

**MUST NOT CONCLUDE**
- Do not add refrigerant before correcting known evaporator heat-transfer restriction.

**Validated against:** DANFOSS_COLD_ROOM

---

## WIC-D056 — Poor cooling + dirty condenser

**Setup**
- Poor cooling + dirty condenser

**Expected SYSTEM CHECK RESULT**

**Condenser heat rejection is restricted**

**CONFIRMED FINDINGS**
- Room cooling is poor.
- Condenser coil is dirty/restricted.

**WHAT THIS MEANS**

Poor condenser heat rejection can reduce capacity and raise condensing pressure.

**NEXT ACTION / CHECK**

Clean condenser/restore airflow, then stabilize and reassess capacity and high-side readings.

**EXPECTED TROUBLESHOOTING PATH**
1. Restore heat rejection.
2. Stabilize.
3. Recheck.

**MUST NOT CONCLUDE**
- Do not diagnose charge before correcting known condenser restriction.

**Validated against:** DANFOSS_COLD_ROOM

---

## WIC-D057 — Poor cooling + door infiltration

**Setup**
- Poor cooling + door infiltration

**Expected SYSTEM CHECK RESULT**

**Room load/infiltration should be corrected first**

**CONFIRMED FINDINGS**
- Room cooling is poor.
- Door/air infiltration is confirmed.

**WHAT THIS MEANS**

Excess warm/moist air load can prevent the room from reaching setpoint even when refrigeration is functional.

**NEXT ACTION / CHECK**

Correct infiltration and monitor pull-down before refrigeration adjustments.

**EXPECTED TROUBLESHOOTING PATH**
1. Correct door/gasket.
2. Monitor temperature trend.
3. Investigate cycle only if still inadequate.

**MUST NOT CONCLUDE**
- Do not add charge to compensate for building-envelope load.

**Validated against:** DANFOSS_COLD_ROOM

---

## WIC-D058 — Poor cooling + high warm product load

**Setup**
- Poor cooling + high warm product load

**Expected SYSTEM CHECK RESULT**

**High load may explain slow pull-down**

**CONFIRMED FINDINGS**
- Room cooling is slow.
- Large warm product load is present.

**WHAT THIS MEANS**

A legitimate high product load increases pull-down time and compressor runtime.

**NEXT ACTION / CHECK**

Verify temperature is trending downward and system remains within operating limits; investigate capacity only if pull-down stalls.

**EXPECTED TROUBLESHOOTING PATH**
1. Trend temperature.
2. Verify airflow/limits.
3. Escalate if no progress.

**MUST NOT CONCLUDE**
- Do not call a fault solely from slow pull-down under known heavy load.

**Validated against:** DANFOSS_COLD_ROOM

---

## WIC-D059 — Defrost state + abnormal SH reading

**Setup**
- Defrost state + abnormal SH reading

**Expected SYSTEM CHECK RESULT**

**Do not apply steady-cooling refrigerant diagnosis during defrost**

**CONFIRMED FINDINGS**
- System is in defrost.
- A refrigeration measurement appears abnormal.

**WHAT THIS MEANS**

Pressures/temperatures during defrost do not represent ordinary steady cooling and should not be used as normal charging/TXV evidence.

**NEXT ACTION / CHECK**

Complete defrost, allow post-defrost recovery, then obtain stabilized cooling measurements before refrigerant diagnosis.

**EXPECTED TROUBLESHOOTING PATH**
1. Finish defrost.
2. Allow recovery.
3. Measure in stable cooling.

**MUST NOT CONCLUDE**
- Do not diagnose charge/TXV from defrost readings.

**Validated against:** DANFOSS_COLD_ROOM

---

## WIC-D060 — Startup state + abnormal pressures

**Setup**
- Startup state + abnormal pressures

**Expected SYSTEM CHECK RESULT**

**Allow startup stabilization before diagnosis**

**CONFIRMED FINDINGS**
- System has just started.
- Pressure readings are not yet stabilized.

**WHAT THIS MEANS**

Transient startup pressures can differ substantially from steady cooling.

**NEXT ACTION / CHECK**

Verify normal startup and allow readings to stabilize before applying pressure/SH/SC diagnostic patterns.

**EXPECTED TROUBLESHOOTING PATH**
1. Observe startup.
2. Allow stabilization.
3. Then measure.

**MUST NOT CONCLUDE**
- Do not diagnose charge from immediate startup readings.

**Validated against:** DANFOSS_COLD_ROOM

---

## WIC-D061 — Satisfied/off state + low suction

**Setup**
- Satisfied/off state + low suction

**Expected SYSTEM CHECK RESULT**

**Operating state explains why steady-cooling pressure rules do not apply**

**CONFIRMED FINDINGS**
- Cooling demand is satisfied/off.
- Suction pressure is low/off-cycle.

**WHAT THIS MEANS**

Off-cycle/pump-down/satisfied pressures are not interpreted like active stable cooling.

**NEXT ACTION / CHECK**

Confirm the control state and obtain readings during a normal cooling call if refrigeration diagnosis is needed.

**EXPECTED TROUBLESHOOTING PATH**
1. Confirm satisfied/off.
2. Wait for normal call.
3. Measure during stable cooling.

**MUST NOT CONCLUDE**
- Do not diagnose starvation from off-cycle suction pressure.

**Validated against:** DANFOSS_COLD_ROOM

---

## WIC-D062 — Post-defrost recovery + unstable readings

**Setup**
- Post-defrost recovery + unstable readings

**Expected SYSTEM CHECK RESULT**

**Allow post-defrost recovery before steady-state diagnosis**

**CONFIRMED FINDINGS**
- System is recovering from defrost.
- Readings are unstable.

**WHAT THIS MEANS**

Post-defrost load and refrigerant distribution are transient.

**NEXT ACTION / CHECK**

Allow normal cooling recovery until temperatures/pressures stabilize, then evaluate SH/SC and pressures.

**EXPECTED TROUBLESHOOTING PATH**
1. Allow recovery.
2. Verify fan/control sequence.
3. Measure when stable.

**MUST NOT CONCLUDE**
- Do not diagnose charge/TXV from immediate post-defrost readings.

**Validated against:** DANFOSS_COLD_ROOM

---

## WIC-E063 — Evap fan stopped + dirty condenser

**Setup**
- Evap fan stopped + dirty condenser

**Expected SYSTEM CHECK RESULT**

**Evaporator fan is not running**

**CONFIRMED FINDINGS**
- Evaporator fan is not operating.
- Condenser coil is dirty/restricted.

**WHAT THIS MEANS**

Two independent airflow faults are present. The evaporator fan is the immediate primary action, but the condenser restriction must remain active.

**OTHER ACTIVE FINDINGS**
- Condenser coil is dirty/restricted.

**NEXT ACTION / CHECK**

Troubleshoot/restore the evaporator fan first. Keep the dirty condenser as an active finding and correct it before final refrigeration measurements.

**EXPECTED TROUBLESHOOTING PATH**
1. Repair evap fan.
2. Correct condenser restriction.
3. Then stabilize and recheck system.

**MUST NOT CONCLUDE**
- Do not drop/forget the dirty condenser after selecting the evaporator fan as primary.

**Validated against:** DANFOSS_COLD_ROOM

---

## WIC-E064 — Condenser fan stopped + dirty condenser

**Setup**
- Condenser fan stopped + dirty condenser

**Expected SYSTEM CHECK RESULT**

**Condenser airflow has multiple confirmed faults**

**CONFIRMED FINDINGS**
- Condenser fan is not operating.
- Condenser coil is dirty/restricted.

**WHAT THIS MEANS**

Both findings reduce condenser airflow/heat rejection and can coexist.

**OTHER ACTIVE FINDINGS**
- Condenser coil is dirty/restricted.

**NEXT ACTION / CHECK**

Restore fan operation and clean the condenser; then verify airflow and recheck high-side conditions.

**EXPECTED TROUBLESHOOTING PATH**
1. Repair fan.
2. Clean coil.
3. Verify airflow/high side.

**MUST NOT CONCLUDE**
- Do not choose charge diagnosis before both known airflow faults are corrected.

**Validated against:** DANFOSS_COLD_ROOM

---

## WIC-E065 — Evap fan stopped + high SH

**Setup**
- Evap fan stopped + high SH

**Expected SYSTEM CHECK RESULT**

**Evaporator fan fault must be corrected before interpreting high SH**

**CONFIRMED FINDINGS**
- Evaporator fan is not operating.
- Evaporator superheat is high.

**WHAT THIS MEANS**

Abnormal airflow changes evaporator load and makes refrigerant-side interpretation unreliable.

**NEXT ACTION / CHECK**

Restore evaporator airflow first, then stabilize and remeasure superheat before diagnosing charge/TXV.

**EXPECTED TROUBLESHOOTING PATH**
1. Repair fan.
2. Clear ice if needed.
3. Stabilize and remeasure SH.

**MUST NOT CONCLUDE**
- Do not diagnose low charge/TXV from high SH while fan is stopped.

**Validated against:** DANFOSS_COLD_ROOM

---

## WIC-E066 — Dirty condenser + high head + high SC

**Setup**
- Dirty condenser + high head + high SC

**Expected SYSTEM CHECK RESULT**

**Correct condenser airflow before charge diagnosis**

**CONFIRMED FINDINGS**
- Condenser coil is dirty/restricted.
- Condensing pressure is high.
- Subcooling is high.

**WHAT THIS MEANS**

The known heat-rejection fault can alter high-side pressure/subcooling; correct it before deciding overcharge.

**NEXT ACTION / CHECK**

Clean/restore condenser airflow, stabilize, then reassess high head/high SC; only then evaluate charge/noncondensables.

**EXPECTED TROUBLESHOOTING PATH**
1. Correct condenser.
2. Stabilize.
3. Recheck high side/SC.

**MUST NOT CONCLUDE**
- Do not recover refrigerant before correcting the known condenser restriction.

**Validated against:** DANFOSS_COLD_ROOM

---

## WIC-E067 — High SH + low SC + drier restriction evidence

**Setup**
- High SH + low SC + drier restriction evidence

**Expected SYSTEM CHECK RESULT**

**Localized filter-drier restriction outranks generic charge pattern**

**CONFIRMED FINDINGS**
- Evaporator superheat is high.
- Subcooling is low/minimal.
- A significant temperature drop exists across the filter drier.

**WHAT THIS MEANS**

Low SC can suggest low inventory, but localized drier evidence directly identifies a restriction that can starve the evaporator and create flash gas.

**NEXT ACTION / CHECK**

Correct the filter-drier restriction first, then stabilize and reevaluate SH/SC/liquid condition before judging charge.

**EXPECTED TROUBLESHOOTING PATH**
1. Service drier.
2. Stabilize.
3. Recheck SH/SC and leak/charge evidence.

**MUST NOT CONCLUDE**
- Do not let the generic high-SH/low-SC pattern override localized restriction evidence.

**Validated against:** DANFOSS_COLD_ROOM

---

## WIC-E068 — High SH + low SC + confirmed leak evidence

**Setup**
- High SH + low SC + confirmed leak evidence

**Expected SYSTEM CHECK RESULT**

**Low refrigerant inventory is strongly supported**

**CONFIRMED FINDINGS**
- Evaporator superheat is high.
- Applicable subcooling is low.
- Leak/oil evidence is present.

**WHAT THIS MEANS**

The starvation pattern plus independent leak evidence strongly supports refrigerant loss/low inventory, assuming airflow and operating state are valid.

**NEXT ACTION / CHECK**

Locate and repair the leak, then evacuate/charge by approved procedure and verify SH/SC/pressures.

**EXPECTED TROUBLESHOOTING PATH**
1. Leak test/localize.
2. Repair.
3. Evacuate/recharge correctly.
4. Verify operation.

**MUST NOT CONCLUDE**
- Do not simply top off refrigerant without addressing the leak.

**Validated against:** DANFOSS_COLD_ROOM

---

## WIC-E069 — High head + fan stopped + suspected overcharge

**Setup**
- High head + fan stopped + suspected overcharge

**Expected SYSTEM CHECK RESULT**

**Condenser fan failure is the first priority**

**CONFIRMED FINDINGS**
- Condenser fan is not operating.
- Condensing pressure is high.
- Charge is suspected high.

**WHAT THIS MEANS**

The direct airflow fault can cause high head and must be corrected before charge is judged.

**NEXT ACTION / CHECK**

Repair/restore condenser fan first; then stabilize and reassess head/subcooling/receiver condition.

**EXPECTED TROUBLESHOOTING PATH**
1. Repair fan.
2. Stabilize.
3. Reassess charge evidence.

**MUST NOT CONCLUDE**
- Do not recover refrigerant before restoring condenser airflow.

**Validated against:** DANFOSS_COLD_ROOM

---

## WIC-E070 — Sight-glass bubbles + low SC + drier ΔT

**Setup**
- Sight-glass bubbles + low SC + drier ΔT

**Expected SYSTEM CHECK RESULT**

**Liquid-line restriction is strongly indicated**

**CONFIRMED FINDINGS**
- Sight glass shows bubbles.
- Subcooling is low/minimal.
- Temperature/pressure drop is localized across the filter drier.

**WHAT THIS MEANS**

The bubbles and low liquid margin are explained by a localized pressure drop at the drier; this evidence outranks bubbles as a generic low-charge clue.

**NEXT ACTION / CHECK**

Correct the drier restriction, then stabilize and reassess liquid condition/subcooling before charge decisions.

**EXPECTED TROUBLESHOOTING PATH**
1. Service drier.
2. Verify clear liquid.
3. Recheck SC/SH.

**MUST NOT CONCLUDE**
- Do not add refrigerant before correcting the localized restriction.

**Validated against:** DANFOSS_COLD_ROOM

---

## WIC-E071 — TXV bulb bad + drier restriction

**Setup**
- TXV bulb bad + drier restriction

**Expected SYSTEM CHECK RESULT**

**Two liquid-feed problems are active**

**CONFIRMED FINDINGS**
- TXV bulb installation is incorrect.
- Filter-drier restriction evidence is present.

**WHAT THIS MEANS**

Both faults can affect evaporator feed. The localized restriction and known bulb fault should both be corrected before final TXV/charge judgment.

**OTHER ACTIVE FINDINGS**
- TXV sensing-bulb problem remains active until corrected.

**NEXT ACTION / CHECK**

Correct the filter-drier restriction and bulb installation, then stabilize and recheck superheat/liquid condition.

**EXPECTED TROUBLESHOOTING PATH**
1. Correct drier.
2. Correct bulb.
3. Stabilize/recheck.

**MUST NOT CONCLUDE**
- Do not assume one finding makes the other disappear.

**Validated against:** DANFOSS_COLD_ROOM

---

## WIC-E072 — Iced coil + dirty condenser

**Setup**
- Iced coil + dirty condenser

**Expected SYSTEM CHECK RESULT**

**Multiple heat-transfer faults are present**

**CONFIRMED FINDINGS**
- Evaporator coil is iced.
- Condenser coil is dirty/restricted.

**WHAT THIS MEANS**

Both sides have confirmed heat-transfer problems; refrigeration readings will not represent normal operation until they are corrected.

**OTHER ACTIVE FINDINGS**
- Condenser coil is dirty/restricted.

**NEXT ACTION / CHECK**

Address evaporator icing cause/airflow and condenser cleanliness, then run stable cooling and collect fresh readings.

**EXPECTED TROUBLESHOOTING PATH**
1. Correct evap icing cause.
2. Clean condenser.
3. Stabilize/retest.

**MUST NOT CONCLUDE**
- Do not perform charge diagnosis with both heat exchangers compromised.

**Validated against:** DANFOSS_COLD_ROOM

---

## WIC-E073 — Compressor off + no cooling demand + dirty condenser

**Setup**
- Compressor off + no cooling demand + dirty condenser

**Expected SYSTEM CHECK RESULT**

**No compressor fault is established; condenser maintenance finding remains**

**CONFIRMED FINDINGS**
- No cooling demand is present.
- Compressor is off.
- Condenser is dirty.

**WHAT THIS MEANS**

Compressor-off is expected without a call, while the dirty condenser is a separate maintenance/heat-rejection issue.

**OTHER ACTIVE FINDINGS**
- Condenser coil is dirty/restricted.

**NEXT ACTION / CHECK**

Correct/clean the condenser as needed and verify compressor operation on the next legitimate cooling call.

**EXPECTED TROUBLESHOOTING PATH**
1. Clean condenser.
2. Wait for/command valid cooling call.
3. Verify normal operation.

**MUST NOT CONCLUDE**
- Do not diagnose compressor failure because it is off with no demand.

**Validated against:** DANFOSS_COLD_ROOM

---

## WIC-E074 — High SH + TXV bulb bad + equalizer issue

**Setup**
- High SH + TXV bulb bad + equalizer issue

**Expected SYSTEM CHECK RESULT**

**Multiple TXV input problems are present**

**CONFIRMED FINDINGS**
- Evaporator superheat is high.
- TXV bulb installation is incorrect.
- External equalizer problem is present.

**WHAT THIS MEANS**

Both TXV sensing inputs can cause incorrect valve feed and must be corrected before charge or valve replacement decisions.

**OTHER ACTIVE FINDINGS**
- TXV external-equalizer problem remains active.

**NEXT ACTION / CHECK**

Correct bulb installation and equalizer condition, then stabilize and recheck superheat.

**EXPECTED TROUBLESHOOTING PATH**
1. Correct bulb.
2. Correct equalizer.
3. Stabilize/recheck.

**MUST NOT CONCLUDE**
- Do not add charge or replace TXV before correcting both known input faults.

**Validated against:** DANFOSS_COLD_ROOM

---

## WIC-E075 — High head + dirty condenser + high ambient

**Setup**
- High head + dirty condenser + high ambient

**Expected SYSTEM CHECK RESULT**

**Known condenser restriction should be corrected; ambient remains context**

**CONFIRMED FINDINGS**
- Condensing pressure is high.
- Condenser coil is dirty/restricted.
- Ambient temperature is high.

**WHAT THIS MEANS**

Both dirty coil and high ambient raise condensing conditions; the correctable restriction should be addressed first, then pressure judged against ambient.

**OTHER ACTIVE FINDINGS**
- High ambient remains an operating condition.

**NEXT ACTION / CHECK**

Clean/restore condenser airflow, then stabilize and compare condensing temperature/split to the high ambient condition.

**EXPECTED TROUBLESHOOTING PATH**
1. Clean condenser.
2. Stabilize.
3. Judge high side versus ambient.

**MUST NOT CONCLUDE**
- Do not diagnose overcharge without correcting airflow and accounting for ambient.

**Validated against:** DANFOSS_COLD_ROOM

---

## WIC-E076 — Low suction + iced coil

**Setup**
- Low suction + iced coil

**Expected SYSTEM CHECK RESULT**

**Icing/airflow must be resolved before suction diagnosis**

**CONFIRMED FINDINGS**
- Suction pressure is low.
- Evaporator coil is iced.

**WHAT THIS MEANS**

Ice restricts airflow/load and can drive suction abnormal; refrigerant diagnosis is unreliable until the coil is clear and cause corrected.

**NEXT ACTION / CHECK**

Diagnose/correct icing cause, clear coil, then stabilize and remeasure suction/SH.

**EXPECTED TROUBLESHOOTING PATH**
1. Check fan/defrost/infiltration.
2. Clear ice.
3. Remeasure.

**MUST NOT CONCLUDE**
- Do not call low charge from low suction with a heavily iced evaporator.

**Validated against:** DANFOSS_COLD_ROOM

---

## WIC-E077 — Low suction + solenoid not opening

**Setup**
- Low suction + solenoid not opening

**Expected SYSTEM CHECK RESULT**

**Liquid-line solenoid fault explains starvation direction**

**CONFIRMED FINDINGS**
- Suction pressure is low.
- Liquid-line solenoid is not opening.

**WHAT THIS MEANS**

A closed solenoid can directly restrict liquid feed and cause low suction/starvation.

**NEXT ACTION / CHECK**

Troubleshoot solenoid command/voltage/valve operation first, then recheck suction and SH after flow is restored.

**EXPECTED TROUBLESHOOTING PATH**
1. Check command.
2. Check voltage/valve.
3. Restore flow/retest.

**MUST NOT CONCLUDE**
- Do not add refrigerant to correct starvation caused by a closed solenoid.

**Validated against:** DANFOSS_COLD_ROOM

---

## WIC-E078 — High suction + low head + high room load

**Setup**
- High suction + low head + high room load

**Expected SYSTEM CHECK RESULT**

**Load context must be separated from compressor inefficiency**

**CONFIRMED FINDINGS**
- Suction pressure is high.
- Condensing pressure is low.
- Room/product load is high.

**WHAT THIS MEANS**

High load can raise suction, while low head may reflect ambient/head-control conditions; compressor inefficiency is not proven.

**NEXT ACTION / CHECK**

Check ambient/head-pressure control and compressor differential/current while tracking pull-down before condemning the compressor.

**EXPECTED TROUBLESHOOTING PATH**
1. Check ambient/head control.
2. Trend load/pull-down.
3. Check compressor differential/current.

**MUST NOT CONCLUDE**
- Do not condemn compressor from high suction/low head without load and ambient context.

**Validated against:** DANFOSS_COLD_ROOM

---

## WIC-E079 — Conflicting charge clues: high SH + low SC + high head

**Setup**
- Conflicting charge clues: high SH + low SC + high head

**Expected SYSTEM CHECK RESULT**

**Evidence is conflicting; do not force a charge diagnosis**

**CONFIRMED FINDINGS**
- Superheat is high.
- Subcooling is low.
- Condensing pressure is high.

**WHAT THIS MEANS**

The pattern does not cleanly support one simple charge fault; airflow, ambient, restriction, measurement validity and possible multiple faults must be checked.

**NEXT ACTION / CHECK**

Verify operating state and measurement validity, then check condenser airflow/ambient and localized liquid-line restriction before charge adjustment.

**EXPECTED TROUBLESHOOTING PATH**
1. Validate readings/state.
2. Check condenser side.
3. Check restriction evidence.
4. Then reassess charge.

**MUST NOT CONCLUDE**
- Do not force undercharge or overcharge diagnosis from conflicting evidence.

**Validated against:** DANFOSS_COLD_ROOM

---

## WIC-E080 — Unknown operating state + direct physical fault

**Setup**
- Unknown operating state + direct physical fault

**Expected SYSTEM CHECK RESULT**

**Direct physical fault should outrank unknown operating state**

**CONFIRMED FINDINGS**
- A directly observed component fault is present.
- Operating state is unknown.

**WHAT THIS MEANS**

Operating state still matters for interpreting refrigeration measurements, but it should not block action on a directly observed physical fault.

**NEXT ACTION / CHECK**

Address the direct physical fault first; establish stable cooling before using SH/SC/pressure patterns afterward.

**EXPECTED TROUBLESHOOTING PATH**
1. Correct direct fault.
2. Establish valid operating state.
3. Then measure/reassess.

**MUST NOT CONCLUDE**
- Do not make “establish operating state” the primary headline when an actionable physical fault is already known.

**Validated against:** DANFOSS_COLD_ROOM

---
