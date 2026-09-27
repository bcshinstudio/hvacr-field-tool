# WIC Challenge Validation Suite v1

**Frozen Brain:** 2.0.10. Expected answers were defined before running the challenge runner.

## CH-F001 — Startup after long off-cycle; migration risk

**Setup facts:** `FACT_COMPRESSOR_HOT`

**SYSTEM CHECK RESULT:** Refrigerant migration / startup floodback risk must be considered

**CONFIRMED FINDINGS**
- Long off-cycle/startup context requires compressor protection reasoning

**WHAT THIS MEANS**
Liquid refrigerant can migrate to the crankcase during extended shutdown and cause slugging or oil dilution at startup.

**NEXT ACTION / CHECK**
Before condemning the compressor, verify crankcase heater operation, off-cycle conditions, oil condition and startup behavior.

**EXPECTED TROUBLESHOOTING PATH**
1. Verify crankcase heater and off-cycle protection
1. Observe startup for liquid return/slugging evidence
1. Correct migration source before repeated starts

**MUST NOT CONCLUDE**
- Do not repeatedly restart a compressor showing liquid slugging symptoms.

**Sources:** Copeland Refrigeration Manual AE-104

## CH-F002 — Post-defrost liquid return risk

**Setup facts:** `FACT_POST_DEFROST_ACTIVE, FACT_EVAP_SH_LOW`

**SYSTEM CHECK RESULT:** Post-defrost liquid return / floodback risk

**CONFIRMED FINDINGS**
- Post-defrost recovery is active
- Superheat is low

**WHAT THIS MEANS**
Liquid condensed in the evaporator/suction line during defrost can return on restart.

**NEXT ACTION / CHECK**
Allow controlled post-defrost recovery; verify fan delay, superheat and liquid return before judging charge.

**EXPECTED TROUBLESHOOTING PATH**
1. Verify fan-delay sequence
1. Watch superheat during recovery
1. Check accumulator/piping if floodback persists

**MUST NOT CONCLUDE**
- Do not add refrigerant because post-defrost suction behavior looks abnormal.

**Sources:** Copeland Refrigeration Manual AE-104

## CH-F003 — Low SH with normal airflow and load

**Setup facts:** `FACT_EVAP_SH_LOW, FACT_AIRFLOW_VERIFIED_NORMAL`

**SYSTEM CHECK RESULT:** Overfeeding / floodback direction

**CONFIRMED FINDINGS**
- Superheat is low
- Airflow is verified normal

**WHAT THIS MEANS**
With airflow/load not explaining low SH, refrigerant overfeed or TXV/control causes move up the list.

**NEXT ACTION / CHECK**
Check TXV bulb, equalizer, valve response and charge/liquid conditions before adjusting the valve.

**EXPECTED TROUBLESHOOTING PATH**
1. Verify bulb mounting
1. Verify equalizer
1. Test valve response
1. Check charge only with applicable method

**MUST NOT CONCLUDE**
- Do not adjust TXV solely from one low-SH reading.

**Sources:** Parker Sporlan Bulletin 10-11

## CH-F004 — Compressor running but weak pressure separation

**Setup facts:** `FACT_COMPRESSOR_RUNNING, FACT_COMPRESSOR_PRESSURE_DIFFERENTIAL_WEAK, FACT_CAPACITY_POOR`

**SYSTEM CHECK RESULT:** Compressor pumping efficiency is suspect

**CONFIRMED FINDINGS**
- Compressor is running
- Pressure differential is weak
- Capacity is poor

**WHAT THIS MEANS**
A running compressor that cannot develop expected pressure separation may have internal leakage or mechanical inefficiency.

**NEXT ACTION / CHECK**
Verify load, airflow, feed and measurement accuracy, then compare suction/discharge performance with model data before condemning compressor.

**EXPECTED TROUBLESHOOTING PATH**
1. Verify external causes first
1. Compare model-specific performance
1. Check valve/internal leakage evidence

**MUST NOT CONCLUDE**
- Do not condemn compressor from suction pressure alone.

**Sources:** Copeland Refrigeration Manual AE-104

## CH-F005 — Weak compressor differential with valve leakage evidence

**Setup facts:** `FACT_COMPRESSOR_RUNNING, FACT_COMPRESSOR_PRESSURE_DIFFERENTIAL_WEAK, FACT_COMPRESSOR_VALVE_LEAKAGE_EVIDENCE`

**SYSTEM CHECK RESULT:** Internal compressor leakage strongly indicated

**CONFIRMED FINDINGS**
- Weak pumping differential
- Internal valve leakage evidence is present

**WHAT THIS MEANS**
Localized internal leakage evidence strengthens compressor inefficiency diagnosis.

**NEXT ACTION / CHECK**
Confirm electrical/load conditions and model performance, then plan compressor repair/replacement per manufacturer procedure.

**EXPECTED TROUBLESHOOTING PATH**
1. Confirm evidence
1. Protect system from contamination
1. Repair/replace and verify pressures

**MUST NOT CONCLUDE**
- Do not add refrigerant to compensate for weak pumping.

**Sources:** Copeland Refrigeration Manual AE-104

## CH-F006 — Hot compressor with high compression ratio direction

**Setup facts:** `FACT_COMPRESSOR_HOT, FACT_EVAP_SAT_LOW, FACT_COND_SAT_HIGH`

**SYSTEM CHECK RESULT:** Compressor overheating / high compression-ratio condition

**CONFIRMED FINDINGS**
- Compressor is hot
- Low evaporating pressure
- High condensing pressure

**WHAT THIS MEANS**
Large pressure ratio increases compressor stress and discharge temperature.

**NEXT ACTION / CHECK**
Correct suction-side starvation/load and high-side heat-rejection causes before repeated operation.

**EXPECTED TROUBLESHOOTING PATH**
1. Check evaporator feed/airflow
1. Check condenser airflow/head
1. Verify discharge temperature/current

