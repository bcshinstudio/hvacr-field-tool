# WIC Challenge Validation Suite #2

**Cases:** 60  
**Frozen brain:** 2.0.11  
**Rule:** expected results are the answer key; do not change them merely to make Brain pass.

## CH2-A001 — High SH without confirmed operating state

**Operating state:** `UNKNOWN`

**Given:**
- `FACT_EVAP_SH_HIGH`
- `FACT_EVAP_SH_MEASURED`

**Expected System Check Result:** High superheat needs operating-state confirmation

**Confirmed findings:**
- Evaporator superheat is high but operating state is not confirmed

**What this means:** Superheat can mislead during startup, defrost, pump-down or recovery.

**Next Action / Check:** Confirm active stable cooling and allow readings to stabilize before diagnosing refrigerant feed.

**Troubleshooting path:**
1. Confirm cooling demand/compressor operation
2. Select/record Stable cooling
3. Recheck SH and liquid-side evidence

**Must NOT conclude:**
- Do not diagnose low charge from high superheat alone.

**Technical basis:**
- ASHRAE refrigeration diagnostic principles — https://www.ashrae.org/
- Parker Sporlan expansion valve and refrigeration troubleshooting guidance — https://www.parker.com/us/en/divisions/sporlan-division.html

---

## CH2-A002 — Low SC without applicable model target

**Operating state:** `STABLE_COOLING`

**Given:**
- `FACT_SUBCOOLING_LOW`
- `FACT_SUBCOOLING_MEASURED`
- `FACT_SC_REFERENCE_NOT_APPLICABLE`
- `FACT_RECEIVER_PRESENT`

**Expected System Check Result:** Low subcooling reading needs configuration-aware interpretation

**Confirmed findings:**
- Subcooling is measured low against a non-applicable reference
- Liquid receiver is present

**What this means:** Receiver systems and measurement location can make generic subcooling targets unreliable.

**Next Action / Check:** Use liquid condition, sight glass, restriction evidence and applicable equipment target before judging charge.

**Troubleshooting path:**
1. Verify measurement location
2. Find model/application target
3. Check liquid condition and leak/restriction evidence

**Must NOT conclude:**
- Do not add refrigerant solely from a generic subcooling target.

**Technical basis:**
- ASHRAE refrigeration diagnostic principles — https://www.ashrae.org/
- Danfoss refrigeration troubleshooting/application guidance — https://www.danfoss.com/en/service-and-support/

---

## CH2-A003 — Model target overrides generic reference

**Operating state:** `STABLE_COOLING`

**Given:**
- `FACT_MODEL_SPECIFIC_TARGET_AVAILABLE`
- `FACT_GENERIC_REFERENCE_CONFLICTS_MODEL`
- `FACT_SUBCOOLING_MEASURED`

**Expected System Check Result:** Use the model-specific charging target

**Confirmed findings:**
- Applicable model-specific target is available
- Generic reference conflicts with model target

**What this means:** Manufacturer/model targets take precedence over generic rules of thumb.

**Next Action / Check:** Compare the measured value with the applicable model target and charging procedure.

**Troubleshooting path:**
1. Identify exact model/refrigerant
2. Use manufacturer target
3. Reassess charge only from applicable target

**Must NOT conclude:**
- Do not use a generic target when an applicable model target exists.

**Technical basis:**
- ASHRAE refrigeration diagnostic principles — https://www.ashrae.org/

---

## CH2-A004 — Suspect evaporator outlet pressure reading

**Operating state:** `STABLE_COOLING`

**Given:**
- `FACT_EVAP_OUTLET_PRESSURE_SUSPECT`
- `FACT_EVAP_SH_HIGH`

**Expected System Check Result:** Verify the suspect pressure measurement before diagnosing

**Confirmed findings:**
- Evaporator outlet pressure measurement is suspect
- Calculated superheat appears high

**What this means:** Bad pressure evidence can create a false superheat diagnosis.

**Next Action / Check:** Verify gauge/transducer connection and pressure at the correct location, then recalculate superheat.

**Troubleshooting path:**
1. Verify instrument/zero
2. Verify measurement location
3. Recalculate SH

**Must NOT conclude:**
- Do not condemn the TXV or charge from a suspect pressure reading.

**Technical basis:**
- ASHRAE refrigeration diagnostic principles — https://www.ashrae.org/
- Parker Sporlan expansion valve and refrigeration troubleshooting guidance — https://www.parker.com/us/en/divisions/sporlan-division.html

---

## CH2-A005 — Warm room with normal suction and head

**Operating state:** `STABLE_COOLING`

**Given:**
- `FACT_BOX_TEMP_HIGH`
- `FACT_SUCTION_NORMAL_FOR_STATE`
- `FACT_HEAD_NORMAL_FOR_STATE`

**Expected System Check Result:** Warm-room problem is not yet localized to refrigeration circuit

**Confirmed findings:**
- Room is warm
- Suction and head are reasonable for current state/load

**What this means:** Normal pressures shift attention toward load, airflow, controls, infiltration and capacity.

**Next Action / Check:** Check evaporator airflow, door/load conditions, sensor/control accuracy and actual capacity before opening the refrigerant circuit.

**Troubleshooting path:**
1. Verify airflow
2. Check door/product load
3. Verify sensor/control
4. Compare load to capacity

**Must NOT conclude:**
- Do not add refrigerant because the room is warm.

**Technical basis:**
- ASHRAE refrigeration diagnostic principles — https://www.ashrae.org/
- Heatcraft refrigeration systems installation/operation guidance — https://www.heatcraftrpd.com/resources/

---

## CH2-A006 — Low suction with low evaporator load

**Operating state:** `STABLE_COOLING`

**Given:**
- `FACT_SUCTION_PRESSURE_LOW`
- `FACT_LOW_EVAP_LOAD`
- `FACT_EVAP_FAN_RUNNING`
- `FACT_EVAP_COIL_CLEAR`

**Expected System Check Result:** Low suction may be load-related rather than a feed fault

**Confirmed findings:**
- Suction pressure is low
- Evaporator load is verified low

**What this means:** Low load can lower evaporating pressure without proving a restriction or low charge.

**Next Action / Check:** Confirm room/load condition and evaluate superheat/liquid-side evidence before diagnosing refrigerant starvation.

**Troubleshooting path:**
1. Confirm load
2. Measure SH
3. Check liquid supply/restriction evidence

**Must NOT conclude:**
- Do not diagnose low charge from low suction alone.

**Technical basis:**
- ASHRAE refrigeration diagnostic principles — https://www.ashrae.org/
- Parker Sporlan expansion valve and refrigeration troubleshooting guidance — https://www.parker.com/us/en/divisions/sporlan-division.html

---

## CH2-A007 — High head just after warm pull-down begins

**Operating state:** `STABLE_COOLING`

**Given:**
- `FACT_COND_SAT_HIGH`
- `FACT_HIGH_PRODUCT_LOAD`
- `FACT_COND_AIRFLOW_NORMAL`

**Expected System Check Result:** High head may reflect temporary high load

**Confirmed findings:**
- Condensing pressure is high
- Large warm load is present
- Condenser airflow is normal

**What this means:** A heavy pull-down load can temporarily raise condensing pressure.

**Next Action / Check:** Trend head pressure as box/product temperature falls; verify it returns toward expected range.

**Troubleshooting path:**
1. Confirm airflow/ambient
2. Trend during pull-down
3. Investigate persistent high head only after load decreases

**Must NOT conclude:**
- Do not immediately diagnose overcharge or noncondensables during known heavy pull-down.

**Technical basis:**
- ASHRAE refrigeration diagnostic principles — https://www.ashrae.org/
- Heatcraft refrigeration systems installation/operation guidance — https://www.heatcraftrpd.com/resources/

---

## CH2-A008 — Low SH with verified low evaporator load

**Operating state:** `STABLE_COOLING`

**Given:**
- `FACT_EVAP_SH_LOW`
- `FACT_LOW_EVAP_LOAD`
- `FACT_EVAP_FAN_RUNNING`