**MUST NOT CONCLUDE**
- Do not treat compressor overheating as a compressor-only fault.

**Sources:** Copeland Refrigeration Manual AE-104, Danfoss Cold Room Troubleshooting

## CH-F007 — Overload open on hot compressor after floodback history

**Setup facts:** `FACT_OVERLOAD_PROTECTION_OPEN, FACT_COMPRESSOR_HOT, FACT_EVAP_SH_LOW`

**SYSTEM CHECK RESULT:** Protection trip; root cause still unresolved

**CONFIRMED FINDINGS**
- Overload is open
- Compressor is hot
- Low SH/floodback clue exists

**WHAT THIS MEANS**
Protection opening is an effect; liquid return and overheating causes must be investigated.

**NEXT ACTION / CHECK**
Let protection reset safely, then diagnose floodback, voltage/current and cooling conditions before restart.

**EXPECTED TROUBLESHOOTING PATH**
1. Find reason for overload
1. Check liquid return
1. Check electrical supply/current

**MUST NOT CONCLUDE**
- Do not bypass the overload.

**Sources:** Copeland Refrigeration Manual AE-104

## CH-F008 — High discharge temperature with low suction

**Setup facts:** `FACT_COMPRESSOR_HIGH_DLT, FACT_EVAP_SAT_LOW, FACT_EVAP_SH_HIGH`

**SYSTEM CHECK RESULT:** High discharge-temperature risk with starved evaporator

**CONFIRMED FINDINGS**
- Discharge temperature is high
- Suction/evaporating condition is low
- SH is high

**WHAT THIS MEANS**
Starvation/high compression ratio can overheat the compressor.

**NEXT ACTION / CHECK**
Find the starvation cause and restore proper suction conditions before extended operation.

**EXPECTED TROUBLESHOOTING PATH**
1. Check liquid supply
1. Check restrictions/TXV
1. Verify condenser side
1. Recheck DLT after repair

**MUST NOT CONCLUDE**
- Do not continue running solely to gather more readings if temperature exceeds manufacturer limit.

**Sources:** Copeland Refrigeration Manual AE-104, Parker Sporlan Bulletin 10-11

## CH-F009 — High compressor current with high head

**Setup facts:** `FACT_COMPRESSOR_HIGH_CURRENT, FACT_COND_SAT_HIGH`

**SYSTEM CHECK RESULT:** High compressor load associated with high condensing pressure

**CONFIRMED FINDINGS**
- Compressor current is high
- Head/condensing pressure is high

**WHAT THIS MEANS**
High condensing pressure can raise compressor workload/current.

**NEXT ACTION / CHECK**
Correct high-head cause first, then recheck current against nameplate/model limits.

**EXPECTED TROUBLESHOOTING PATH**
1. Check condenser airflow
1. Check ambient/recirculation
1. Check charge/noncondensables if airflow normal

**MUST NOT CONCLUDE**
- Do not replace compressor before correcting high head.

**Sources:** Danfoss Ref Tools - Head pressure too high, Copeland Refrigeration Manual AE-104

## CH-F010 — Compressor terminal voltage present but no start; start fault localized

**Setup facts:** `FACT_COOLING_DEMAND_PRESENT, FACT_COMPRESSOR_TERMINAL_VOLTAGE_PRESENT, FACT_START_COMPONENT_FAULT`

**SYSTEM CHECK RESULT:** Compressor start-component fault localized

**CONFIRMED FINDINGS**
- Cooling demand exists
- Correct terminal voltage is present
- Start component fault is localized

**WHAT THIS MEANS**
The control circuit is delivering power; the localized start component is the next repair target.

**NEXT ACTION / CHECK**
Correct the start-component fault and verify compressor starts normally without bypassing protection.

**EXPECTED TROUBLESHOOTING PATH**
1. Replace/repair applicable start component
1. Verify current and pressures after start

**MUST NOT CONCLUDE**
- Do not replace compressor before correcting the localized start component fault.

**Sources:** Copeland Refrigeration Manual AE-104

## CH-H011 — Low ambient with head control installed and low head

**Setup facts:** `FACT_LOW_AMBIENT, FACT_HEAD_CONTROL_INSTALLED, FACT_COND_SAT_LOW`

**SYSTEM CHECK RESULT:** Low-ambient head-pressure control needs evaluation

**CONFIRMED FINDINGS**
- Ambient is low
- Head control is installed
- Condensing pressure is low

**WHAT THIS MEANS**
Low ambient can reduce head pressure enough to impair liquid feed unless the control maintains design conditions.

**NEXT ACTION / CHECK**
Check head-pressure-control operation and manufacturer target before changing refrigerant charge.

**EXPECTED TROUBLESHOOTING PATH**
1. Verify control setting/operation
1. Verify receiver/liquid condition
1. Use model-specific target

**MUST NOT CONCLUDE**
- Do not diagnose low charge from low head alone in low ambient.

**Sources:** Danfoss Cold Room Troubleshooting, Parker Sporlan Superheat Control Bulletin 100-50-5.1

## CH-H012 — Head-control flood charge insufficient

**Setup facts:** `FACT_LOW_AMBIENT, FACT_HEAD_CONTROL_INSTALLED, FACT_HEAD_CONTROL_FLOOD_CHARGE_INSUFFICIENT`

**SYSTEM CHECK RESULT:** Head-pressure-control refrigerant inventory is insufficient

**CONFIRMED FINDINGS**
- Low ambient/head-control system
- Flood-charge inventory is insufficient

**WHAT THIS MEANS**
Some low-ambient controls require sufficient refrigerant inventory to flood condenser volume and maintain receiver pressure.

**NEXT ACTION / CHECK**
Correct charge using the equipment/head-control manufacturer procedure, not a generic SC target.

**EXPECTED TROUBLESHOOTING PATH**
1. Verify receiver/head-control design
1. Charge by manufacturer method
1. Recheck liquid feed