**Expected System Check Result:** Low superheat requires load-aware interpretation

**Confirmed findings:**
- Evaporator superheat is low
- Evaporator load is low

**What this means:** Low load can alter valve/feed behavior; floodback risk still must be checked.

**Next Action / Check:** Verify stable conditions, bulb/valve response and compressor inlet superheat before adjusting charge.

**Troubleshooting path:**
1. Confirm stable load
2. Check TXV/bulb response
3. Check compressor inlet condition

**Must NOT conclude:**
- Do not add or remove refrigerant from low SH alone.

**Technical basis:**
- Parker Sporlan expansion valve and refrigeration troubleshooting guidance — https://www.parker.com/us/en/divisions/sporlan-division.html
- Copeland compressor/refrigeration application guidance — https://www.copeland.com/en-us/tools-resources

---

## CH2-A009 — Sight-glass bubbles during low ambient

**Operating state:** `STABLE_COOLING`

**Given:**
- `FACT_SIGHT_GLASS_FLASHING`
- `FACT_LOW_AMBIENT`
- `FACT_HEAD_CONTROL_INSTALLED`

**Expected System Check Result:** Sight-glass bubbles need low-ambient/head-control context

**Confirmed findings:**
- Sight glass shows bubbles
- Low ambient/head-pressure control context is present

**What this means:** Low condensing pressure or head-control behavior can cause flash gas without proving low total charge.

**Next Action / Check:** Verify head-pressure control operation, liquid pressure/subcooling and receiver condition before judging charge.

**Troubleshooting path:**
1. Check head control
2. Check liquid pressure/SC
3. Look for leak evidence

**Must NOT conclude:**
- Do not diagnose low charge from bubbles alone.

**Technical basis:**
- Danfoss refrigeration troubleshooting/application guidance — https://www.danfoss.com/en/service-and-support/
- Parker Sporlan expansion valve and refrigeration troubleshooting guidance — https://www.parker.com/us/en/divisions/sporlan-division.html

---

## CH2-A010 — High current with normal head

**Operating state:** `STABLE_COOLING`

**Given:**
- `FACT_COMPRESSOR_HIGH_CURRENT`
- `FACT_HEAD_NORMAL_FOR_STATE`

**Expected System Check Result:** High compressor current needs electrical/mechanical isolation

**Confirmed findings:**
- Compressor current is high
- Head pressure is not excessive

**What this means:** High current without high head is not explained by condenser load alone.

**Next Action / Check:** Verify voltage/phase condition, start/run components where applicable, compressor temperature and mechanical condition against nameplate data.

**Troubleshooting path:**
1. Check supply voltage
2. Compare current/nameplate
3. Check compressor temperature/protection

**Must NOT conclude:**
- Do not blame high head when head pressure is normal.

**Technical basis:**
- Copeland compressor/refrigeration application guidance — https://www.copeland.com/en-us/tools-resources

---

## CH2-B011 — High SH + high SC + low suction

**Operating state:** `STABLE_COOLING`

**Given:**
- `FACT_EVAP_SH_HIGH`
- `FACT_SUBCOOLING_HIGH`
- `FACT_SUCTION_PRESSURE_LOW`

**Expected System Check Result:** Restriction or underfeeding is favored over low charge

**Confirmed findings:**
- Superheat is high
- Subcooling is high
- Suction pressure is low

**What this means:** Refrigerant is retained on the high side while the evaporator is starved, which fits restriction/underfeeding better than low inventory.

**Next Action / Check:** Localize liquid-line/TXV restriction using drier drop, liquid pressure/temperature and TXV inlet/equalizer checks.

**Troubleshooting path:**
1. Check drier drop
2. Check liquid line
3. Check TXV inlet/equalizer

**Must NOT conclude:**
- Do not add refrigerant simply because suction is low and SH is high.

**Technical basis:**
- Parker Sporlan expansion valve and refrigeration troubleshooting guidance — https://www.parker.com/us/en/divisions/sporlan-division.html
- ASHRAE refrigeration diagnostic principles — https://www.ashrae.org/

---

## CH2-B012 — High SH + low SC + confirmed restriction

**Operating state:** `STABLE_COOLING`

**Given:**
- `FACT_EVAP_SH_HIGH`
- `FACT_SUBCOOLING_LOW`
- `FACT_DRIER_TEMP_DROP`

**Expected System Check Result:** Confirmed restriction takes priority over charge pattern

**Confirmed findings:**
- Superheat is high
- Subcooling is low
- Drier temperature drop localizes a restriction

**What this means:** A localized restriction is direct evidence and can coexist with low-looking subcooling.

**Next Action / Check:** Correct the filter-drier restriction first, then stabilize and remeasure before judging charge.

**Troubleshooting path:**
1. Replace/recover per service procedure
2. Stabilize system
3. Recheck SH/SC and pressures

**Must NOT conclude:**
- Do not add refrigerant before correcting the confirmed restriction.

**Technical basis:**
- Parker Sporlan expansion valve and refrigeration troubleshooting guidance — https://www.parker.com/us/en/divisions/sporlan-division.html

---

## CH2-B013 — Low SH + high suction with airflow normal

**Operating state:** `STABLE_COOLING`

**Given:**
- `FACT_EVAP_SH_LOW`
- `FACT_SUCTION_PRESSURE_HIGH_FOR_LOAD`
- `FACT_AIRFLOW_VERIFIED_NORMAL`

**Expected System Check Result:** Possible overfeeding/flooding pattern

**Confirmed findings:**
- Superheat is low
- Suction pressure is high for load
- Airflow is normal

**What this means:** With airflow not causing the pattern, excess feed or TXV control should be investigated.

**Next Action / Check:** Check TXV bulb installation/response and liquid feed; verify compressor inlet superheat before adjusting charge.

**Troubleshooting path:**
1. Check bulb
2. Test TXV response
3. Check compressor inlet SH

**Must NOT conclude:**
- Do not assume low airflow when airflow is verified normal.

**Technical basis:**
- Parker Sporlan expansion valve and refrigeration troubleshooting guidance — https://www.parker.com/us/en/divisions/sporlan-division.html
- Copeland compressor/refrigeration application guidance — https://www.copeland.com/en-us/tools-resources

---

## CH2-B014 — High suction + low head + weak differential

**Operating state:** `STABLE_COOLING`

**Given:**
- `FACT_SUCTION_PRESSURE_HIGH_FOR_LOAD`
- `FACT_COND_SAT_LOW`
- `FACT_COMPRESSOR_PRESSURE_DIFFERENTIAL_WEAK`
- `FACT_COMPRESSOR_RUNNING`

**Expected System Check Result:** Weak compressor pumping is strongly indicated

**Confirmed findings:**
- Suction is high for load
- Head is low
- Compressor differential is weak

**What this means:** A running compressor that cannot maintain normal pressure separation may have internal leakage or reduced pumping capacity.

**Next Action / Check:** Verify operating conditions and compressor current, then evaluate internal valve/leakage evidence before condemning compressor.

**Troubleshooting path:**
1. Verify state/load
2. Check current
3. Confirm weak pumping/internal leakage

**Must NOT conclude:**
- Do not add refrigerant to correct weak pressure separation.

**Technical basis:**
- Copeland compressor/refrigeration application guidance — https://www.copeland.com/en-us/tools-resources

---

## CH2-B015 — Low suction + low head + bubbles + no leak evidence

**Operating state:** `STABLE_COOLING`

**Given:**
- `FACT_SUCTION_PRESSURE_LOW`
- `FACT_COND_SAT_LOW`
- `FACT_SIGHT_GLASS_FLASHING`
- `FACT_NO_LOCALIZED_RESTRICTION`

**Expected System Check Result:** Low refrigerant inventory is plausible but needs confirmation

**Confirmed findings:**
- Suction is low
- Head is low
- Sight glass bubbles
- No localized restriction found

**What this means:** The combination supports inadequate liquid inventory more than a localized restriction, but leak evidence should be sought.