**MUST NOT CONCLUDE**
- Do not use generic subcooling target if not applicable.

**Sources:** Parker Sporlan Superheat Control Bulletin 100-50-5.1

## CH-H013 — Head control setting/restriction localized

**Setup facts:** `FACT_HEAD_CONTROL_INSTALLED, FACT_HEAD_CONTROL_SETTING_RESTRICTION, FACT_COND_SAT_LOW`

**SYSTEM CHECK RESULT:** Head-pressure-control fault/restriction localized

**CONFIRMED FINDINGS**
- Head control installed
- Setting/restriction evidence localized
- Head is low

**WHAT THIS MEANS**
The head-control device is not maintaining the intended condensing condition.

**NEXT ACTION / CHECK**
Inspect/adjust/repair the head-pressure control per manufacturer instructions and verify liquid feed.

**EXPECTED TROUBLESHOOTING PATH**
1. Verify sensing/setting
1. Check valve restriction
1. Confirm head after repair

**MUST NOT CONCLUDE**
- Do not add refrigerant before verifying head-control operation.

**Sources:** Parker Sporlan Superheat Control Bulletin 100-50-5.1

## CH-H014 — High head with recirculation confirmed

**Setup facts:** `FACT_COND_SAT_HIGH, FACT_COND_RECIRCULATION_CONFIRMED`

**SYSTEM CHECK RESULT:** Condenser discharge-air recirculation is driving high head

**CONFIRMED FINDINGS**
- High head
- Hot-air recirculation confirmed

**WHAT THIS MEANS**
Recirculated hot discharge air raises entering condenser temperature and reduces heat rejection.

**NEXT ACTION / CHECK**
Correct installation/airflow recirculation first, then stabilize and recheck head.

**EXPECTED TROUBLESHOOTING PATH**
1. Separate discharge and intake air
1. Verify airflow
1. Recheck head

**MUST NOT CONCLUDE**
- Do not diagnose overcharge before correcting confirmed recirculation.

**Sources:** Danfoss Ref Tools - Head pressure too high

## CH-H015 — High head with clean coil, fan running, normal airflow

**Setup facts:** `FACT_COND_SAT_HIGH, FACT_COND_COIL_CLEAN, FACT_COND_FAN_RUNNING, FACT_COND_AIRFLOW_NORMAL`

**SYSTEM CHECK RESULT:** High head remains after airflow causes are excluded

**CONFIRMED FINDINGS**
- Head is high
- Condenser coil/fan/airflow are verified normal

**WHAT THIS MEANS**
With heat-rejection airflow verified, charge, noncondensables, load, or control causes deserve higher priority.

**NEXT ACTION / CHECK**
Use applicable charge method and pressure-temperature evidence to separate overcharge from noncondensables/high load.

**EXPECTED TROUBLESHOOTING PATH**
1. Verify ambient/load
1. Verify charge method
1. Check noncondensable evidence

**MUST NOT CONCLUDE**
- Do not clean/replace condenser fan when airflow is verified normal.

**Sources:** Danfoss Ref Tools - Head pressure too high

## CH-H016 — High head with noncondensable evidence

**Setup facts:** `FACT_COND_SAT_HIGH, FACT_COND_AIRFLOW_NORMAL, FACT_NONCONDENSABLE_EVIDENCE`

**SYSTEM CHECK RESULT:** Noncondensables strongly supported

**CONFIRMED FINDINGS**
- High head
- Airflow normal
- Noncondensable evidence present

**WHAT THIS MEANS**
Noncondensable gas can elevate condensing pressure even when condenser airflow is normal.

**NEXT ACTION / CHECK**
Recover/handle refrigerant according to service procedure, evacuate properly, recharge correctly, and verify.

**EXPECTED TROUBLESHOOTING PATH**
1. Confirm evidence
1. Recover as required
1. Evacuate
1. Recharge by approved method

**MUST NOT CONCLUDE**
- Do not vent refrigerant.

**Sources:** Danfoss Ref Tools - Head pressure too high

## CH-H017 — High head with overcharge evidence

**Setup facts:** `FACT_COND_SAT_HIGH, FACT_COND_AIRFLOW_NORMAL, FACT_OVERCHARGE_EVIDENCE`

**SYSTEM CHECK RESULT:** Excess refrigerant charge strongly supported

**CONFIRMED FINDINGS**
- High head
- Airflow normal
- Overcharge evidence present

**WHAT THIS MEANS**
Excess refrigerant can raise condensing pressure and liquid inventory.

**NEXT ACTION / CHECK**
Correct charge by the equipment-specific method and verify stable operation.

**EXPECTED TROUBLESHOOTING PATH**
1. Verify applicable charging method
1. Correct inventory
1. Recheck pressures/SC

**MUST NOT CONCLUDE**
- Do not remove charge based only on high head without supporting evidence.

**Sources:** Danfoss Ref Tools - Head pressure too high

## CH-H018 — HP trip with recirculation

**Setup facts:** `FACT_HP_SAFETY_OPEN, FACT_COND_RECIRCULATION_CONFIRMED, FACT_COND_SAT_HIGH`

**SYSTEM CHECK RESULT:** High-pressure trip caused by heat-rejection/recirculation problem

**CONFIRMED FINDINGS**
- HP safety is open
- High head confirmed
- Recirculation confirmed

**WHAT THIS MEANS**
The safety trip is protective response to a confirmed high-side airflow installation problem.

**NEXT ACTION / CHECK**
Correct recirculation before resetting/restarting; then verify head pressure and safety operation.

**EXPECTED TROUBLESHOOTING PATH**
1. Correct recirculation
1. Verify condenser airflow
1. Reset only after cause corrected

**MUST NOT CONCLUDE**
- Do not repeatedly reset HP safety without correcting cause.

**Sources:** Danfoss Ref Tools - Head pressure too high

## CH-H019 — Low head and flash gas with low ambient