**Next Action / Check:** Check applicable charge reference and perform leak inspection before correcting charge.

**Troubleshooting path:**
1. Verify stable cooling
2. Leak check
3. Use applicable charging method

**Must NOT conclude:**
- Do not treat sight-glass bubbles alone as proof of low charge.

**Technical basis:**
- ASHRAE refrigeration diagnostic principles — https://www.ashrae.org/
- Parker Sporlan expansion valve and refrigeration troubleshooting guidance — https://www.parker.com/us/en/divisions/sporlan-division.html

---

## CH2-B016 — High head + high SC + normal airflow + noncondensable evidence

**Operating state:** `STABLE_COOLING`

**Given:**
- `FACT_COND_SAT_HIGH`
- `FACT_SUBCOOLING_HIGH`
- `FACT_COND_AIRFLOW_NORMAL`
- `FACT_NONCONDENSABLE_EVIDENCE`

**Expected System Check Result:** Noncondensables are supported by direct evidence

**Confirmed findings:**
- Head pressure is high
- Subcooling is high
- Airflow is normal
- Noncondensable evidence is present

**What this means:** Normal airflow removes a common heat-rejection cause; direct noncondensable evidence should drive the service path.

**Next Action / Check:** Recover/handle refrigerant per proper service procedure, evacuate correctly and recharge by approved method.

**Troubleshooting path:**
1. Confirm evidence
2. Recover refrigerant
3. Evacuate/recharge correctly

**Must NOT conclude:**
- Do not simply vent or bleed refrigerant to reduce head pressure.

**Technical basis:**
- ASHRAE refrigeration diagnostic principles — https://www.ashrae.org/

---

## CH2-B017 — High head + high SC + normal airflow + overcharge evidence

**Operating state:** `STABLE_COOLING`

**Given:**
- `FACT_COND_SAT_HIGH`
- `FACT_SUBCOOLING_HIGH`
- `FACT_COND_AIRFLOW_NORMAL`
- `FACT_OVERCHARGE_EVIDENCE`

**Expected System Check Result:** Excess refrigerant inventory is supported

**Confirmed findings:**
- Head pressure is high
- Subcooling is high
- Airflow is normal
- Overcharge evidence is present

**What this means:** With airflow normal and direct charge evidence, excess inventory is more likely than an airflow fault.

**Next Action / Check:** Verify applicable charge procedure and correct refrigerant inventory using proper recovery/service methods.

**Troubleshooting path:**
1. Verify model charge method
2. Recover excess as required
3. Recheck pressures/SC

**Must NOT conclude:**
- Do not diagnose noncondensables without supporting evidence.

**Technical basis:**
- ASHRAE refrigeration diagnostic principles — https://www.ashrae.org/

---

## CH2-B018 — High head with dirty coil and high ambient

**Operating state:** `STABLE_COOLING`

**Given:**
- `FACT_COND_SAT_HIGH`
- `FACT_COND_COIL_DIRTY`
- `FACT_HIGH_AMBIENT`

**Expected System Check Result:** Condenser heat-rejection problem has two active contributors

**Confirmed findings:**
- Head pressure is high
- Condenser coil is dirty
- Ambient is high

**What this means:** Dirty coil and high ambient both increase condensing temperature; correct the serviceable airflow fault first and interpret remaining head against ambient.

**Next Action / Check:** Clean the condenser, verify fan/airflow, then compare condensing split against the actual ambient.

**Troubleshooting path:**
1. Clean coil
2. Verify airflow
3. Recheck head/CTOA

**Must NOT conclude:**
- Do not diagnose overcharge before restoring condenser heat rejection.

**Technical basis:**
- ASHRAE refrigeration diagnostic principles — https://www.ashrae.org/
- Heatcraft refrigeration systems installation/operation guidance — https://www.heatcraftrpd.com/resources/

---

## CH2-B019 — High SH + proper TXV liquid + bulb good + no response

**Operating state:** `STABLE_COOLING`

**Given:**
- `FACT_EVAP_SH_HIGH`
- `FACT_TXV_UPSTREAM_LIQUID_PROPER`
- `FACT_TXV_NOT_RESPONDING`
- `FACT_NO_LOCALIZED_RESTRICTION`

**Expected System Check Result:** TXV underfeeding/control fault is localized

**Confirmed findings:**
- Superheat is high
- Proper liquid reaches TXV
- TXV does not respond
- No upstream restriction found

**What this means:** Adequate inlet liquid plus valve non-response shifts the fault toward the TXV/control mechanism.

**Next Action / Check:** Verify bulb/equalizer/application, then service or replace the TXV if non-response is confirmed.

**Troubleshooting path:**
1. Verify bulb/equalizer
2. Confirm valve response
3. Service/replace valve as appropriate

**Must NOT conclude:**
- Do not add refrigerant when proper liquid is already verified at the TXV.

**Technical basis:**
- Parker Sporlan expansion valve and refrigeration troubleshooting guidance — https://www.parker.com/us/en/divisions/sporlan-division.html

---

## CH2-B020 — High SH + flashing at TXV + drier drop

**Operating state:** `STABLE_COOLING`

**Given:**
- `FACT_EVAP_SH_HIGH`
- `FACT_LIQUID_AT_TXV_FLASHING`
- `FACT_DRIER_TEMP_DROP`

**Expected System Check Result:** Upstream liquid-line restriction is indicated

**Confirmed findings:**
- Superheat is high
- Liquid flashes at TXV inlet
- Drier temperature drop is present

**What this means:** The TXV is being supplied with poor liquid condition because an upstream restriction is localized.

**Next Action / Check:** Correct the drier/liquid-line restriction first and recheck TXV inlet condition and superheat.

**Troubleshooting path:**
1. Correct restriction
2. Verify solid liquid
3. Recheck SH

**Must NOT conclude:**
- Do not condemn the TXV before restoring proper inlet liquid.

**Technical basis:**
- Parker Sporlan expansion valve and refrigeration troubleshooting guidance — https://www.parker.com/us/en/divisions/sporlan-division.html

---

## CH2-C021 — Startup transient high suction

**Operating state:** `STARTUP`

**Given:**
- `FACT_SUCTION_PRESSURE_HIGH_FOR_LOAD`
- `FACT_LONG_OFF_CYCLE_STARTUP`

**Expected System Check Result:** Startup pressure is not yet a steady-state diagnosis

**Confirmed findings:**
- High suction occurs during startup after long off-cycle

**What this means:** Startup pressures can be temporarily abnormal while load and refrigerant distribution normalize.

**Next Action / Check:** Allow stable cooling, then remeasure suction/head/SH/SC before diagnosing.

**Troubleshooting path:**
1. Confirm compressor/fans
2. Allow stabilization
3. Remeasure

**Must NOT conclude:**
- Do not diagnose compressor inefficiency from startup suction alone.

**Technical basis:**
- ASHRAE refrigeration diagnostic principles — https://www.ashrae.org/
- Copeland compressor/refrigeration application guidance — https://www.copeland.com/en-us/tools-resources

---

## CH2-C022 — Defrost active with low suction

**Operating state:** `DEFROST`

**Given:**
- `FACT_DEFROST_ACTIVE`
- `FACT_SUCTION_PRESSURE_LOW`

**Expected System Check Result:** Ignore steady-cooling pressure diagnosis during defrost

**Confirmed findings:**
- System is in defrost
- Suction pressure is low

**What this means:** Defrost is not a valid state for ordinary refrigeration pressure-pattern diagnosis.

**Next Action / Check:** Complete defrost and post-defrost recovery, then measure during stable cooling.

**Troubleshooting path:**
1. Finish defrost
2. Allow fan-delay/recovery
3. Remeasure in stable cooling

**Must NOT conclude:**
- Do not diagnose low charge from defrost suction pressure.

**Technical basis:**
- Heatcraft refrigeration systems installation/operation guidance — https://www.heatcraftrpd.com/resources/

---

## CH2-C023 — Post-defrost low SH with fan delay active