**Setup facts:** `FACT_COND_SAT_LOW, FACT_SIGHT_GLASS_FLASHING, FACT_LOW_AMBIENT`

**SYSTEM CHECK RESULT:** Low condensing pressure may be causing inadequate liquid pressure/subcooling

**CONFIRMED FINDINGS**
- Head is low
- Sight glass flashes
- Ambient is low

**WHAT THIS MEANS**
Low ambient can reduce liquid pressure/subcooling and create flash gas before the TXV.

**NEXT ACTION / CHECK**
Check head-pressure control and liquid-line pressure drop before diagnosing low charge.

**EXPECTED TROUBLESHOOTING PATH**
1. Verify head control
1. Check liquid pressure drop
1. Check liquid condition at TXV

**MUST NOT CONCLUDE**
- Do not diagnose low charge from bubbles alone.

**Sources:** Parker Sporlan Superheat Control Bulletin 100-50-5.1

## CH-H020 — High ambient + high load + high head

**Setup facts:** `FACT_HIGH_AMBIENT, FACT_HIGH_PRODUCT_LOAD, FACT_COND_SAT_HIGH`

**SYSTEM CHECK RESULT:** High head may be load/ambient driven

**CONFIRMED FINDINGS**
- Ambient is high
- Product load is high
- Head is high

**WHAT THIS MEANS**
High ambient and high refrigeration load both increase condensing demand.

**NEXT ACTION / CHECK**
Verify condenser capacity/airflow and compare readings with design conditions before charge diagnosis.

**EXPECTED TROUBLESHOOTING PATH**
1. Characterize load
1. Verify airflow
1. Compare with design target

**MUST NOT CONCLUDE**
- Do not diagnose overcharge solely from high head under extreme load/ambient.

**Sources:** Danfoss Ref Tools - Head pressure too high

## CH-T021 — High SH with proper liquid at TXV and no restriction

**Setup facts:** `FACT_EVAP_SH_HIGH, FACT_TXV_UPSTREAM_LIQUID_PROPER, FACT_NO_LOCALIZED_RESTRICTION`

**SYSTEM CHECK RESULT:** Metering-device underfeed becomes more likely

**CONFIRMED FINDINGS**
- SH high
- Proper liquid reaches TXV
- No upstream restriction evidence

**WHAT THIS MEANS**
After upstream liquid supply is verified, valve sizing/response/power element becomes a stronger branch.

**NEXT ACTION / CHECK**
Test TXV response, bulb/equalizer and application match before adjustment/replacement.

**EXPECTED TROUBLESHOOTING PATH**
1. Verify bulb/equalizer
1. Test valve response
1. Verify valve sizing/application

**MUST NOT CONCLUDE**
- Do not add refrigerant when upstream liquid supply is verified without charge evidence.

**Sources:** Parker Sporlan Bulletin 10-11

## CH-T022 — High SH + TXV no response + proper inlet liquid

**Setup facts:** `FACT_EVAP_SH_HIGH, FACT_TXV_NO_RESPONSE, FACT_TXV_UPSTREAM_LIQUID_PROPER`

**SYSTEM CHECK RESULT:** TXV valve/power-element fault strongly indicated

**CONFIRMED FINDINGS**
- High SH
- TXV fails response test
- Proper inlet liquid verified

**WHAT THIS MEANS**
A valve that does not respond with adequate inlet liquid points toward valve/power-element malfunction.

**NEXT ACTION / CHECK**
Verify bulb/equalizer one last time, then service/replace the TXV per manufacturer guidance.

**EXPECTED TROUBLESHOOTING PATH**
1. Verify bulb/equalizer
1. Service valve/power element
1. Recheck SH

**MUST NOT CONCLUDE**
- Do not diagnose low charge solely from high SH.

**Sources:** Parker Sporlan Bulletin 10-11

## CH-T023 — High SH with wrong refrigerant/TXV match

**Setup facts:** `FACT_EVAP_SH_HIGH, FACT_WRONG_REFRIGERANT_OR_VALVE_MATCH`

**SYSTEM CHECK RESULT:** Expansion-device application mismatch

**CONFIRMED FINDINGS**
- High SH
- Refrigerant/valve match is wrong

**WHAT THIS MEANS**
A TEV charge/application mismatch can prevent proper superheat control.

**NEXT ACTION / CHECK**
Correct the valve/refrigerant application match before tuning or charge changes.

**EXPECTED TROUBLESHOOTING PATH**
1. Identify valve charge/application
1. Install correct device
1. Verify SH

**MUST NOT CONCLUDE**
- Do not adjust the wrong valve to compensate for application mismatch.

**Sources:** Parker Sporlan Bulletin 10-11

## CH-T024 — Unstable SH with otherwise normal liquid supply

**Setup facts:** `FACT_TXV_HUNTING, FACT_TXV_UPSTREAM_LIQUID_PROPER`

**SYSTEM CHECK RESULT:** Unstable superheat/feed control

**CONFIRMED FINDINGS**
- TXV/feed is hunting
- Liquid supply at valve is proper

**WHAT THIS MEANS**
Hunting can come from sensor/bulb issues, valve sizing, pressure-control instability or control tuning.

**NEXT ACTION / CHECK**
Check bulb/sensor installation, valve sizing and upstream/downstream pressure-control stability.

**EXPECTED TROUBLESHOOTING PATH**
1. Check bulb/sensor
1. Check valve sizing
1. Check head/suction control stability

**MUST NOT CONCLUDE**
- Do not replace TXV solely because SH is unstable.

**Sources:** Parker Sporlan Superheat Control Bulletin 100-50-5.1

## CH-T025 — Low SH with TXV no response

**Setup facts:** `FACT_EVAP_SH_LOW, FACT_TXV_NO_RESPONSE`

**SYSTEM CHECK RESULT:** Overfeed with abnormal valve response

**CONFIRMED FINDINGS**
- SH is low
- TXV response is abnormal

**WHAT THIS MEANS**
Persistent low SH plus abnormal valve response raises overfeed/valve-control concern.

**NEXT ACTION / CHECK**
Verify bulb/equalizer and valve mechanics before adjustment or replacement.

**EXPECTED TROUBLESHOOTING PATH**
1. Check bulb
1. Check equalizer
1. Test valve movement

**MUST NOT CONCLUDE**
- Do not reduce charge solely to correct low SH.

**Sources:** Parker Sporlan Bulletin 10-11

## CH-T026 — High SH with moisture indication

**Setup facts:** `FACT_EVAP_SH_HIGH, FACT_MOISTURE_INDICATED`

**SYSTEM CHECK RESULT:** Moisture-related intermittent TXV/feed restriction is plausible

**CONFIRMED FINDINGS**
- High SH
- Moisture indicator is wet

**WHAT THIS MEANS**
Moisture can freeze at the expansion valve and restrict feed intermittently.

**NEXT ACTION / CHECK**
Address system moisture/drier condition and verify valve feed after dehydration.

**EXPECTED TROUBLESHOOTING PATH**
1. Verify indicator/drier
1. Replace drier as appropriate
1. Evacuate/dehydrate
1. Recheck SH

**MUST NOT CONCLUDE**
- Do not adjust TXV before addressing confirmed moisture.

**Sources:** Parker Sporlan Bulletin 10-11

## CH-T027 — High SH + inlet strainer restriction

**Setup facts:** `FACT_EVAP_SH_HIGH, FACT_TXV_INLET_RESTRICTION`

**SYSTEM CHECK RESULT:** TXV inlet restriction localized

**CONFIRMED FINDINGS**
- High SH
- TXV inlet restriction identified

**WHAT THIS MEANS**
A localized inlet restriction can starve the evaporator even with adequate upstream charge.

**NEXT ACTION / CHECK**
Service the inlet screen/orifice and verify clean solid liquid supply and SH.

**EXPECTED TROUBLESHOOTING PATH**
1. Correct restriction
1. Check contamination source
1. Recheck SH

**MUST NOT CONCLUDE**
- Do not add refrigerant to overcome a localized restriction.

**Sources:** Parker Sporlan Bulletin 10-11

## CH-T028 — High SH with EEV sensor/transducer mismatch

**Setup facts:** `FACT_EVAP_SH_HIGH, FACT_SENSOR_ERROR`

**SYSTEM CHECK RESULT:** Electronic superheat-control input error possible

**CONFIRMED FINDINGS**
- High SH
- Sensor/transducer error exists

**WHAT THIS MEANS**
Electronic valve control depends on correct pressure and temperature inputs; wrong sensor setup can create false/poor control.

**NEXT ACTION / CHECK**
Verify transducer range/type, temperature sensor type/location/wiring, then reevaluate valve behavior.

**EXPECTED TROUBLESHOOTING PATH**
1. Check pressure transducer setup
1. Check temperature sensor
1. Check wiring/location

**MUST NOT CONCLUDE**
- Do not condemn EEV before verifying control inputs.

**Sources:** Parker Sporlan Superheat Control Bulletin 100-50-5.1

## CH-T029 — Unstable SH with head-pressure control instability

**Setup facts:** `FACT_TXV_HUNTING, FACT_HEAD_PRESSURE_CONTROL_ABNORMAL`

**SYSTEM CHECK RESULT:** Upstream pressure-control instability may drive hunting

**CONFIRMED FINDINGS**
- SH/feed unstable
- Head-pressure control abnormal

**WHAT THIS MEANS**
Changing pressure across the valve can destabilize superheat control.

**NEXT ACTION / CHECK**
Stabilize head-pressure control first, then reevaluate TXV/EEV hunting.

**EXPECTED TROUBLESHOOTING PATH**
1. Correct head-control instability
1. Allow stable cooling
1. Recheck SH

**MUST NOT CONCLUDE**
- Do not tune PID/TXV around unstable head pressure.

**Sources:** Parker Sporlan Superheat Control Bulletin 100-50-5.1

## CH-T030 — Low SH after bulb mounting error

**Setup facts:** `FACT_EVAP_SH_LOW, FACT_TXV_BULB_BAD_CONTACT`

**SYSTEM CHECK RESULT:** Bulb installation must be corrected before valve diagnosis

**CONFIRMED FINDINGS**
- Low SH
- Bulb mounting/contact is wrong

**WHAT THIS MEANS**
Incorrect sensing can cause improper valve feed and misleading SH behavior.

**NEXT ACTION / CHECK**
Correct bulb location/contact/insulation, stabilize system, then remeasure SH.

**EXPECTED TROUBLESHOOTING PATH**
1. Correct bulb
1. Stabilize
1. Remeasure SH

**MUST NOT CONCLUDE**
- Do not adjust valve before correcting bulb installation.

**Sources:** Parker Sporlan Bulletin 10-11

## CH-D031 — Defrost command + heater voltage but no current

**Setup facts:** `FACT_DEFROST_COMMAND_PRESENT, FACT_DEFROST_HEATER_VOLTAGE_PRESENT, FACT_DEFROST_HEATER_CURRENT_ABSENT`

**SYSTEM CHECK RESULT:** Defrost heater circuit/load failure localized

**CONFIRMED FINDINGS**
- Defrost commanded
- Voltage reaches heater
- No heater current/heat

**WHAT THIS MEANS**
Power is delivered but the heating load is not operating, pointing to heater/open load connection.

**NEXT ACTION / CHECK**
De-energize safely and test heater continuity/resistance and connections; repair then verify current/heat.

**EXPECTED TROUBLESHOOTING PATH**
1. Lock out power
1. Test heater resistance
1. Repair connection/heater
1. Verify defrost

**MUST NOT CONCLUDE**
- Do not replace controller when it is delivering heater voltage.

**Sources:** Danfoss Cold Room Troubleshooting

## CH-D032 — Defrost heater works but terminates too early