**Operating state:** `POST_DEFROST`

**Given:**
- `FACT_POST_DEFROST_ACTIVE`
- `FACT_EVAP_SH_LOW`
- `FACT_FAN_DELAY_ACTIVE`

**Expected System Check Result:** Post-defrost superheat is not yet stable evidence

**Confirmed findings:**
- Post-defrost recovery is active
- Fan delay is intentionally active
- Superheat is low

**What this means:** Refrigerant and coil conditions are transient immediately after defrost.

**Next Action / Check:** Allow fan delay to complete and system to stabilize before evaluating superheat.

**Troubleshooting path:**
1. Verify fan delay completes
2. Run stable cooling
3. Remeasure SH

**Must NOT conclude:**
- Do not adjust TXV or charge from immediate post-defrost SH.

**Technical basis:**
- Heatcraft refrigeration systems installation/operation guidance — https://www.heatcraftrpd.com/resources/
- Parker Sporlan expansion valve and refrigeration troubleshooting guidance — https://www.parker.com/us/en/divisions/sporlan-division.html

---

## CH2-C024 — Pump-down with LP control open

**Operating state:** `PUMPDOWN`

**Given:**
- `FACT_PUMPDOWN_ACTIVE`
- `FACT_LP_CONTROL_OPEN`
- `FACT_SOLENOID_COMMAND_CLOSED`

**Expected System Check Result:** LP opening may be normal pump-down sequence

**Confirmed findings:**
- Pump-down is active
- Solenoid is commanded closed
- LP control is open

**What this means:** The compressor is expected to pump suction down until the LP control opens in many pump-down systems.

**Next Action / Check:** Verify the actual control sequence and that the compressor stops at the intended cutout.

**Troubleshooting path:**
1. Confirm wiring/control sequence
2. Verify solenoid closed
3. Verify LP cutout/compressor stop

**Must NOT conclude:**
- Do not diagnose an LP-control fault solely because it opens during normal pump-down.

**Technical basis:**
- Heatcraft refrigeration systems installation/operation guidance — https://www.heatcraftrpd.com/resources/
- Danfoss refrigeration troubleshooting/application guidance — https://www.danfoss.com/en/service-and-support/

---

## CH2-C025 — Satisfied/off with low suction

**Operating state:** `SATISFIED_OFF`

**Given:**
- `FACT_SUCTION_PRESSURE_LOW`

**Expected System Check Result:** Off-cycle suction is not a steady-cooling diagnostic

**Confirmed findings:**
- Low suction is observed while cooling is satisfied/off

**What this means:** Pressures equalize/change when the system is off; steady-cooling patterns do not apply.

**Next Action / Check:** Wait for a cooling call and stable operation before interpreting suction pressure.

**Troubleshooting path:**
1. Confirm cooling demand
2. Run system
3. Remeasure after stabilization

**Must NOT conclude:**
- Do not diagnose low charge from an off-cycle suction reading.

**Technical basis:**
- ASHRAE refrigeration diagnostic principles — https://www.ashrae.org/

---

## CH2-C026 — Defrost heater voltage present and current absent

**Operating state:** `DEFROST`

**Given:**
- `FACT_DEFROST_COMMAND_PRESENT`
- `FACT_DEFROST_HEATER_VOLTAGE_PRESENT`
- `FACT_DEFROST_HEATER_CURRENT_ABSENT`

**Expected System Check Result:** Defrost heater/load circuit failure is localized

**Confirmed findings:**
- Defrost is commanded
- Voltage is present at heater
- Heater current is absent

**What this means:** Voltage with no current indicates an open heater/load circuit or connection rather than a missing command.

**Next Action / Check:** With power isolated, check heater resistance/continuity and wiring connections.

**Troubleshooting path:**
1. Isolate power
2. Ohm heater
3. Inspect wiring/connectors

**Must NOT conclude:**
- Do not replace the defrost controller when it is supplying heater voltage.

**Technical basis:**
- Heatcraft refrigeration systems installation/operation guidance — https://www.heatcraftrpd.com/resources/

---

## CH2-C027 — Defrost completes but drain refreezes

**Operating state:** `STABLE_COOLING`

**Given:**
- `FACT_DEFROST_COMPLETES`
- `FACT_DRAIN_REFREEZE`

**Expected System Check Result:** Drain/pan heat or drainage problem remains after successful defrost

**Confirmed findings:**
- Defrost clears the evaporator
- Drain water refreezes

**What this means:** The coil defrost function works; refreezing points to drainage, drain heat or routing/insulation.

**Next Action / Check:** Inspect drain heater, trap/slope, blockage and drain-line routing after confirming safe power isolation.

**Troubleshooting path:**
1. Inspect drain path
2. Check drain heater if equipped
3. Correct slope/blockage/insulation

**Must NOT conclude:**
- Do not replace the defrost heater solely because drain water refreezes.

**Technical basis:**
- Heatcraft refrigeration systems installation/operation guidance — https://www.heatcraftrpd.com/resources/

---

## CH2-C028 — Fan delay active immediately after defrost

**Operating state:** `POST_DEFROST`

**Given:**
- `FACT_POST_DEFROST_ACTIVE`
- `FACT_FAN_DELAY_ACTIVE`

**Expected System Check Result:** Evaporator fan delay is an expected post-defrost state

**Confirmed findings:**
- Post-defrost recovery is active
- Fan delay is intentionally active

**What this means:** Fans may remain off until the coil cools to prevent blowing heat/moisture into the box.

**Next Action / Check:** Verify fan delay terminates at the intended condition/time before diagnosing a fan fault.

**Troubleshooting path:**
1. Check fan-delay control
2. Wait for termination
3. Verify fan starts

**Must NOT conclude:**
- Do not condemn the evaporator fan while intentional fan delay is active.

**Technical basis:**
- Heatcraft refrigeration systems installation/operation guidance — https://www.heatcraftrpd.com/resources/

---

## CH2-C029 — Startup after long off-cycle with hot compressor

**Operating state:** `STARTUP`

**Given:**
- `FACT_LONG_OFF_CYCLE_STARTUP`
- `FACT_COMPRESSOR_HOT`

**Expected System Check Result:** Startup/migration history requires compressor-protection checks

**Confirmed findings:**
- Long off-cycle startup context is present
- Compressor is abnormally hot

**What this means:** Migration or liquid return can dilute oil and stress the compressor at startup.

**Next Action / Check:** Check crankcase heater/off-cycle protection and observe startup for liquid-return evidence before repeated starts.

**Troubleshooting path:**
1. Verify crankcase heater
2. Check oil/startup behavior
3. Correct migration source

**Must NOT conclude:**
- Do not repeatedly restart a compressor with suspected liquid slugging.

**Technical basis:**
- Copeland compressor/refrigeration application guidance — https://www.copeland.com/en-us/tools-resources

---

## CH2-C030 — Post-defrost abnormal pressures that normalize

**Operating state:** `POST_DEFROST`

**Given:**
- `FACT_POST_DEFROST_ACTIVE`
- `FACT_COND_SAT_HIGH`
- `FACT_SUCTION_PRESSURE_HIGH_FOR_LOAD`

**Expected System Check Result:** Post-defrost pressure transient requires stabilization

**Confirmed findings:**
- Post-defrost recovery is active
- Pressures are temporarily high

**What this means:** Heat added during defrost can temporarily raise load and pressures.

**Next Action / Check:** Trend readings through recovery and diagnose only if abnormal values persist in stable cooling.

**Troubleshooting path:**
1. Allow recovery
2. Trend pressures
3. Reassess after stabilization

**Must NOT conclude:**
- Do not diagnose overcharge from a transient post-defrost high head.

**Technical basis:**
- ASHRAE refrigeration diagnostic principles — https://www.ashrae.org/
- Heatcraft refrigeration systems installation/operation guidance — https://www.heatcraftrpd.com/resources/

---

## CH2-D031 — Cooling demand but contactor coil dead

**Operating state:** `STABLE_COOLING`

**Given:**
- `FACT_COOLING_DEMAND_PRESENT`
- `FACT_CONTACTOR_COIL_NOT_ENERGIZED`

**Expected System Check Result:** Control circuit is open upstream of the contactor coil

**Confirmed findings:**
- Cooling demand is present
- Contactor coil is not energized

**What this means:** The failure is in the control path or safety chain before the contactor coil, not yet the compressor power circuit.

**Next Action / Check:** Use the actual wiring diagram and trace control voltage through safeties/controllers to the coil.

**Troubleshooting path:**
1. Obtain wiring diagram
2. Trace control voltage
3. Find open control/safety

**Must NOT conclude:**
- Do not replace contactor power contacts or compressor before finding why the coil is dead.

**Technical basis:**
- Copeland compressor/refrigeration application guidance — https://www.copeland.com/en-us/tools-resources
- Heatcraft refrigeration systems installation/operation guidance — https://www.heatcraftrpd.com/resources/

---

## CH2-D032 — Contactor coil energized but no load-side voltage

**Operating state:** `STABLE_COOLING`

**Given:**
- `FACT_CONTACTOR_COIL_ENERGIZED`
- `FACT_CONTACTOR_NOT_PASSING_VOLTAGE`

**Expected System Check Result:** Contactor power contacts or supply path are faulty

**Confirmed findings:**
- Contactor coil is energized
- Contactor does not pass line voltage

**What this means:** The command reaches the contactor but power is not delivered through it.

**Next Action / Check:** With safe electrical procedures, verify line-side voltage and contact resistance/condition; replace defective contactor as appropriate.

**Troubleshooting path:**
1. Verify line voltage
2. Check contacts/output
3. Repair/replace contactor

**Must NOT conclude:**
- Do not condemn compressor before verifying voltage reaches it.

**Technical basis:**
- Copeland compressor/refrigeration application guidance — https://www.copeland.com/en-us/tools-resources

---

## CH2-D033 — Correct compressor voltage but no start + start fault

**Operating state:** `STABLE_COOLING`

**Given:**
- `FACT_COMPRESSOR_TERMINAL_VOLTAGE_PRESENT`
- `FACT_COMPRESSOR_NOT_RUNNING`
- `FACT_START_COMPONENT_FAULT`

**Expected System Check Result:** Compressor start circuit fault is localized

**Confirmed findings:**
- Correct terminal voltage is present
- Compressor does not start
- Start component fault is localized

**What this means:** The compressor is being supplied but the start circuit is defective.

**Next Action / Check:** Correct the identified start component/wiring fault, then verify starting current and operation.

**Troubleshooting path:**
1. Isolate power
2. Replace/repair failed start component
3. Retest start/current

**Must NOT conclude:**
- Do not replace the compressor before correcting the localized start-circuit fault.

**Technical basis:**
- Copeland compressor/refrigeration application guidance — https://www.copeland.com/en-us/tools-resources

---

## CH2-D034 — Fuse open with cause unknown

**Operating state:** `STABLE_COOLING`

**Given:**
- `FACT_FUSE_OPEN`

**Expected System Check Result:** Open fuse is a symptom; find the cause before replacement

**Confirmed findings:**
- Fuse is open/blown

**What this means:** A fuse can open from short circuit, grounded component, wiring fault or overcurrent.

**Next Action / Check:** De-energize and inspect/test the protected circuit for shorts/grounds/failed loads before replacing the fuse.

**Troubleshooting path:**
1. Isolate power
2. Check resistance/ground faults
3. Correct cause then replace fuse

**Must NOT conclude:**
- Do not repeatedly replace a fuse without finding why it opened.

**Technical basis:**
- Copeland compressor/refrigeration application guidance — https://www.copeland.com/en-us/tools-resources

---

## CH2-D035 — HP safety open with condenser fan stopped

**Operating state:** `STABLE_COOLING`

**Given:**
- `FACT_HP_SAFETY_OPEN`
- `FACT_COND_FAN_NOT_RUNNING`
- `FACT_COND_SAT_HIGH`

**Expected System Check Result:** Condenser airflow fault likely caused the HP trip

**Confirmed findings:**
- HP safety is open
- Condenser fan is stopped
- Head pressure is high

**What this means:** Loss of condenser airflow raises condensing pressure until the safety opens.

**Next Action / Check:** Find why the condenser fan stopped, restore airflow, then reset/retest per equipment procedure.

**Troubleshooting path:**
1. Check fan mechanical freedom
2. Check fan voltage/capacitor/motor
3. Restore airflow and recheck head

**Must NOT conclude:**
- Do not bypass the high-pressure safety.

**Technical basis:**
- Heatcraft refrigeration systems installation/operation guidance — https://www.heatcraftrpd.com/resources/
- Copeland compressor/refrigeration application guidance — https://www.copeland.com/en-us/tools-resources

---

## CH2-D036 — Overload open on hot compressor

**Operating state:** `STABLE_COOLING`

**Given:**
- `FACT_OVERLOAD_PROTECTION_OPEN`
- `FACT_COMPRESSOR_HOT`
- `FACT_OVERHEAT_CAUSE_UNRESOLVED`

**Expected System Check Result:** Compressor protection opened because an overheating/overcurrent cause remains

**Confirmed findings:**
- Compressor is hot
- Overload protection is open

**What this means:** The overload is protecting the compressor; the cause must be found before repeated restart.

**Next Action / Check:** Allow safe cooling, then check voltage/current, head pressure, refrigerant return and compressor condition before restart.

**Troubleshooting path:**
1. Allow compressor to cool
2. Check electrical/load conditions
3. Correct cause before restart

**Must NOT conclude:**
- Do not bypass the overload or repeatedly reset it.

**Technical basis:**
- Copeland compressor/refrigeration application guidance — https://www.copeland.com/en-us/tools-resources

---

## CH2-D037 — Solenoid commanded open with voltage but no flow

**Operating state:** `STABLE_COOLING`

**Given:**
- `FACT_SOLENOID_COMMAND_OPEN`
- `FACT_SOLENOID_COIL_VOLTAGE_PRESENT`
- `FACT_SOLENOID_NO_FLOW_WHEN_OPEN`

**Expected System Check Result:** Liquid solenoid mechanical/flow fault is localized

**Confirmed findings:**
- Solenoid is commanded open
- Correct coil voltage is present
- No refrigerant flow occurs

**What this means:** The electrical command is present; the remaining fault is valve/mechanical/restriction related.

**Next Action / Check:** Verify coil magnetism/valve orientation and pressure differential, then inspect/service the valve.

**Troubleshooting path:**
1. Verify coil action
2. Check pressure differential/orientation
3. Service valve

**Must NOT conclude:**
- Do not blame thermostat/control command when correct coil voltage is present.

**Technical basis:**
- Danfoss refrigeration troubleshooting/application guidance — https://www.danfoss.com/en/service-and-support/

---

## CH2-D038 — Solenoid commanded closed but flow continues

**Operating state:** `STABLE_COOLING`

**Given:**
- `FACT_SOLENOID_COMMAND_CLOSED`
- `FACT_SOLENOID_FLOW_CONTINUES_CLOSED`

**Expected System Check Result:** Liquid solenoid is leaking/stuck open

**Confirmed findings:**
- Solenoid is commanded closed
- Liquid continues to feed

**What this means:** Flow despite a close command indicates valve leakage, debris or mechanical failure.

**Next Action / Check:** Verify command/voltage state and inspect/service the solenoid valve seat/plunger.

**Troubleshooting path:**
1. Confirm de-energized/closed command
2. Check for flow
3. Service valve

**Must NOT conclude:**
- Do not adjust refrigerant charge to compensate for a leaking solenoid.

**Technical basis:**
- Danfoss refrigeration troubleshooting/application guidance — https://www.danfoss.com/en/service-and-support/

---

## CH2-D039 — Anti-short-cycle delay active with demand

**Operating state:** `STABLE_COOLING`