**Setup facts:** `FACT_DEFROST_HEATER_VOLTAGE_PRESENT, FACT_DEFROST_TERMINATION_ERROR, FACT_DEFROST_INCOMPLETE`

**SYSTEM CHECK RESULT:** Defrost termination control fault

**CONFIRMED FINDINGS**
- Heater operates
- Defrost terminates incorrectly
- Coil does not fully clear

**WHAT THIS MEANS**
Premature termination can leave residual ice even with a functioning heater.

**NEXT ACTION / CHECK**
Check termination sensor location/calibration/control logic and verify full coil clearing.

**EXPECTED TROUBLESHOOTING PATH**
1. Check sensor location
1. Check termination setting
1. Run complete defrost

**MUST NOT CONCLUDE**
- Do not replace heater when heat output is verified.

**Sources:** Danfoss Cold Room Troubleshooting

## CH-D033 — Post-defrost fan starts too early

**Setup facts:** `FACT_POST_DEFROST_ACTIVE, FACT_FAN_DELAY_ERROR`

**SYSTEM CHECK RESULT:** Evaporator fan-delay/control fault

**CONFIRMED FINDINGS**
- Post-defrost state
- Fan delay behavior incorrect

**WHAT THIS MEANS**
Starting fans too early can blow heat/moisture into the box and disrupt recovery.

**NEXT ACTION / CHECK**
Verify fan-delay sensor/timer/controller logic and correct before evaluating refrigeration performance.

**EXPECTED TROUBLESHOOTING PATH**
1. Check fan-delay control
1. Verify coil temperature criteria
1. Retest recovery

**MUST NOT CONCLUDE**
- Do not diagnose refrigerant charge during abnormal fan-delay recovery.

**Sources:** Danfoss Cold Room Troubleshooting

## CH-D034 — Drain refreezes after complete defrost

**Setup facts:** `FACT_DEFROST_COMPLETES, FACT_DRAIN_REFREEZE`

**SYSTEM CHECK RESULT:** Drain/refreeze fault

**CONFIRMED FINDINGS**
- Defrost clears coil
- Water refreezes at drain/pan

**WHAT THIS MEANS**
If coil defrost completes, persistent drain ice points to drainage/heater/slope problems rather than insufficient coil defrost.

**NEXT ACTION / CHECK**
Inspect drain heater, trap/slope, blockage and heat transfer; correct drainage and retest.

**EXPECTED TROUBLESHOOTING PATH**
1. Inspect drain path
1. Test drain heater
1. Correct slope/blockage

**MUST NOT CONCLUDE**
- Do not lengthen coil defrost blindly when coil already clears.

**Sources:** Danfoss Cold Room Troubleshooting

## CH-D035 — Fan delay intentionally active after defrost

**Setup facts:** `FACT_POST_DEFROST_ACTIVE, FACT_FAN_DELAY_ACTIVE`

**SYSTEM CHECK RESULT:** Post-defrost fan delay is intentional

**CONFIRMED FINDINGS**
- Post-defrost state
- Fan delay is active

**WHAT THIS MEANS**
Fans may intentionally remain off until coil temperature/time criteria are met.

**NEXT ACTION / CHECK**
Verify delay matches equipment sequence; wait for normal release before diagnosing fan failure.

**EXPECTED TROUBLESHOOTING PATH**
1. Check sequence specification
1. Verify delay releases normally

**MUST NOT CONCLUDE**
- Do not diagnose evaporator fan failure solely because fans are off during valid fan delay.

**Sources:** Danfoss Cold Room Troubleshooting

## CH-D036 — Defrost active with abnormal pressures

**Setup facts:** `FACT_DEFROST_ACTIVE, FACT_COND_SAT_HIGH, FACT_EVAP_SAT_HIGH`

**SYSTEM CHECK RESULT:** Defrost readings are not steady-cooling diagnostic evidence

**CONFIRMED FINDINGS**
- Defrost is active
- Pressures are abnormal for cooling

**WHAT THIS MEANS**
Defrost intentionally changes system state; normal cooling pressure patterns do not apply.

**NEXT ACTION / CHECK**
Complete defrost and recovery, then obtain stabilized cooling readings.

**EXPECTED TROUBLESHOOTING PATH**
1. Complete defrost
1. Allow recovery
1. Measure during stable cooling

**MUST NOT CONCLUDE**
- Do not diagnose charge from defrost pressures.

**Sources:** Danfoss Cold Room Troubleshooting

## CH-D037 — Post-defrost low SH resolves after stabilization

**Setup facts:** `FACT_POST_DEFROST_ACTIVE, FACT_EVAP_SH_LOW`

**SYSTEM CHECK RESULT:** Post-defrost SH must be rechecked after recovery

**CONFIRMED FINDINGS**
- Post-defrost recovery
- SH currently low

**WHAT THIS MEANS**
Transient liquid return/unstable heat load can distort SH immediately after defrost.

**NEXT ACTION / CHECK**
Wait for stable cooling and fan operation, then remeasure before component diagnosis.

**EXPECTED TROUBLESHOOTING PATH**
1. Verify fan release
1. Allow stabilization
1. Remeasure SH

**MUST NOT CONCLUDE**
- Do not adjust TXV from immediate post-defrost SH.

**Sources:** Copeland Refrigeration Manual AE-104, Parker Sporlan Bulletin 10-11

## CH-D038 — Iced coil with heater and termination verified normal

**Setup facts:** `FACT_EVAP_COIL_ICED, FACT_DEFROST_COMPLETES, FACT_EVAP_FAN_RUNNING`

**SYSTEM CHECK RESULT:** Look beyond defrost hardware

**CONFIRMED FINDINGS**
- Coil icing exists
- Defrost completes
- Fan operates

**WHAT THIS MEANS**
With defrost and fan operation verified, infiltration, load, drainage or refrigeration-feed causes move up the list.

**NEXT ACTION / CHECK**
Check door/infiltration, drain/refreeze pattern, load and refrigerant feed.

**EXPECTED TROUBLESHOOTING PATH**
1. Check infiltration
1. Check drain
1. Check load/feed

**MUST NOT CONCLUDE**
- Do not replace heater when defrost is verified complete.

**Sources:** Danfoss Cold Room Troubleshooting

## CH-D039 — Iced coil + door sealed + fan running

**Setup facts:** `FACT_EVAP_COIL_ICED, FACT_DOOR_CLOSED_SEALED, FACT_EVAP_FAN_RUNNING`

**SYSTEM CHECK RESULT:** Icing remains unexplained by fan or door leakage

**CONFIRMED FINDINGS**
- Coil iced
- Door seals
- Fan runs

**WHAT THIS MEANS**
Known airflow fan and door-infiltration causes are reduced; defrost and refrigeration/feed checks become more important.

**NEXT ACTION / CHECK**
Check defrost completion/termination and then refrigerant feed/coil load.

**EXPECTED TROUBLESHOOTING PATH**
1. Check defrost
1. Check drain
1. Check feed

**MUST NOT CONCLUDE**
- Do not assume door infiltration when door is verified sealed.

**Sources:** Danfoss Cold Room Troubleshooting

## CH-D040 — Icing with low evaporator load

**Setup facts:** `FACT_EVAP_COIL_ICED, FACT_LOW_EVAP_LOAD, FACT_EVAP_FAN_RUNNING`

**SYSTEM CHECK RESULT:** Low load may contribute to low evaporating condition/icing

**CONFIRMED FINDINGS**
- Coil iced
- Evaporator load is low
- Fan runs

**WHAT THIS MEANS**
Low load can change evaporator conditions and should be separated from defrost/feed faults.

**NEXT ACTION / CHECK**
Confirm controls/setpoint/load, defrost performance and stable evaporating condition before charge changes.

**EXPECTED TROUBLESHOOTING PATH**
1. Verify load/setpoint
1. Check defrost
1. Check stable suction/SH

**MUST NOT CONCLUDE**
- Do not add refrigerant simply because suction is low at low load.

**Sources:** Danfoss Cold Room Troubleshooting

## CH-C041 — Cooling demand but contactor coil dead; wiring scheme unknown

**Setup facts:** `FACT_COOLING_DEMAND_PRESENT, FACT_CONTACTOR_COIL_NOT_ENERGIZED, FACT_WIRING_SCHEME_UNKNOWN`

**SYSTEM CHECK RESULT:** Control circuit must be traced before component replacement

**CONFIRMED FINDINGS**
- Cooling demand exists
- Contactor coil is not energized
- Wiring/control scheme is unknown

**WHAT THIS MEANS**
An open safety/control path can prevent coil energization; the actual schematic determines the sequence.

**NEXT ACTION / CHECK**
Use the equipment wiring diagram to trace control voltage through safeties and controls to the coil.

**EXPECTED TROUBLESHOOTING PATH**
1. Obtain schematic
1. Trace control voltage
1. Identify open device

**MUST NOT CONCLUDE**
- Do not replace compressor or contactor contacts before finding why the coil is not energized.

**Sources:** Copeland Refrigeration Manual AE-104

## CH-C042 — Fuse open; cause unknown

**Setup facts:** `FACT_FUSE_OPEN`

**SYSTEM CHECK RESULT:** Open fuse requires root-cause investigation

**CONFIRMED FINDINGS**
- Fuse is open

**WHAT THIS MEANS**
A blown fuse is protection evidence, not the root cause.

**NEXT ACTION / CHECK**
De-energize, inspect for shorts/ground faults/overload, then replace with correct fuse only after cause is addressed.

**EXPECTED TROUBLESHOOTING PATH**
1. Check wiring/ground fault
1. Check load current/components
1. Replace correct fuse

**MUST NOT CONCLUDE**
- Do not repeatedly replace fuses without finding the cause.

**Sources:** Copeland Refrigeration Manual AE-104

## CH-C043 — Solenoid commanded open + correct coil voltage + no flow

**Setup facts:** `FACT_SOLENOID_COMMAND_OPEN, FACT_SOLENOID_COIL_VOLTAGE_PRESENT, FACT_SOLENOID_NO_FLOW_WHEN_OPEN`

**SYSTEM CHECK RESULT:** Liquid solenoid mechanical/flow fault localized

**CONFIRMED FINDINGS**
- Command open
- Correct coil voltage
- No refrigerant flow

**WHAT THIS MEANS**
Electrical command reaches the coil, so mechanical valve opening/restriction becomes the primary branch.

**NEXT ACTION / CHECK**
Verify coil magnetism/valve differential and inspect valve for mechanical sticking/restriction.

**EXPECTED TROUBLESHOOTING PATH**
1. Verify coil action
1. Check pressure differential
1. Service valve

**MUST NOT CONCLUDE**
- Do not blame thermostat/control when correct coil voltage is present.

**Sources:** Danfoss Cold Room Troubleshooting

## CH-C044 — Anti-short-cycle delay active with demand

**Setup facts:** `FACT_COOLING_DEMAND_PRESENT, FACT_ANTI_SHORT_CYCLE_DELAY_ACTIVE`

**SYSTEM CHECK RESULT:** Intentional restart delay

**CONFIRMED FINDINGS**
- Cooling demand exists
- Anti-short-cycle delay active

**WHAT THIS MEANS**
The controller may intentionally prevent immediate restart to protect the compressor.

**NEXT ACTION / CHECK**
Verify configured delay and wait for expiration; troubleshoot only if it fails to release.

**EXPECTED TROUBLESHOOTING PATH**
1. Verify timer setting
1. Wait for release
1. Confirm compressor starts

**MUST NOT CONCLUDE**
- Do not bypass intentional anti-short-cycle protection.

**Sources:** Copeland Refrigeration Manual AE-104