**Given:**
- `FACT_COOLING_DEMAND_PRESENT`
- `FACT_ANTI_SHORT_CYCLE_DELAY_ACTIVE`
- `FACT_COMPRESSOR_NOT_RUNNING`

**Expected System Check Result:** Compressor off-time delay is intentionally preventing restart

**Confirmed findings:**
- Cooling demand exists
- Anti-short-cycle delay is active
- Compressor is not running

**What this means:** A configured delay can intentionally hold the compressor off to protect it.

**Next Action / Check:** Verify the configured delay and allow it to expire; confirm compressor starts afterward.

**Troubleshooting path:**
1. Check controller timer
2. Wait for delay
3. Verify start

**Must NOT conclude:**
- Do not bypass the delay or condemn the compressor while the delay is active.

**Technical basis:**
- Copeland compressor/refrigeration application guidance — https://www.copeland.com/en-us/tools-resources
- Heatcraft refrigeration systems installation/operation guidance — https://www.heatcraftrpd.com/resources/

---

## CH2-D040 — LP control opens too early during cooling

**Operating state:** `STABLE_COOLING`

**Given:**
- `FACT_LOW_PRESSURE_CONTROL_TRIP`
- `FACT_COOLING_DEMAND_PRESENT`
- `FACT_BOX_TEMP_HIGH`

**Expected System Check Result:** LP control setting/operation may be preventing adequate cooling

**Confirmed findings:**
- Room is warm with cooling demand
- LP control opens/trips

**What this means:** An LP control that opens above the intended cutout can prematurely stop refrigeration.

**Next Action / Check:** Compare cut-in/cutout to the application and actual suction pressure; verify sensing line/control calibration before adjustment or replacement.

**Troubleshooting path:**
1. Measure actual cutout
2. Compare setting/spec
3. Inspect sensing line/control

**Must NOT conclude:**
- Do not add refrigerant merely to keep an incorrectly set LP control closed.

**Technical basis:**
- Danfoss refrigeration troubleshooting/application guidance — https://www.danfoss.com/en/service-and-support/
- Heatcraft refrigeration systems installation/operation guidance — https://www.heatcraftrpd.com/resources/

---

## CH2-E041 — Evap fan stopped + dirty condenser + warm room

**Operating state:** `STABLE_COOLING`

**Given:**
- `FACT_EVAP_FAN_NOT_RUNNING`
- `FACT_COND_COIL_DIRTY`
- `FACT_BOX_TEMP_HIGH`

**Expected System Check Result:** Evaporator fan fault is primary, with dirty condenser also active

**Confirmed findings:**
- Evaporator fan is stopped
- Condenser coil is dirty
- Room is warm

**What this means:** Both airflow faults matter; the stopped evaporator fan directly prevents heat pickup and should be addressed first without losing the condenser finding.

**Next Action / Check:** Repair evaporator fan operation first, then clean/verify condenser airflow and reassess cooling.

**Troubleshooting path:**
1. Restore evap fan
2. Clean condenser
3. Run stable cooling and recheck

**Must NOT conclude:**
- Do not drop the dirty condenser finding after selecting the evaporator fan as primary.

**Technical basis:**
- ASHRAE refrigeration diagnostic principles — https://www.ashrae.org/
- Heatcraft refrigeration systems installation/operation guidance — https://www.heatcraftrpd.com/resources/

---

## CH2-E042 — Dirty condenser + sensor error + high load

**Operating state:** `STABLE_COOLING`

**Given:**
- `FACT_COND_COIL_DIRTY`
- `FACT_SENSOR_ERROR`
- `FACT_HIGH_PRODUCT_LOAD`

**Expected System Check Result:** Multiple independent problems are active

**Confirmed findings:**
- Condenser is dirty
- Sensor error is present
- Warm/high product load is present

**What this means:** Heat rejection, control accuracy and load can all affect performance; one finding does not erase the others.

**Next Action / Check:** Correct condenser airflow and sensor accuracy, account for the temporary load, then reassess stable performance.

**Troubleshooting path:**
1. Clean condenser
2. Verify/calibrate sensor
3. Reassess after load falls

**Must NOT conclude:**
- Do not force all symptoms into a single refrigerant-charge diagnosis.

**Technical basis:**
- ASHRAE refrigeration diagnostic principles — https://www.ashrae.org/
- Heatcraft refrigeration systems installation/operation guidance — https://www.heatcraftrpd.com/resources/

---

## CH2-E043 — Iced coil + fan stopped + drain refreeze

**Operating state:** `STABLE_COOLING`

**Given:**
- `FACT_EVAP_COIL_ICED`
- `FACT_EVAP_FAN_NOT_RUNNING`
- `FACT_DRAIN_REFREEZE`

**Expected System Check Result:** Evaporator airflow fault with a separate drainage/refreeze issue

**Confirmed findings:**
- Evaporator coil is iced
- Evaporator fan is stopped
- Drain water refreezes

**What this means:** The fan fault can contribute to icing, while drain refreeze is a separate condition that also needs correction.

**Next Action / Check:** Restore fan operation, clear/defrost coil safely, then inspect drain heat/path before returning to service.

**Troubleshooting path:**
1. Repair fan
2. Clear ice
3. Correct drain issue
4. Retest

**Must NOT conclude:**
- Do not treat drain refreeze as proof of a failed defrost heater.

**Technical basis:**
- Heatcraft refrigeration systems installation/operation guidance — https://www.heatcraftrpd.com/resources/

---

## CH2-E044 — High SH + drier drop + TXV bulb fault

**Operating state:** `STABLE_COOLING`

**Given:**
- `FACT_EVAP_SH_HIGH`
- `FACT_DRIER_TEMP_DROP`
- `FACT_TXV_BULB_BAD_CONTACT`

**Expected System Check Result:** Two starvation causes are directly observed

**Confirmed findings:**
- Superheat is high
- Drier restriction evidence exists
- TXV bulb contact is bad

**What this means:** Both an upstream restriction and bad TXV sensing input can starve the evaporator.

**Next Action / Check:** Correct both known faults, then stabilize and remeasure before judging charge.

**Troubleshooting path:**
1. Correct drier restriction
2. Correct bulb mounting
3. Stabilize and recheck SH/SC

**Must NOT conclude:**
- Do not add refrigerant before correcting the known restriction and bulb fault.

**Technical basis:**
- Parker Sporlan expansion valve and refrigeration troubleshooting guidance — https://www.parker.com/us/en/divisions/sporlan-division.html

---

## CH2-E045 — High head + fan stopped + overcharge evidence

**Operating state:** `STABLE_COOLING`

**Given:**
- `FACT_COND_SAT_HIGH`
- `FACT_COND_FAN_NOT_RUNNING`
- `FACT_OVERCHARGE_EVIDENCE`

**Expected System Check Result:** Restore condenser airflow before judging remaining overcharge evidence

**Confirmed findings:**
- Head pressure is high
- Condenser fan is stopped
- Overcharge evidence is also present

**What this means:** A stopped fan is an immediate high-head cause; charge interpretation should be repeated after airflow is restored.

**Next Action / Check:** Repair condenser fan first, then stabilize and reassess head/subcooling and the independent overcharge evidence.

**Troubleshooting path:**
1. Restore fan
2. Stabilize
3. Reevaluate charge evidence

**Must NOT conclude:**
- Do not recover refrigerant solely to lower head while condenser airflow is failed.

**Technical basis:**
- ASHRAE refrigeration diagnostic principles — https://www.ashrae.org/
- Heatcraft refrigeration systems installation/operation guidance — https://www.heatcraftrpd.com/resources/

---

## CH2-E046 — Low-charge pattern + confirmed leak + drier restriction

**Operating state:** `STABLE_COOLING`

**Given:**
- `FACT_EVAP_SH_HIGH`
- `FACT_SUBCOOLING_LOW`
- `FACT_LEAK_CONFIRMED`
- `FACT_DRIER_TEMP_DROP`

**Expected System Check Result:** Confirmed leak and liquid-line restriction are both active

**Confirmed findings:**
- High SH/low SC pattern exists
- Refrigerant leak is confirmed
- Drier restriction is confirmed

**What this means:** Low inventory and restriction can coexist; both direct findings must be resolved before final charge evaluation.

**Next Action / Check:** Repair leak and restriction using proper service procedures, evacuate/recharge appropriately, then verify stable readings.

**Troubleshooting path:**
1. Repair leak
2. Replace restricted drier
3. Evacuate/recharge
4. Retest

**Must NOT conclude:**
- Do not correct charge alone and leave the restriction or leak unresolved.

**Technical basis:**
- Parker Sporlan expansion valve and refrigeration troubleshooting guidance — https://www.parker.com/us/en/divisions/sporlan-division.html
- ASHRAE refrigeration diagnostic principles — https://www.ashrae.org/

---

## CH2-E047 — Sensor error + refrigeration normal + warm room

**Operating state:** `STABLE_COOLING`

**Given:**
- `FACT_SENSOR_ERROR`
- `FACT_REFRIGERATION_PERFORMANCE_NORMAL`
- `FACT_BOX_TEMP_HIGH`

**Expected System Check Result:** Control/sensing problem is favored over refrigerant fault

**Confirmed findings:**
- Sensor error is present
- Refrigeration performance is otherwise normal
- Room appears warm

**What this means:** If refrigeration performance is normal but sensing is wrong, the control may be responding to bad information.

**Next Action / Check:** Compare sensor to independent reference, inspect placement/wiring and calibrate/replace as appropriate.

**Troubleshooting path:**
1. Verify reference temperature
2. Check sensor placement/wiring
3. Correct sensor

**Must NOT conclude:**
- Do not open the refrigerant circuit when refrigeration performance is verified normal.

**Technical basis:**
- Heatcraft refrigeration systems installation/operation guidance — https://www.heatcraftrpd.com/resources/

---

## CH2-E048 — High product load + normal refrigeration + long runtime

**Operating state:** `STABLE_COOLING`

**Given:**
- `FACT_HIGH_PRODUCT_LOAD`
- `FACT_REFRIGERATION_PERFORMANCE_NORMAL`
- `FACT_COMPRESSOR_LONG_RUNTIME`

**Expected System Check Result:** Long runtime is explained by temporary high load

**Confirmed findings:**
- Large warm product load is present
- Refrigeration performance is normal
- Compressor runs long

**What this means:** A large load can legitimately extend runtime even when the system is healthy.

**Next Action / Check:** Track box/product temperature and confirm pull-down progresses; reassess after load normalizes.

**Troubleshooting path:**
1. Trend temperature
2. Verify pull-down progress
3. Reassess after load falls

**Must NOT conclude:**
- Do not condemn the compressor solely for long runtime during a verified high load.

**Technical basis:**
- ASHRAE refrigeration diagnostic principles — https://www.ashrae.org/
- Heatcraft refrigeration systems installation/operation guidance — https://www.heatcraftrpd.com/resources/

---

## CH2-E049 — Load exceeds capacity with all major functions normal

**Operating state:** `STABLE_COOLING`

**Given:**
- `FACT_DESIGN_LOAD_EXCEEDS_CAPACITY`
- `FACT_REFRIGERATION_PERFORMANCE_NORMAL`
- `FACT_AIRFLOW_VERIFIED_NORMAL`
- `FACT_CONTROLS_VERIFIED_NORMAL`

**Expected System Check Result:** Cooling load exceeds available system capacity

**Confirmed findings:**
- Actual/design load exceeds capacity
- Refrigeration performance is normal
- Airflow and controls are normal

**What this means:** A correctly operating system cannot maintain setpoint when the load exceeds its available capacity.

**Next Action / Check:** Quantify load and equipment capacity; reduce load or correct equipment sizing/design rather than adjusting charge.

**Troubleshooting path:**
1. Confirm load calculation
2. Compare rated capacity
3. Reduce load or resize system

**Must NOT conclude:**
- Do not add refrigerant to fix an undersized system.

**Technical basis:**
- ASHRAE refrigeration diagnostic principles — https://www.ashrae.org/

---

## CH2-E050 — Unknown state + direct condenser fan fault

**Operating state:** `UNKNOWN`

**Given:**
- `FACT_COND_FAN_NOT_RUNNING`

**Expected System Check Result:** Condenser fan is not running

**Confirmed findings:**
- Condenser fan is directly observed not operating

**What this means:** A direct physical airflow fault should not be hidden merely because operating state is not yet confirmed.

**Next Action / Check:** With power safely isolated, check fan mechanical freedom; then verify fan command/voltage and capacitor/motor as applicable.

**Troubleshooting path:**
1. Mechanical check
2. Electrical check
3. Repair and recheck head

**Must NOT conclude:**
- Do not make operating-state confirmation the only primary action when a direct fan fault is observed.

**Technical basis:**
- Heatcraft refrigeration systems installation/operation guidance — https://www.heatcraftrpd.com/resources/

---

## CH2-F051 — Moisture indicator wet with otherwise normal operation

**Operating state:** `STABLE_COOLING`

**Given:**
- `FACT_MOISTURE_INDICATED`
- `FACT_REFRIGERATION_PERFORMANCE_NORMAL`

**Expected System Check Result:** Moisture contamination requires service attention even if cooling appears normal

**Confirmed findings:**
- Moisture indicator shows wet
- Refrigeration performance is otherwise normal

**What this means:** Moisture can cause acid, ice/restriction and reliability problems before obvious performance loss.

**Next Action / Check:** Verify indicator condition and system history; correct moisture source and replace drier/evacuate per proper service practice as needed.

**Troubleshooting path:**
1. Confirm indicator
2. Assess contamination/service history
3. Correct moisture/drier/vacuum

**Must NOT conclude:**
- Do not ignore a wet moisture indicator merely because temperatures are currently normal.

**Technical basis:**
- Parker Sporlan expansion valve and refrigeration troubleshooting guidance — https://www.parker.com/us/en/divisions/sporlan-division.html

---

## CH2-F052 — TXV hunting with head-control instability

**Operating state:** `STABLE_COOLING`

**Given:**
- `FACT_TXV_HUNTING`
- `FACT_HEAD_PRESSURE_CONTROL_ABNORMAL`

**Expected System Check Result:** Stabilize liquid/head conditions before condemning TXV

**Confirmed findings:**
- TXV/feed is hunting
- Head-pressure control is unstable

**What this means:** Unstable condensing/liquid conditions can drive unstable TXV feed.

**Next Action / Check:** Correct head-pressure control instability first, then reassess superheat and TXV response under stable liquid supply.

**Troubleshooting path:**
1. Stabilize head control
2. Verify liquid supply
3. Recheck TXV hunting

**Must NOT conclude:**
- Do not replace the TXV before stabilizing its inlet conditions.

**Technical basis:**
- Parker Sporlan expansion valve and refrigeration troubleshooting guidance — https://www.parker.com/us/en/divisions/sporlan-division.html
- Danfoss refrigeration troubleshooting/application guidance — https://www.danfoss.com/en/service-and-support/

---

## CH2-F053 — Uneven evaporator feed with proper inlet liquid

**Operating state:** `STABLE_COOLING`

**Given:**
- `FACT_EVAP_FEED_UNEVEN`
- `FACT_TXV_UPSTREAM_LIQUID_PROPER`

**Expected System Check Result:** Evaporator distribution/feed problem needs localization

**Confirmed findings:**
- Evaporator feed/frost pattern is uneven
- Proper liquid reaches the TXV

**What this means:** Uneven distribution can come from distributor/nozzle/circuit restriction or valve/feed issues even with good inlet liquid.

**Next Action / Check:** Inspect distributor/nozzle/circuit temperatures and TXV application/feeding before adjusting charge.

**Troubleshooting path:**
1. Compare circuit temperatures
2. Inspect distributor/nozzle
3. Verify TXV application

**Must NOT conclude:**
- Do not diagnose low total charge solely from an uneven frost pattern.