## CH-C045 — Room warm; LP cutout set too high

**Setup facts:** `FACT_BOX_TEMP_HIGH, FACT_LP_CONTROL_OPEN`

**SYSTEM CHECK RESULT:** Low-pressure control setting/sequence needs verification

**CONFIRMED FINDINGS**
- Room is warm
- LP control is open

**WHAT THIS MEANS**
An LP cutout set too high can stop cooling before the room reaches target.

**NEXT ACTION / CHECK**
Compare cutout/cutin with equipment requirements and actual pressure; correct setting only per manufacturer design.

**EXPECTED TROUBLESHOOTING PATH**
1. Measure suction
1. Verify LP setting
1. Adjust/repair as specified

**MUST NOT CONCLUDE**
- Do not add refrigerant solely to keep an incorrectly set LP control closed.

**Sources:** Danfoss Ref Tools - Cold room temperature high

## CH-C046 — Warm room with verified normal refrigeration performance

**Setup facts:** `FACT_BOX_TEMP_HIGH, FACT_REFRIGERATION_PERFORMANCE_NORMAL`

**SYSTEM CHECK RESULT:** Investigate load/control/sizing rather than refrigeration circuit

**CONFIRMED FINDINGS**
- Room is warm
- Refrigeration performance otherwise normal

**WHAT THIS MEANS**
If refrigeration circuit performance is normal, room load, infiltration, controls or capacity/sizing become stronger causes.

**NEXT ACTION / CHECK**
Characterize load/infiltration, verify sensor/setpoint, and compare capacity with actual load.

**EXPECTED TROUBLESHOOTING PATH**
1. Check door/load
1. Check sensor/setpoint
1. Compare capacity

**MUST NOT CONCLUDE**
- Do not change refrigerant charge when refrigeration performance is verified normal.

**Sources:** Danfoss Ref Tools - Cold room temperature high

## CH-C047 — Warm room; airflow/feed/controls normal; load exceeds capacity

**Setup facts:** `FACT_BOX_TEMP_HIGH, FACT_AIRFLOW_VERIFIED_NORMAL, FACT_FEED_CHARGE_VERIFIED_NORMAL, FACT_CONTROLS_VERIFIED_NORMAL, FACT_DESIGN_LOAD_EXCEEDS_CAPACITY`

**SYSTEM CHECK RESULT:** System capacity is insufficient for verified load

**CONFIRMED FINDINGS**
- Room warm
- Airflow/feed/controls normal
- Load exceeds equipment capacity

**WHAT THIS MEANS**
The remaining problem is application capacity, not a service adjustment.

**NEXT ACTION / CHECK**
Reduce load or correct equipment sizing/capacity; verify design assumptions.

**EXPECTED TROUBLESHOOTING PATH**
1. Quantify load
1. Compare rated capacity
1. Correct application/sizing

**MUST NOT CONCLUDE**
- Do not overcharge or force controls to compensate for undersizing.

**Sources:** Danfoss Ref Tools - Cold room temperature high

## CH-C048 — Sensor disagrees with reference but refrigeration normal

**Setup facts:** `FACT_SENSOR_DISAGREES_REFERENCE, FACT_REFRIGERATION_PERFORMANCE_NORMAL`

**SYSTEM CHECK RESULT:** Sensor location/calibration/input fault

**CONFIRMED FINDINGS**
- Sensor disagrees with trusted reference
- Refrigeration performance normal

**WHAT THIS MEANS**
Control decisions may be wrong because the sensed temperature is wrong even though refrigeration works.

**NEXT ACTION / CHECK**
Verify sensor placement, calibration, wiring and controller input; correct sensor issue and retest control.

**EXPECTED TROUBLESHOOTING PATH**
1. Compare reference
1. Inspect placement
1. Check calibration/wiring

**MUST NOT CONCLUDE**
- Do not alter refrigerant charge to correct a bad temperature input.

**Sources:** Danfoss Ref Tools - Cold room temperature high

## CH-C049 — Multiple faults: dirty condenser + sensor error + high load

**Setup facts:** `FACT_COND_COIL_DIRTY, FACT_SENSOR_ERROR, FACT_HIGH_PRODUCT_LOAD`

**SYSTEM CHECK RESULT:** Multiple independent contributors are active

**CONFIRMED FINDINGS**
- Condenser is dirty
- Sensor error exists
- Product load is high

**WHAT THIS MEANS**
Heat rejection, control accuracy and load can all affect performance simultaneously.

**NEXT ACTION / CHECK**
Correct the direct condenser restriction, validate sensor/control, characterize load, then reassess refrigeration readings.

**EXPECTED TROUBLESHOOTING PATH**
1. Clean condenser
1. Correct sensor
1. Characterize load
1. Stabilize and retest

**MUST NOT CONCLUDE**
- Do not drop secondary confirmed faults after selecting a primary action.

**Sources:** Danfoss Cold Room Troubleshooting, Danfoss Ref Tools - Head pressure too high

## CH-C050 — Conflicting evidence: low-charge pattern plus confirmed restriction

**Setup facts:** `FACT_EVAP_SH_HIGH, FACT_SUBCOOLING_LOW, FACT_DRIER_TEMP_DROP`

**SYSTEM CHECK RESULT:** Localized restriction outranks generic charge pattern

**CONFIRMED FINDINGS**
- High SH
- Low SC
- Localized drier temperature drop

**WHAT THIS MEANS**
Generic starvation/charge clues can coexist with a localized restriction; the localized evidence must be addressed first.

**NEXT ACTION / CHECK**
Correct/verify the drier restriction, then stabilize and reassess charge using an applicable method.

**EXPECTED TROUBLESHOOTING PATH**
1. Address restriction
1. Stabilize
1. Recheck SH/SC/liquid condition

**MUST NOT CONCLUDE**
- Do not add refrigerant before correcting the localized restriction.

**Sources:** Parker Sporlan Bulletin 10-11