**Technical basis:**
- Parker Sporlan expansion valve and refrigeration troubleshooting guidance — https://www.parker.com/us/en/divisions/sporlan-division.html

---

## CH2-F054 — High discharge temperature + low suction + high SH

**Operating state:** `STABLE_COOLING`

**Given:**
- `FACT_COMPRESSOR_HIGH_DLT`
- `FACT_SUCTION_PRESSURE_LOW`
- `FACT_EVAP_SH_HIGH`

**Expected System Check Result:** Compressor overheating is consistent with evaporator starvation/high compression stress

**Confirmed findings:**
- Discharge temperature is high
- Suction is low
- Superheat is high

**What this means:** Low mass flow and high compression ratio can overheat the compressor; the starvation cause must be isolated.

**Next Action / Check:** Protect the compressor and check liquid supply, restriction/TXV feed and charge/leak evidence before continued operation.

**Troubleshooting path:**
1. Check compressor limits
2. Check liquid supply/restrictions
3. Check charge/leak evidence

**Must NOT conclude:**
- Do not keep running a compressor above its temperature limit while troubleshooting.

**Technical basis:**
- Copeland compressor/refrigeration application guidance — https://www.copeland.com/en-us/tools-resources
- Parker Sporlan expansion valve and refrigeration troubleshooting guidance — https://www.parker.com/us/en/divisions/sporlan-division.html

---

## CH2-F055 — High current + high head + dirty condenser

**Operating state:** `STABLE_COOLING`

**Given:**
- `FACT_COMPRESSOR_HIGH_CURRENT`
- `FACT_COND_SAT_HIGH`
- `FACT_COND_COIL_DIRTY`

**Expected System Check Result:** High compressor load is consistent with poor condenser heat rejection

**Confirmed findings:**
- Compressor current is high
- Head pressure is high
- Condenser is dirty

**What this means:** A dirty condenser raises condensing pressure and compressor workload/current.

**Next Action / Check:** Clean condenser and verify airflow, then recheck head pressure and compressor current against ratings.

**Troubleshooting path:**
1. Clean coil
2. Verify fan/airflow
3. Recheck head/current

**Must NOT conclude:**
- Do not condemn compressor from high current before correcting the known high-head cause.

**Technical basis:**
- Copeland compressor/refrigeration application guidance — https://www.copeland.com/en-us/tools-resources
- Heatcraft refrigeration systems installation/operation guidance — https://www.heatcraftrpd.com/resources/

---

## CH2-F056 — Compressor hot but head not excessive

**Operating state:** `STABLE_COOLING`

**Given:**
- `FACT_COMPRESSOR_HOT`
- `FACT_HEAD_NOT_EXCESSIVE`
- `FACT_OVERHEAT_CAUSE_UNRESOLVED`

**Expected System Check Result:** Compressor overheating needs causes beyond high head

**Confirmed findings:**
- Compressor is hot
- Head pressure is not excessive

**What this means:** Overheating can result from electrical problems, high compression ratio/low suction, inadequate cooling or internal problems even without high head.

**Next Action / Check:** Check voltage/current, suction/compression ratio, return-gas conditions and overload history.

**Troubleshooting path:**
1. Electrical checks
2. Compression ratio/suction
3. Return-gas/floodback history

**Must NOT conclude:**
- Do not assume condenser/high head is the cause when head is not excessive.

**Technical basis:**
- Copeland compressor/refrigeration application guidance — https://www.copeland.com/en-us/tools-resources

---

## CH2-F057 — Low ambient + low head + head control installed

**Operating state:** `STABLE_COOLING`

**Given:**
- `FACT_LOW_AMBIENT`
- `FACT_COND_SAT_LOW`
- `FACT_HEAD_CONTROL_INSTALLED`

**Expected System Check Result:** Low-ambient head-pressure control performance should be checked

**Confirmed findings:**
- Ambient is low
- Head pressure is low
- Head-pressure control is installed

**What this means:** The control should maintain sufficient liquid pressure under low ambient; low head suggests control/setup/inventory issues.

**Next Action / Check:** Verify control mode/setting, fan cycling or flooding action and required receiver/flood charge.

**Troubleshooting path:**
1. Check control operation
2. Check setting
3. Check required charge/inventory

**Must NOT conclude:**
- Do not automatically add refrigerant without verifying head-control design and operation.

**Technical basis:**
- Danfoss refrigeration troubleshooting/application guidance — https://www.danfoss.com/en/service-and-support/
- Heatcraft refrigeration systems installation/operation guidance — https://www.heatcraftrpd.com/resources/

---

## CH2-F058 — High head with clean coil and normal airflow

**Operating state:** `STABLE_COOLING`

**Given:**
- `FACT_COND_SAT_HIGH`
- `FACT_COND_COIL_CLEAN`
- `FACT_COND_FAN_RUNNING`
- `FACT_COND_AIRFLOW_NORMAL`

**Expected System Check Result:** High head remains after condenser airflow causes are excluded

**Confirmed findings:**
- Head pressure is high
- Condenser coil/fan/airflow are normal

**What this means:** With airflow verified, investigate ambient/load, overcharge, noncondensables or other condensing-side causes.

**Next Action / Check:** Verify ambient/load and discriminate overcharge from noncondensables using applicable charge/subcooling and service evidence.

**Troubleshooting path:**
1. Check ambient/load
2. Check SC/charge evidence
3. Check noncondensable evidence

**Must NOT conclude:**
- Do not keep cleaning or replacing condenser airflow components that are verified normal.

**Technical basis:**
- ASHRAE refrigeration diagnostic principles — https://www.ashrae.org/

---

## CH2-F059 — Warm room + normal refrigeration + door infiltration

**Operating state:** `STABLE_COOLING`

**Given:**
- `FACT_BOX_TEMP_HIGH`
- `FACT_REFRIGERATION_PERFORMANCE_NORMAL`
- `FACT_DOOR_INFILTRATION_CONFIRMED`

**Expected System Check Result:** Confirmed infiltration is the primary warm-room load

**Confirmed findings:**
- Room is warm
- Refrigeration performance is normal
- Door infiltration is confirmed

**What this means:** Warm humid air entering the box can exceed load expectations even when the refrigeration circuit is healthy.

**Next Action / Check:** Correct the door/gasket/infiltration source, then verify pull-down before changing refrigerant settings.

**Troubleshooting path:**
1. Repair door/gasket
2. Verify closure
3. Trend pull-down

**Must NOT conclude:**
- Do not add refrigerant to compensate for a confirmed infiltration load.

**Technical basis:**
- Heatcraft refrigeration systems installation/operation guidance — https://www.heatcraftrpd.com/resources/

---

## CH2-F060 — Conflicting high-head and low-charge clues

**Operating state:** `STABLE_COOLING`

**Given:**
- `FACT_COND_SAT_HIGH`
- `FACT_EVAP_SH_HIGH`
- `FACT_SUBCOOLING_LOW`
- `FACT_SIGHT_GLASS_FLASHING`

**Expected System Check Result:** Evidence conflicts; do not force a single charge diagnosis

**Confirmed findings:**
- Head pressure is high
- Superheat is high
- Subcooling is low
- Sight glass shows bubbles

**What this means:** The starvation clues suggest poor liquid supply, while high head conflicts with a simple low-charge pattern; multiple faults or operating conditions may be involved.

**Next Action / Check:** Verify operating state, condenser airflow/ambient and liquid-line restriction/leak evidence before changing charge.

**Troubleshooting path:**
1. Confirm stable state
2. Check condenser conditions
3. Check restriction/leak evidence
4. Then reassess charge

**Must NOT conclude:**
- Do not add refrigerant solely because SH is high and SC is low when high head is unexplained.

**Technical basis:**
- ASHRAE refrigeration diagnostic principles — https://www.ashrae.org/
- Parker Sporlan expansion valve and refrigeration troubleshooting guidance — https://www.parker.com/us/en/divisions/sporlan-division.html

---
