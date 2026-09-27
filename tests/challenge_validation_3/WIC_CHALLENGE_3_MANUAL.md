# HVAC/R Field Tool — Challenge Validation #3

**Frozen Brain:** 2.0.12  
**Cases:** 70  
**Design:** 50 reusable CORE refrigeration cases + 20 WIC/freezer-specific cases.

Expected answers were defined before running the frozen Brain. CORE classification means the diagnostic relationship is reusable; numerical targets and system-specific controls still require a system adapter.

## CH3-R001 — High SH but measurement taken before stable operation

**Scope:** CORE  
**Applicable systems:** walk_in_cooler, walk_in_freezer, split_ac  
**Operating state:** UNKNOWN

**Given facts:**
- `FACT_EVAP_SH_HIGH`
- `FACT_EVAP_SH_MEASURED`

**Expected System Check:** High superheat is not yet valid for steady-state diagnosis

**Confirmed findings:**
- High evaporator superheat is recorded without confirmed stable cooling

**What this means:** Transient operation can make superheat misleading.

**Next Action / Check:** Confirm stable cooling, allow stabilization, then repeat superheat and liquid-side checks.

**Troubleshooting path:**
- Confirm compressor/cooling demand
- Wait for stable operation
- Repeat SH and SC

**Must NOT conclude:**
- Do not diagnose low charge from this reading alone.

**Technical basis:**
- Danfoss Cold Room Troubleshooting & Fault Diagnosis: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker Sporlan Bulletin 10-11 TEV Troubleshooting: https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-010/10-11.pdf

---

## CH3-R002 — Low SC with receiver present and no applicable target

**Scope:** CORE  
**Applicable systems:** walk_in_cooler, walk_in_freezer, split_ac  
**Operating state:** STABLE_COOLING

**Given facts:**
- `FACT_SUBCOOLING_LOW`
- `FACT_SUBCOOLING_MEASURED`
- `FACT_RECEIVER_PRESENT`
- `FACT_SC_REFERENCE_NOT_APPLICABLE`

**Expected System Check:** Subcooling value is not diagnostic against a non-applicable target

**Confirmed findings:**
- Receiver is present
- The available subcooling reference is not applicable

**What this means:** Receiver/configuration and measurement location can make a generic SC target invalid.

**Next Action / Check:** Use the equipment charging method and applicable measurement location before judging charge.

**Troubleshooting path:**
- Identify manufacturer charging method
- Verify measurement location
- Re-evaluate liquid condition

**Must NOT conclude:**
- Do not diagnose low charge from an inapplicable subcooling target.

**Technical basis:**
- Danfoss Cold Room Troubleshooting & Fault Diagnosis: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker Sporlan Bulletin 10-11 TEV Troubleshooting: https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-010/10-11.pdf

---

## CH3-R003 — Model target conflicts with generic subcooling reference

**Scope:** CORE  
**Applicable systems:** walk_in_cooler, walk_in_freezer, split_ac  
**Operating state:** STABLE_COOLING

**Given facts:**
- `FACT_SUBCOOLING_MEASURED`
- `FACT_MODEL_SPECIFIC_TARGET_AVAILABLE`
- `FACT_GENERIC_REFERENCE_CONFLICTS_MODEL`

**Expected System Check:** Use the applicable model-specific charging target

**Confirmed findings:**
- A model-specific target is available
- Generic reference conflicts with the model target

**What this means:** Equipment-specific charging data takes precedence over a generic reference.

**Next Action / Check:** Compare the measured value with the manufacturer/model target at the specified condition and location.

**Troubleshooting path:**
- Confirm model and refrigerant
- Use manufacturer target
- Record measurement location

**Technical basis:**
- Danfoss Cold Room Troubleshooting & Fault Diagnosis: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker Sporlan Bulletin 10-11 TEV Troubleshooting: https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-010/10-11.pdf

---

## CH3-R004 — High SH with proper liquid and no localized restriction

**Scope:** CORE  
**Applicable systems:** walk_in_cooler, walk_in_freezer, split_ac  
**Operating state:** STABLE_COOLING

**Given facts:**
- `FACT_EVAP_SH_HIGH`
- `FACT_EVAP_SH_MEASURED`
- `FACT_TXV_UPSTREAM_LIQUID_PROPER`
- `FACT_NO_LOCALIZED_RESTRICTION`
- `FACT_TXV_BULB_BAD_CONTACT`

**Expected System Check:** High SH is localized toward TXV sensing/bulb installation

**Confirmed findings:**
- High superheat
- Proper liquid reaches TXV
- No upstream restriction
- TXV bulb contact is poor

**What this means:** The feed problem is downstream/control-side rather than proof of low charge.

**Next Action / Check:** Correct bulb mounting/contact, then recheck valve response and superheat.

**Troubleshooting path:**
- Correct bulb installation
- Verify insulation/location
- Recheck SH

**Must NOT conclude:**
- Do not add refrigerant solely because superheat is high.

**Technical basis:**
- Danfoss Cold Room Troubleshooting & Fault Diagnosis: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker Sporlan Bulletin 10-11 TEV Troubleshooting: https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-010/10-11.pdf

---

## CH3-R005 — High SH with proper liquid, good bulb, valve no response

**Scope:** CORE  
**Applicable systems:** walk_in_cooler, walk_in_freezer, split_ac  
**Operating state:** STABLE_COOLING

**Given facts:**
- `FACT_EVAP_SH_HIGH`
- `FACT_TXV_UPSTREAM_LIQUID_PROPER`
- `FACT_NO_LOCALIZED_RESTRICTION`
- `FACT_TXV_NO_RESPONSE`

**Expected System Check:** TXV does not respond despite proper inlet liquid

**Confirmed findings:**
- High superheat
- Proper liquid at TXV inlet
- No localized restriction
- TXV does not respond

**What this means:** Evidence localizes the fault toward the valve/power element.

**Next Action / Check:** Verify equalizer and valve application, then test/replace the TXV if non-response remains.

**Troubleshooting path:**
- Verify equalizer
- Verify refrigerant/valve match
- Confirm valve response

**Technical basis:**
- Danfoss Cold Room Troubleshooting & Fault Diagnosis: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker Sporlan Bulletin 10-11 TEV Troubleshooting: https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-010/10-11.pdf

---

## CH3-R006 — Low suction caused by verified low load

**Scope:** CORE  
**Applicable systems:** walk_in_cooler, walk_in_freezer, split_ac  
**Operating state:** STABLE_COOLING

**Given facts:**
- `FACT_SUCTION_PRESSURE_LOW`
- `FACT_LOW_EVAP_LOAD`
- `FACT_EVAP_COIL_CLEAR`
- `FACT_EVAP_FAN_RUNNING`

**Expected System Check:** Low suction is consistent with low evaporator load

**Confirmed findings:**
- Suction pressure is low
- Evaporator load is verified low
- Airflow path is normal

**What this means:** Low suction by itself is not proof of refrigerant shortage.

**Next Action / Check:** Confirm room/load condition and evaluate suction against the expected low-load operating condition.

**Troubleshooting path:**
- Confirm box temperature/load
- Check stable state
- Compare to applicable target

**Must NOT conclude:**
- Do not diagnose low charge from low suction alone.

**Technical basis:**
- Danfoss Cold Room Troubleshooting & Fault Diagnosis: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker Sporlan Bulletin 10-11 TEV Troubleshooting: https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-010/10-11.pdf

---

## CH3-R007 — Low suction plus iced evaporator

**Scope:** CORE  
**Applicable systems:** walk_in_cooler, walk_in_freezer, split_ac  
**Operating state:** STABLE_COOLING

**Given facts:**
- `FACT_SUCTION_PRESSURE_LOW`
- `FACT_EVAP_COIL_ICED`
- `FACT_EVAP_AIRFLOW_LOW`

**Expected System Check:** Evaporator icing and airflow restriction can drive low suction

**Confirmed findings:**
- Low suction pressure
- Evaporator is iced
- Evaporator airflow is low

**What this means:** Heat transfer is reduced and refrigerant readings are secondary until airflow is restored.

**Next Action / Check:** Clear the ice and correct the cause of icing/airflow loss before judging charge.

**Troubleshooting path:**
- Restore evaporator airflow
- Determine why coil iced
- Recheck pressures after stable cooling

**Technical basis:**
- Danfoss Cold Room Troubleshooting & Fault Diagnosis: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker Sporlan Bulletin 10-11 TEV Troubleshooting: https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-010/10-11.pdf

---

## CH3-R008 — Low suction plus solenoid commanded open but no flow

**Scope:** CORE  
**Applicable systems:** walk_in_cooler, walk_in_freezer, split_ac  
**Operating state:** STABLE_COOLING

**Given facts:**
- `FACT_SUCTION_PRESSURE_LOW`
- `FACT_SOLENOID_COMMAND_OPEN`
- `FACT_SOLENOID_COIL_VOLTAGE_PRESENT`
- `FACT_SOLENOID_NO_FLOW_WHEN_OPEN`

**Expected System Check:** Liquid solenoid/feed fault is starving the evaporator

**Confirmed findings:**
- Low suction
- Solenoid is commanded open with correct coil voltage
- No refrigerant flow through solenoid

**What this means:** The feed interruption is localized at the solenoid/mechanical path.

**Next Action / Check:** Verify pressure differential and valve mechanics; repair the solenoid/feed fault before charge diagnosis.

**Troubleshooting path:**
- Confirm coil voltage
- Check valve opening/pressure drop
- Repair mechanical restriction

**Technical basis:**
- Danfoss Cold Room Troubleshooting & Fault Diagnosis: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker Sporlan Bulletin 10-11 TEV Troubleshooting: https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-010/10-11.pdf

---

## CH3-R009 — High SH plus drier temperature drop and low SC

**Scope:** CORE  
**Applicable systems:** walk_in_cooler, walk_in_freezer, split_ac  
**Operating state:** STABLE_COOLING

**Given facts:**
- `FACT_EVAP_SH_HIGH`
- `FACT_SUBCOOLING_LOW`
- `FACT_DRIER_TEMP_DROP`
- `FACT_DRIER_TEMPERATURES_MEASURED`

**Expected System Check:** Liquid-line restriction evidence takes priority over charge pattern

**Confirmed findings:**
- High superheat
- Low subcooling
- Temperature drop across filter drier

**What this means:** A restriction can create starvation and charge-like symptoms.

**Next Action / Check:** Measure/confirm drier pressure or temperature drop and replace the restricted drier as appropriate, then retest.

**Troubleshooting path:**
- Confirm localized drier drop
- Correct restriction
- Recheck SH/SC

**Must NOT conclude:**
- Do not add refrigerant before correcting the confirmed restriction.

**Technical basis:**
- Danfoss Cold Room Troubleshooting & Fault Diagnosis: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker Sporlan Bulletin 10-11 TEV Troubleshooting: https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-010/10-11.pdf

---

## CH3-R010 — Low-charge pattern with confirmed leak

**Scope:** CORE  
**Applicable systems:** walk_in_cooler, walk_in_freezer, split_ac  
**Operating state:** STABLE_COOLING

**Given facts:**
- `FACT_SUCTION_PRESSURE_LOW`
- `FACT_COND_SAT_LOW`
- `FACT_EVAP_SH_HIGH`
- `FACT_SUBCOOLING_LOW`
- `FACT_LEAK_CONFIRMED`

**Expected System Check:** Confirmed refrigerant leak supports a low-charge condition

**Confirmed findings:**
- Low suction/head pattern
- High superheat
- Low subcooling
- Refrigerant leak is confirmed

**What this means:** The combined evidence supports refrigerant loss rather than a single-reading guess.

**Next Action / Check:** Repair the leak, evacuate/charge by the approved method, then verify stable operation.

**Troubleshooting path:**
- Repair leak
- Leak test/evacuate
- Charge per manufacturer
- Verify SH/SC

**Technical basis:**
- Danfoss Cold Room Troubleshooting & Fault Diagnosis: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker Sporlan Bulletin 10-11 TEV Troubleshooting: https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-010/10-11.pdf

---

## CH3-R011 — Sight glass bubbles without supporting charge evidence

**Scope:** CORE  
**Applicable systems:** walk_in_cooler, walk_in_freezer, split_ac  
**Operating state:** STABLE_COOLING

**Given facts:**
- `FACT_SIGHT_GLASS_FLASHING`

**Expected System Check:** Sight-glass bubbles alone are not enough to diagnose low charge

**Confirmed findings:**
- Sight glass shows bubbles/flash gas

**What this means:** Bubbles can result from pressure drop, low ambient/head pressure, load changes or low charge.

**Next Action / Check:** Confirm stable state and check applicable subcooling, liquid pressure drop, ambient and restriction evidence.

**Troubleshooting path:**
- Confirm state
- Measure SC
- Check drier/liquid pressure drop

**Must NOT conclude:**
- Do not diagnose low charge from bubbles alone.

**Technical basis:**
- Danfoss Cold Room Troubleshooting & Fault Diagnosis: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker Sporlan Bulletin 10-11 TEV Troubleshooting: https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-010/10-11.pdf

---

## CH3-R012 — Sight glass bubbles in low ambient with head control

**Scope:** CORE  
**Applicable systems:** walk_in_cooler, walk_in_freezer, split_ac  
**Operating state:** STABLE_COOLING

**Given facts:**
- `FACT_SIGHT_GLASS_FLASHING`
- `FACT_LOW_AMBIENT`
- `FACT_HEAD_CONTROL_INSTALLED`
- `FACT_COND_SAT_LOW`

**Expected System Check:** Low ambient/head-pressure conditions can explain flash gas

**Confirmed findings:**
- Sight glass bubbles
- Low ambient
- Head-pressure control installed
- Head pressure is low

**What this means:** Insufficient liquid pressure can create flash gas without proving total system undercharge.

**Next Action / Check:** Check head-pressure-control operation and liquid condition before adjusting charge.

**Troubleshooting path:**
- Verify head control
- Check receiver/liquid condition
- Compare to design target

**Must NOT conclude:**
- Do not add refrigerant based only on the sight glass.

**Technical basis:**
- Danfoss Cold Room Troubleshooting & Fault Diagnosis: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker Sporlan Bulletin 10-11 TEV Troubleshooting: https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-010/10-11.pdf

---

## CH3-R013 — High head with dirty condenser and high ambient

**Scope:** CORE  
**Applicable systems:** walk_in_cooler, walk_in_freezer, split_ac  
**Operating state:** STABLE_COOLING

**Given facts:**
- `FACT_COND_SAT_HIGH`
- `FACT_COND_COIL_DIRTY`
- `FACT_HIGH_AMBIENT`

**Expected System Check:** High head has two supported heat-rejection contributors

**Confirmed findings:**
- High condensing pressure
- Condenser coil is dirty
- Ambient is high

**What this means:** Both reduced heat rejection and high entering ambient can elevate head pressure.

**Next Action / Check:** Clean the condenser, verify airflow, then recheck head pressure under the actual ambient/load.

**Troubleshooting path:**
- Clean coil
- Verify fan/airflow
- Recheck condensing split

**Technical basis:**
- Danfoss Cold Room Troubleshooting & Fault Diagnosis: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker Sporlan Bulletin 10-11 TEV Troubleshooting: https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-010/10-11.pdf

---

## CH3-R014 — High head with condenser fan stopped

**Scope:** CORE  
**Applicable systems:** walk_in_cooler, walk_in_freezer, split_ac  
**Operating state:** STABLE_COOLING

**Given facts:**
- `FACT_COND_SAT_HIGH`
- `FACT_COND_FAN_NOT_RUNNING`

**Expected System Check:** Stopped condenser fan is a direct high-head fault

**Confirmed findings:**
- High condensing pressure
- Condenser fan is not running

**What this means:** Loss of condenser airflow reduces heat rejection and can trip HP protection.

**Next Action / Check:** Restore fan operation and verify capacitor/motor/power as applicable before charge changes.

**Troubleshooting path:**
- Check fan power
- Check capacitor/motor
- Restore airflow
- Recheck head

**Technical basis:**
- Danfoss Cold Room Troubleshooting & Fault Diagnosis: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker Sporlan Bulletin 10-11 TEV Troubleshooting: https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-010/10-11.pdf

---

## CH3-R015 — High head with clean coil, normal airflow and noncondensable evidence

**Scope:** CORE  
**Applicable systems:** walk_in_cooler, walk_in_freezer, split_ac  
**Operating state:** STABLE_COOLING

**Given facts:**
- `FACT_COND_SAT_HIGH`
- `FACT_COND_COIL_CLEAN`
- `FACT_COND_AIRFLOW_NORMAL`
- `FACT_NONCONDENSABLE_EVIDENCE`

**Expected System Check:** Evidence supports noncondensables after airflow causes are excluded

**Confirmed findings:**
- High condensing pressure
- Condenser is clean
- Airflow is normal
- Noncondensable evidence is present

**What this means:** High head is not explained by airflow and service evidence points to noncondensables.

**Next Action / Check:** Verify pressure-temperature behavior and service history, then recover/evacuate/recharge correctly if confirmed.

**Troubleshooting path:**
- Verify gauges/temperature
- Review service history
- Correct contamination

**Technical basis:**
- Danfoss Cold Room Troubleshooting & Fault Diagnosis: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker Sporlan Bulletin 10-11 TEV Troubleshooting: https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-010/10-11.pdf

---

## CH3-R016 — High head with clean airflow and overcharge evidence

**Scope:** CORE  
**Applicable systems:** walk_in_cooler, walk_in_freezer, split_ac  
**Operating state:** STABLE_COOLING

**Given facts:**
- `FACT_COND_SAT_HIGH`
- `FACT_SUBCOOLING_HIGH`
- `FACT_COND_AIRFLOW_NORMAL`
- `FACT_OVERCHARGE_EVIDENCE`

**Expected System Check:** Evidence supports excess refrigerant inventory

**Confirmed findings:**
- High head
- High subcooling
- Condenser airflow normal
- Overcharge evidence present

**What this means:** With heat rejection verified, inventory evidence supports overcharge.

**Next Action / Check:** Verify charge using the manufacturer method and correct excess refrigerant if confirmed.

**Troubleshooting path:**
- Confirm charging method
- Verify measurement location
- Correct charge

**Technical basis:**
- Danfoss Cold Room Troubleshooting & Fault Diagnosis: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker Sporlan Bulletin 10-11 TEV Troubleshooting: https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-010/10-11.pdf

---

## CH3-R017 — High head during high ambient and high load

**Scope:** CORE  
**Applicable systems:** walk_in_cooler, walk_in_freezer, split_ac  
**Operating state:** STABLE_COOLING

**Given facts:**
- `FACT_COND_SAT_HIGH`
- `FACT_HIGH_AMBIENT`
- `FACT_HIGH_PRODUCT_LOAD`

**Expected System Check:** High head may be load/ambient driven rather than a fault

**Confirmed findings:**
- High condensing pressure
- High ambient
- High product load

**What this means:** Both condenser ambient and refrigeration load are elevated.

**Next Action / Check:** Compare pressures to equipment/application limits for the actual ambient/load before condemning components.

**Troubleshooting path:**
- Record ambient
- Characterize load
- Compare to manufacturer envelope

**Must NOT conclude:**
- Do not diagnose overcharge from high head alone.

**Technical basis:**
- Danfoss Cold Room Troubleshooting & Fault Diagnosis: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker Sporlan Bulletin 10-11 TEV Troubleshooting: https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-010/10-11.pdf

---

## CH3-R018 — High compressor current with high head and dirty condenser

**Scope:** CORE  
**Applicable systems:** walk_in_cooler, walk_in_freezer, split_ac  
**Operating state:** STABLE_COOLING

**Given facts:**
- `FACT_COMPRESSOR_HIGH_CURRENT`
- `FACT_COND_SAT_HIGH`
- `FACT_COND_COIL_DIRTY`

**Expected System Check:** High compressor current is consistent with excessive condensing load

**Confirmed findings:**
- Compressor current is high
- Head pressure is high
- Condenser is dirty

**What this means:** The compressor is working against elevated discharge pressure.

**Next Action / Check:** Correct condenser heat rejection first, then recheck current and pressures.

**Troubleshooting path:**
- Clean condenser
- Verify fan/airflow
- Recheck amps/head

**Technical basis:**
- Danfoss Cold Room Troubleshooting & Fault Diagnosis: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker Sporlan Bulletin 10-11 TEV Troubleshooting: https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-010/10-11.pdf

---

## CH3-R019 — High compressor current with normal head

**Scope:** CORE  
**Applicable systems:** walk_in_cooler, walk_in_freezer, split_ac  
**Operating state:** STABLE_COOLING

**Given facts:**
- `FACT_COMPRESSOR_HIGH_CURRENT`
- `FACT_HEAD_NORMAL_FOR_STATE`

**Expected System Check:** High current needs electrical/mechanical investigation because head is not excessive

**Confirmed findings:**
- Compressor current is high
- Head pressure is normal for state/load

**What this means:** High current is not explained by high condensing pressure.

**Next Action / Check:** Verify voltage/unbalance, current against nameplate/model limits and mechanical/start condition before condemning the compressor.

**Troubleshooting path:**
- Measure supply voltage
- Compare running amps
- Check mechanical/start condition

**Technical basis:**
- Danfoss Cold Room Troubleshooting & Fault Diagnosis: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker Sporlan Bulletin 10-11 TEV Troubleshooting: https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-010/10-11.pdf

---

## CH3-R020 — Hot compressor with normal head

**Scope:** CORE  
**Applicable systems:** walk_in_cooler, walk_in_freezer, split_ac  
**Operating state:** STABLE_COOLING

**Given facts:**
- `FACT_COMPRESSOR_HOT`
- `FACT_HEAD_NOT_EXCESSIVE`
- `FACT_OVERHEAT_CAUSE_UNRESOLVED`

**Expected System Check:** Compressor overheating is unresolved and not explained by excessive head

**Confirmed findings:**
- Compressor is hot
- Head pressure is not excessive
- Overheat cause is unresolved

**What this means:** Other causes such as low suction gas cooling, electrical problems, floodback history or operating envelope must be checked.

**Next Action / Check:** Check suction conditions, current/voltage, superheat/floodback evidence and compressor operating envelope.

**Troubleshooting path:**
- Measure suction/SH
- Check amps/voltage
- Review floodback/operating envelope

**Technical basis:**
- Danfoss Cold Room Troubleshooting & Fault Diagnosis: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker Sporlan Bulletin 10-11 TEV Troubleshooting: https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-010/10-11.pdf

---

## CH3-R021 — Weak compressor differential under stable load

**Scope:** CORE  
**Applicable systems:** walk_in_cooler, walk_in_freezer, split_ac  
**Operating state:** STABLE_COOLING

**Given facts:**
- `FACT_COMPRESSOR_RUNNING`
- `FACT_COMPRESSOR_PRESSURES_NOT_SEPARATING`
- `FACT_COMPRESSOR_PRESSURE_DIFFERENTIAL_WEAK`

**Expected System Check:** Running compressor is not developing expected pressure separation

**Confirmed findings:**
- Compressor is running
- Suction/discharge pressure separation is weak

**What this means:** Reduced pumping capacity is possible after system conditions and valves are verified.

**Next Action / Check:** Verify load, valves/bypass and measurement accuracy; then evaluate compressor pumping efficiency.

**Troubleshooting path:**
- Verify gauges
- Check bypass/unloaders/valves
- Compare compression performance

**Technical basis:**
- Danfoss Cold Room Troubleshooting & Fault Diagnosis: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker Sporlan Bulletin 10-11 TEV Troubleshooting: https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-010/10-11.pdf

---

## CH3-R022 — Weak differential with internal leakage evidence

**Scope:** CORE  
**Applicable systems:** walk_in_cooler, walk_in_freezer, split_ac  
**Operating state:** STABLE_COOLING

**Given facts:**
- `FACT_COMPRESSOR_RUNNING`
- `FACT_COMPRESSOR_PRESSURE_DIFFERENTIAL_WEAK`
- `FACT_COMPRESSOR_VALVE_LEAKAGE_EVIDENCE`

**Expected System Check:** Weak pumping is localized by internal leakage evidence

**Confirmed findings:**
- Compressor pressure differential is weak
- Internal valve/leakage evidence is present

**What this means:** The evidence supports compressor inefficiency rather than a charge adjustment.

**Next Action / Check:** Confirm operating conditions and compressor test criteria, then plan compressor repair/replacement if verified.

**Troubleshooting path:**
- Confirm stable conditions
- Verify leakage/pumping test
- Follow manufacturer replacement criteria

**Technical basis:**
- Danfoss Cold Room Troubleshooting & Fault Diagnosis: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker Sporlan Bulletin 10-11 TEV Troubleshooting: https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-010/10-11.pdf

---

## CH3-R023 — Startup after long off-cycle with low SH

**Scope:** CORE  
**Applicable systems:** walk_in_cooler, walk_in_freezer, split_ac  
**Operating state:** STARTUP

**Given facts:**
- `FACT_LONG_OFF_CYCLE_STARTUP`
- `FACT_EVAP_SH_LOW`

**Expected System Check:** Startup after a long off-cycle carries migration/liquid-return risk

**Confirmed findings:**
- Long off-cycle startup context
- Low superheat is observed

**What this means:** Transient liquid return can occur at startup and should be evaluated before steady-state diagnosis.

**Next Action / Check:** Monitor compressor suction superheat/liquid-return indicators through startup and verify crankcase protection/charge practices.

**Troubleshooting path:**
- Observe startup transient
- Monitor suction SH
- Check migration controls

**Technical basis:**
- Copeland AE4-1495 application/transient testing: https://webapps.copeland.com/online-product-information/Publication/LaunchPDF?Index=AEB&PDF=1495

---

## CH3-R024 — Post-defrost low SH

**Scope:** CORE  
**Applicable systems:** walk_in_cooler, walk_in_freezer, split_ac  
**Operating state:** POST_DEFROST

**Given facts:**
- `FACT_POST_DEFROST_ACTIVE`
- `FACT_EVAP_SH_LOW`

**Expected System Check:** Post-defrost low superheat may be transient

**Confirmed findings:**
- System is in post-defrost recovery
- Superheat is low

**What this means:** Refrigerant/feed conditions can be unstable immediately after defrost.

**Next Action / Check:** Allow the system to return to stable cooling, then recheck superheat before diagnosing overfeed.

**Troubleshooting path:**
- Complete recovery/fan delay
- Stabilize cooling
- Repeat SH

**Must NOT conclude:**
- Do not diagnose TXV overfeed from a transient post-defrost reading.

**Technical basis:**
- Copeland AE4-1495 application/transient testing: https://webapps.copeland.com/online-product-information/Publication/LaunchPDF?Index=AEB&PDF=1495
- Danfoss AK-RC 251 walk-in controller defrost guide: https://assets.danfoss.com/documents/latest/161344/BC364433930186en-000101.pdf

---

## CH3-R025 — Defrost pressure readings used as charge evidence

**Scope:** CORE  
**Applicable systems:** walk_in_cooler, walk_in_freezer, split_ac  
**Operating state:** DEFROST

**Given facts:**
- `FACT_DEFROST_ACTIVE`
- `FACT_SUCTION_PRESSURE_LOW`
- `FACT_EVAP_SH_HIGH`

**Expected System Check:** Defrost-state refrigerant readings are not steady-cooling charge evidence

**Confirmed findings:**
- Defrost is active
- Abnormal suction/superheat readings are present

**What this means:** Defrost changes refrigerant flow and operating sequence.

**Next Action / Check:** Finish defrost and recovery, establish stable cooling, then repeat refrigerant measurements.

**Troubleshooting path:**
- Complete defrost
- Wait through fan/drip delay
- Recheck during stable cooling

**Must NOT conclude:**
- Do not diagnose charge from defrost-state pressures.

**Technical basis:**
- Danfoss AK-RC 251 walk-in controller defrost guide: https://assets.danfoss.com/documents/latest/161344/BC364433930186en-000101.pdf

---

## CH3-R026 — Satisfied/off low suction

**Scope:** CORE  
**Applicable systems:** walk_in_cooler, walk_in_freezer, split_ac  
**Operating state:** SATISFIED_OFF

**Given facts:**
- `FACT_SUCTION_PRESSURE_LOW`

**Expected System Check:** Low suction while satisfied/off is not a cooling diagnosis

**Confirmed findings:**
- Suction pressure is low while the system is satisfied/off

**What this means:** Off-cycle pressures are not interpreted like running steady-state pressures.

**Next Action / Check:** Confirm cooling demand and obtain operating readings during stable cooling if diagnosis is needed.

**Troubleshooting path:**
- Confirm thermostat demand
- Start cooling if appropriate
- Measure after stabilization

**Technical basis:**
- Danfoss Cold Room Troubleshooting & Fault Diagnosis: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker Sporlan Bulletin 10-11 TEV Troubleshooting: https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-010/10-11.pdf

---

## CH3-R027 — Pump-down LP control open

**Scope:** CORE  
**Applicable systems:** walk_in_cooler, walk_in_freezer, split_ac  
**Operating state:** PUMPDOWN

**Given facts:**
- `FACT_PUMPDOWN_ACTIVE`
- `FACT_LP_CONTROL_OPEN`

**Expected System Check:** Open LP control can be normal at the end of pump-down

**Confirmed findings:**
- Pump-down is active
- Low-pressure control is open

**What this means:** The LP control is intended to stop the compressor after suction pressure falls during pump-down.

**Next Action / Check:** Verify solenoid closure, pump-down sequence and LP cut-in/cut-out settings before calling it a fault.

**Troubleshooting path:**
- Confirm solenoid command closed
- Observe suction fall
- Verify LP settings

**Technical basis:**
- Danfoss Cold Room Troubleshooting & Fault Diagnosis: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker Sporlan Bulletin 10-11 TEV Troubleshooting: https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-010/10-11.pdf

---

## CH3-R028 — Cooling demand with anti-short-cycle delay

**Scope:** CORE  
**Applicable systems:** walk_in_cooler, walk_in_freezer, split_ac  
**Operating state:** STABLE_COOLING

**Given facts:**
- `FACT_COOLING_DEMAND_PRESENT`
- `FACT_ANTI_SHORT_CYCLE_DELAY_ACTIVE`
- `FACT_COMPRESSOR_NOT_RUNNING`

**Expected System Check:** Intentional anti-short-cycle delay is preventing compressor start

**Confirmed findings:**
- Cooling demand is present
- Anti-short-cycle delay is active
- Compressor is not running

**What this means:** A configured protective delay can intentionally hold the compressor off.

**Next Action / Check:** Verify the configured delay and wait for it to expire; if it does not release, troubleshoot the control logic.

**Troubleshooting path:**
- Check timer/controller status
- Wait required delay
- Verify contactor call afterward

**Technical basis:**
- Danfoss Cold Room Troubleshooting & Fault Diagnosis: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker Sporlan Bulletin 10-11 TEV Troubleshooting: https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-010/10-11.pdf

---

## CH3-R029 — Cooling demand but contactor coil dead

**Scope:** CORE  
**Applicable systems:** walk_in_cooler, walk_in_freezer, split_ac  
**Operating state:** STABLE_COOLING

**Given facts:**
- `FACT_COOLING_DEMAND_PRESENT`
- `FACT_CONTACTOR_COIL_NOT_ENERGIZED`

**Expected System Check:** Control circuit is open upstream of the contactor coil

**Confirmed findings:**
- Cooling demand is present
- Contactor coil is not energized

**What this means:** The problem is in control power, safeties, wiring or controller output rather than load-side contacts.

**Next Action / Check:** Trace control voltage through safeties and controller outputs using the actual wiring diagram.

**Troubleshooting path:**
- Obtain wiring diagram
- Trace control voltage
- Identify open safety/control

**Technical basis:**
- Danfoss Cold Room Troubleshooting & Fault Diagnosis: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker Sporlan Bulletin 10-11 TEV Troubleshooting: https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-010/10-11.pdf

---

## CH3-R030 — Contactor energized but no load-side voltage

**Scope:** CORE  
**Applicable systems:** walk_in_cooler, walk_in_freezer, split_ac  
**Operating state:** STABLE_COOLING

**Given facts:**
- `FACT_CONTACTOR_COIL_ENERGIZED`
- `FACT_CONTACTOR_NOT_PASSING_VOLTAGE`

**Expected System Check:** Contactor is energized but not passing line voltage

**Confirmed findings:**
- Contactor coil is energized
- No load-side voltage is passed

**What this means:** The contactor/power path is localized.

**Next Action / Check:** Verify line-side voltage and contacts, then replace/repair the failed contactor as appropriate.

**Troubleshooting path:**
- Verify line voltage
- Measure across contacts
- Correct contactor fault

**Technical basis:**
- Danfoss Cold Room Troubleshooting & Fault Diagnosis: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker Sporlan Bulletin 10-11 TEV Troubleshooting: https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-010/10-11.pdf

---

## CH3-R031 — Correct compressor voltage but no start with start fault

**Scope:** CORE  
**Applicable systems:** walk_in_cooler, walk_in_freezer, split_ac  
**Operating state:** STABLE_COOLING

**Given facts:**
- `FACT_COMPRESSOR_TERMINAL_VOLTAGE_PRESENT`
- `FACT_COMPRESSOR_NOT_RUNNING`
- `FACT_START_COMPONENT_FAULT`

**Expected System Check:** Compressor start circuit fault is localized

**Confirmed findings:**
- Correct terminal voltage is present
- Compressor does not start
- Start component fault is identified

**What this means:** Power reaches the compressor but the starting circuit is defective.

**Next Action / Check:** Correct the start component fault and verify compressor current/start operation.

**Troubleshooting path:**
- Isolate power
- Test/replace start component
- Recheck startup

**Technical basis:**
- Danfoss Cold Room Troubleshooting & Fault Diagnosis: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker Sporlan Bulletin 10-11 TEV Troubleshooting: https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-010/10-11.pdf

---

## CH3-R032 — Open fuse with unknown cause

**Scope:** CORE  
**Applicable systems:** walk_in_cooler, walk_in_freezer, split_ac  
**Operating state:** STABLE_COOLING

**Given facts:**
- `FACT_FUSE_OPEN`

**Expected System Check:** Open fuse requires cause investigation before replacement

**Confirmed findings:**
- Fuse is open/blown

**What this means:** A fuse is an outcome/protection event; the downstream cause may still be present.

**Next Action / Check:** De-energize and check downstream shorts/grounds/load condition before replacing and re-energizing.

**Troubleshooting path:**
- Inspect circuit
- Check resistance/ground fault
- Identify overload/short

**Technical basis:**
- Danfoss Cold Room Troubleshooting & Fault Diagnosis: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker Sporlan Bulletin 10-11 TEV Troubleshooting: https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-010/10-11.pdf

---

## CH3-R033 — Overload open on hot compressor

**Scope:** CORE  
**Applicable systems:** walk_in_cooler, walk_in_freezer, split_ac  
**Operating state:** STABLE_COOLING

**Given facts:**
- `FACT_OVERLOAD_PROTECTION_OPEN`
- `FACT_COMPRESSOR_HOT`

**Expected System Check:** Compressor overload is open because the compressor is hot/protected

**Confirmed findings:**
- Overload protection is open
- Compressor is abnormally hot

**What this means:** The protector has responded; the reason for overheating must be found before restart.

**Next Action / Check:** Allow safe cooling and investigate current, voltage, pressures, superheat/floodback and operating envelope.

**Troubleshooting path:**
- Allow cooldown
- Measure electrical conditions
- Check refrigerant/pressure causes

**Technical basis:**
- Danfoss Cold Room Troubleshooting & Fault Diagnosis: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker Sporlan Bulletin 10-11 TEV Troubleshooting: https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-010/10-11.pdf

---

## CH3-R034 — Sensor disagrees but refrigeration normal

**Scope:** CORE  
**Applicable systems:** walk_in_cooler, walk_in_freezer, split_ac  
**Operating state:** STABLE_COOLING

**Given facts:**
- `FACT_SENSOR_DISAGREES_REFERENCE`
- `FACT_REFRIGERATION_PERFORMANCE_NORMAL`

**Expected System Check:** Temperature-control indication is suspect while refrigeration performance is normal

**Confirmed findings:**
- Sensor disagrees with independent reference
- Refrigeration performance is otherwise normal

**What this means:** The fault is more likely sensor location/calibration/input than the refrigeration circuit.

**Next Action / Check:** Compare sensor placement/calibration/wiring with an independent reference and correct the input fault.

**Troubleshooting path:**
- Verify reference thermometer
- Inspect sensor location
- Calibrate/replace sensor

**Technical basis:**
- Danfoss Cold Room Troubleshooting & Fault Diagnosis: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker Sporlan Bulletin 10-11 TEV Troubleshooting: https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-010/10-11.pdf

---

## CH3-R035 — Warm room with normal refrigeration and door infiltration

**Scope:** CORE  
**Applicable systems:** walk_in_cooler, walk_in_freezer, split_ac  
**Operating state:** STABLE_COOLING

**Given facts:**
- `FACT_BOX_TEMP_HIGH`
- `FACT_REFRIGERATION_PERFORMANCE_NORMAL`
- `FACT_DOOR_INFILTRATION_CONFIRMED`

**Expected System Check:** Confirmed air infiltration explains the warm-room load

**Confirmed findings:**
- Room temperature is high
- Refrigeration performance is normal
- Door infiltration is confirmed

**What this means:** Warm/moist air load can exceed current cooling without a refrigerant fault.

**Next Action / Check:** Correct the door/gasket/infiltration source, then verify room pull-down.

**Troubleshooting path:**
- Repair seal/door
- Reduce infiltration
- Monitor pull-down

**Technical basis:**
- Danfoss Cold Room Troubleshooting & Fault Diagnosis: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker Sporlan Bulletin 10-11 TEV Troubleshooting: https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-010/10-11.pdf

---

## CH3-R036 — Warm room with high product load and normal refrigeration

**Scope:** CORE  
**Applicable systems:** walk_in_cooler, walk_in_freezer, split_ac  
**Operating state:** STABLE_COOLING

**Given facts:**
- `FACT_BOX_TEMP_HIGH`
- `FACT_REFRIGERATION_PERFORMANCE_NORMAL`
- `FACT_WARM_PRODUCT_LOAD_CONFIRMED`

**Expected System Check:** Warm product load explains extended pull-down

**Confirmed findings:**
- Room is warm
- Refrigeration performance is normal
- Large warm product load is confirmed

**What this means:** The system may be operating normally against a temporary high load.

**Next Action / Check:** Track product/room pull-down and compare runtime/capacity with the expected load before changing charge.

**Troubleshooting path:**
- Record product temperature/load
- Monitor pull-down
- Compare capacity to load

**Technical basis:**
- Danfoss Cold Room Troubleshooting & Fault Diagnosis: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker Sporlan Bulletin 10-11 TEV Troubleshooting: https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-010/10-11.pdf

---

## CH3-R037 — Verified load exceeds equipment capacity

**Scope:** CORE  
**Applicable systems:** walk_in_cooler, walk_in_freezer, split_ac  
**Operating state:** STABLE_COOLING

**Given facts:**
- `FACT_BOX_TEMP_HIGH`
- `FACT_REFRIGERATION_PERFORMANCE_NORMAL`
- `FACT_AIRFLOW_VERIFIED_NORMAL`
- `FACT_FEED_CHARGE_VERIFIED_NORMAL`
- `FACT_CONTROLS_VERIFIED_NORMAL`
- `FACT_DESIGN_LOAD_EXCEEDS_CAPACITY`

**Expected System Check:** Available refrigeration capacity is insufficient for verified load

**Confirmed findings:**
- Room is warm
- Major refrigeration functions are verified normal
- Actual/design load exceeds equipment capacity

**What this means:** The system is undersized for the actual application rather than simply mischarged.

**Next Action / Check:** Perform/verify load calculation and equipment capacity at design conditions; correct sizing/application.

**Troubleshooting path:**
- Quantify load
- Verify equipment capacity
- Address sizing/application

**Technical basis:**
- Danfoss Cold Room Troubleshooting & Fault Diagnosis: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker Sporlan Bulletin 10-11 TEV Troubleshooting: https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-010/10-11.pdf

---

## CH3-R038 — High SH and high SC with low suction

**Scope:** CORE  
**Applicable systems:** walk_in_cooler, walk_in_freezer, split_ac  
**Operating state:** STABLE_COOLING

**Given facts:**
- `FACT_EVAP_SH_HIGH`
- `FACT_SUBCOOLING_HIGH`
- `FACT_SUCTION_PRESSURE_LOW`

**Expected System Check:** Starvation with retained refrigerant points away from simple low charge

**Confirmed findings:**
- High superheat
- High subcooling
- Low suction

**What this means:** Refrigerant is retained on the high side while the evaporator is starved, suggesting restriction/feed control.

**Next Action / Check:** Check drier/liquid-line pressure drop and TXV inlet/response before adjusting charge.

**Troubleshooting path:**
- Check drier delta
- Verify liquid at TXV
- Test valve response

**Must NOT conclude:**
- Do not diagnose low charge from high superheat alone.

**Technical basis:**
- Danfoss Cold Room Troubleshooting & Fault Diagnosis: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker Sporlan Bulletin 10-11 TEV Troubleshooting: https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-010/10-11.pdf

---

## CH3-R039 — Low SH and high suction with normal airflow

**Scope:** CORE  
**Applicable systems:** walk_in_cooler, walk_in_freezer, split_ac  
**Operating state:** STABLE_COOLING

**Given facts:**
- `FACT_EVAP_SH_LOW`
- `FACT_SUCTION_PRESSURE_HIGH_FOR_LOAD`
- `FACT_EVAP_AIRFLOW_NORMAL`

**Expected System Check:** Evaporator overfeed/flooding pattern is present

**Confirmed findings:**
- Low superheat
- Suction is high for load
- Evaporator airflow is normal

**What this means:** With airflow not limiting load, the combination supports overfeeding or excess feed.

**Next Action / Check:** Check TXV bulb/setting/response and load before making charge changes.

**Troubleshooting path:**
- Verify bulb mounting
- Check valve response
- Confirm load

**Technical basis:**
- Danfoss Cold Room Troubleshooting & Fault Diagnosis: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker Sporlan Bulletin 10-11 TEV Troubleshooting: https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-010/10-11.pdf

---

## CH3-R040 — High suction low head weak differential

**Scope:** CORE  
**Applicable systems:** walk_in_cooler, walk_in_freezer, split_ac  
**Operating state:** STABLE_COOLING

**Given facts:**
- `FACT_SUCTION_PRESSURE_HIGH_FOR_LOAD`
- `FACT_COND_SAT_LOW`
- `FACT_COMPRESSOR_PRESSURE_DIFFERENTIAL_WEAK`

**Expected System Check:** Weak pressure differential points toward reduced compressor pumping

**Confirmed findings:**
- Suction is high for load
- Head is low
- Pressure differential is weak

**What this means:** The compressor may not be producing expected compression.

**Next Action / Check:** Verify gauges/load/bypass and evaluate compressor pumping efficiency.

**Troubleshooting path:**
- Verify measurements
- Check bypass/unloader
- Evaluate compressor

**Technical basis:**
- Danfoss Cold Room Troubleshooting & Fault Diagnosis: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker Sporlan Bulletin 10-11 TEV Troubleshooting: https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-010/10-11.pdf

---

## CH3-R041 — Moisture indicator wet but operation normal

**Scope:** CORE  
**Applicable systems:** walk_in_cooler, walk_in_freezer, split_ac  
**Operating state:** STABLE_COOLING

**Given facts:**
- `FACT_MOISTURE_INDICATED`
- `FACT_REFRIGERATION_PERFORMANCE_NORMAL`

**Expected System Check:** Moisture contamination requires service even if cooling currently appears normal

**Confirmed findings:**
- Moisture indicator shows wet
- Refrigeration performance is currently normal

**What this means:** Moisture can later freeze/restrict the expansion device and damage system reliability.

**Next Action / Check:** Verify indicator condition, service history and drier condition; correct moisture contamination and evacuate properly as required.

**Troubleshooting path:**
- Confirm indicator
- Check/replace drier as appropriate
- Evacuate/dehydrate system

**Technical basis:**
- Danfoss Cold Room Troubleshooting & Fault Diagnosis: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker Sporlan Bulletin 10-11 TEV Troubleshooting: https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-010/10-11.pdf

---

## CH3-R042 — Moisture plus high SH

**Scope:** CORE  
**Applicable systems:** walk_in_cooler, walk_in_freezer, split_ac  
**Operating state:** STABLE_COOLING

**Given facts:**
- `FACT_MOISTURE_INDICATED`
- `FACT_EVAP_SH_HIGH`

**Expected System Check:** Moisture can intermittently restrict the TXV/feed path

**Confirmed findings:**
- Moisture is indicated
- Superheat is high

**What this means:** Water can freeze at the expansion device and cause starvation.

**Next Action / Check:** Check drier/moisture condition and valve inlet; correct contamination before condemning the TXV.

**Troubleshooting path:**
- Inspect drier
- Check TXV inlet
- Dehydrate/replace drier

**Technical basis:**
- Danfoss Cold Room Troubleshooting & Fault Diagnosis: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker Sporlan Bulletin 10-11 TEV Troubleshooting: https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-010/10-11.pdf

---

## CH3-R043 — TXV hunting with otherwise proper liquid

**Scope:** CORE  
**Applicable systems:** walk_in_cooler, walk_in_freezer, split_ac  
**Operating state:** STABLE_COOLING

**Given facts:**
- `FACT_TXV_HUNTING`
- `FACT_TXV_UPSTREAM_LIQUID_PROPER`

**Expected System Check:** Unstable superheat/feed requires valve/load/control investigation

**Confirmed findings:**
- TXV/feed is hunting
- Proper liquid reaches the TXV

**What this means:** Hunting can result from valve sizing, bulb location, load instability or control interaction.

**Next Action / Check:** Verify bulb mounting, valve sizing/setting and load stability before replacement.

**Troubleshooting path:**
- Check bulb
- Check valve size/setting
- Observe load stability

**Technical basis:**
- Danfoss Cold Room Troubleshooting & Fault Diagnosis: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker Sporlan Bulletin 10-11 TEV Troubleshooting: https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-010/10-11.pdf

---

## CH3-R044 — Uneven evaporator feed with proper inlet liquid

**Scope:** CORE  
**Applicable systems:** walk_in_cooler, walk_in_freezer, split_ac  
**Operating state:** STABLE_COOLING

**Given facts:**
- `FACT_EVAP_FEED_UNEVEN`
- `FACT_TXV_UPSTREAM_LIQUID_PROPER`

**Expected System Check:** Uneven evaporator distribution is localized downstream of proper inlet liquid

**Confirmed findings:**
- Evaporator feed is uneven
- Proper liquid reaches the metering device

**What this means:** Distribution/nozzle/circuiting or localized restriction can create uneven feed.

**Next Action / Check:** Inspect distributor/nozzle/circuit temperatures and pressure drop; localize the affected circuit.

**Troubleshooting path:**
- Compare circuit temperatures
- Inspect distributor/nozzle
- Check localized restriction

**Technical basis:**
- Danfoss Cold Room Troubleshooting & Fault Diagnosis: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker Sporlan Bulletin 10-11 TEV Troubleshooting: https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-010/10-11.pdf

---

## CH3-R045 — TXV bulb poor contact plus high SH

**Scope:** CORE  
**Applicable systems:** walk_in_cooler, walk_in_freezer, split_ac  
**Operating state:** STABLE_COOLING

**Given facts:**
- `FACT_EVAP_SH_HIGH`
- `FACT_TXV_BULB_BAD_CONTACT`

**Expected System Check:** Poor TXV bulb contact can cause high superheat/starvation

**Confirmed findings:**
- High superheat
- TXV bulb contact/location is incorrect

**What this means:** The valve receives an incorrect sensing signal.

**Next Action / Check:** Correct bulb contact/location/insulation, then stabilize and recheck superheat.

**Troubleshooting path:**
- Correct bulb
- Insulate correctly
- Recheck SH

**Technical basis:**
- Danfoss Cold Room Troubleshooting & Fault Diagnosis: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker Sporlan Bulletin 10-11 TEV Troubleshooting: https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-010/10-11.pdf

---

## CH3-R046 — External equalizer problem plus high SH

**Scope:** CORE  
**Applicable systems:** walk_in_cooler, walk_in_freezer, split_ac  
**Operating state:** STABLE_COOLING

**Given facts:**
- `FACT_EVAP_SH_HIGH`
- `FACT_TXV_EQUALIZER_PROBLEM`

**Expected System Check:** TXV equalizer fault can starve the evaporator

**Confirmed findings:**
- High superheat
- External equalizer problem is identified

**What this means:** Incorrect equalizer pressure signal can keep the valve from feeding correctly.

**Next Action / Check:** Correct equalizer routing/restriction and recheck valve response/superheat.

**Troubleshooting path:**
- Inspect equalizer
- Correct restriction/connection
- Recheck SH

**Technical basis:**
- Danfoss Cold Room Troubleshooting & Fault Diagnosis: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker Sporlan Bulletin 10-11 TEV Troubleshooting: https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-010/10-11.pdf

---

## CH3-R047 — Wrong refrigerant or TXV match

**Scope:** CORE  
**Applicable systems:** walk_in_cooler, walk_in_freezer, split_ac  
**Operating state:** STABLE_COOLING

**Given facts:**
- `FACT_EVAP_SH_HIGH`
- `FACT_WRONG_REFRIGERANT_OR_VALVE_MATCH`

**Expected System Check:** Expansion device is mismatched to refrigerant/application

**Confirmed findings:**
- High superheat
- Refrigerant/valve match is wrong

**What this means:** A mismatched valve charge/capacity cannot control superheat correctly.

**Next Action / Check:** Verify refrigerant, valve power element/nozzle/capacity and install the correct matched device.

**Troubleshooting path:**
- Identify refrigerant
- Verify valve model
- Correct application match

**Technical basis:**
- Danfoss Cold Room Troubleshooting & Fault Diagnosis: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker Sporlan Bulletin 10-11 TEV Troubleshooting: https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-010/10-11.pdf

---

## CH3-R048 — Head-control installed but low head in low ambient

**Scope:** CORE  
**Applicable systems:** walk_in_cooler, walk_in_freezer, split_ac  
**Operating state:** STABLE_COOLING

**Given facts:**
- `FACT_LOW_AMBIENT`
- `FACT_HEAD_CONTROL_INSTALLED`
- `FACT_COND_SAT_LOW`

**Expected System Check:** Head-pressure control is not maintaining expected condensing pressure

**Confirmed findings:**
- Ambient is low
- Head control is installed
- Head pressure remains low

**What this means:** Control setting, valve operation or required flood charge may be inadequate.

**Next Action / Check:** Check head-control setting/operation and receiver/flood-charge requirements before adding refrigerant generically.

**Troubleshooting path:**
- Verify control setpoint
- Check valve operation
- Verify design flood charge

**Technical basis:**
- Danfoss Cold Room Troubleshooting & Fault Diagnosis: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker Sporlan Bulletin 10-11 TEV Troubleshooting: https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-010/10-11.pdf

---

## CH3-R049 — Head-control flood charge insufficient

**Scope:** CORE  
**Applicable systems:** walk_in_cooler, walk_in_freezer, split_ac  
**Operating state:** STABLE_COOLING

**Given facts:**
- `FACT_LOW_AMBIENT`
- `FACT_HEAD_CONTROL_INSTALLED`
- `FACT_HEAD_CONTROL_FLOOD_CHARGE_INSUFFICIENT`
- `FACT_COND_SAT_LOW`

**Expected System Check:** Configured low-ambient control lacks required flood-charge inventory

**Confirmed findings:**
- Low ambient
- Head control installed
- Flood-charge inventory is insufficient
- Head is low

**What this means:** The specific head-control design requires adequate refrigerant inventory to maintain liquid pressure.

**Next Action / Check:** Verify manufacturer flood-charge calculation and correct charge for that control design.

**Troubleshooting path:**
- Confirm control design
- Calculate required flood charge
- Correct per manufacturer

**Technical basis:**
- Danfoss Cold Room Troubleshooting & Fault Diagnosis: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker Sporlan Bulletin 10-11 TEV Troubleshooting: https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-010/10-11.pdf

---

## CH3-R050 — Conflicting low-charge and high-head clues

**Scope:** CORE  
**Applicable systems:** walk_in_cooler, walk_in_freezer, split_ac  
**Operating state:** STABLE_COOLING

**Given facts:**
- `FACT_EVAP_SH_HIGH`
- `FACT_SUBCOOLING_LOW`
- `FACT_COND_SAT_HIGH`

**Expected System Check:** Conflicting refrigerant clues require discrimination before charge adjustment

**Confirmed findings:**
- High superheat
- Low subcooling
- High head pressure

**What this means:** The readings do not form a clean single-fault charge pattern; airflow, restriction, noncondensables and measurement validity must be checked.

**Next Action / Check:** Verify condenser airflow/ambient, measurement locations and restriction evidence before changing charge.

**Troubleshooting path:**
- Verify measurements
- Check condenser heat rejection
- Check restriction/noncondensables

**Must NOT conclude:**
- Do not diagnose low charge or overcharge from this conflicting pattern alone.

**Technical basis:**
- Danfoss Cold Room Troubleshooting & Fault Diagnosis: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker Sporlan Bulletin 10-11 TEV Troubleshooting: https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-010/10-11.pdf

---

## CH3-W051 — Iced coil with evaporator fan stopped

**Scope:** WIC  
**Applicable systems:** walk_in_cooler, walk_in_freezer  
**Operating state:** STABLE_COOLING

**Given facts:**
- `FACT_EVAP_COIL_ICED`
- `FACT_EVAP_FAN_NOT_RUNNING`

**Expected System Check:** Stopped evaporator fan is a direct cause of icing/poor heat transfer

**Confirmed findings:**
- Evaporator coil is iced
- Evaporator fan is not running

**What this means:** Loss of airflow promotes icing and poor cooling.

**Next Action / Check:** Restore fan operation, fully defrost the coil, then verify airflow and refrigeration readings.

**Troubleshooting path:**
- Diagnose fan power/motor
- Defrost coil
- Recheck airflow

**Technical basis:**
- Danfoss AK-RC 251 walk-in controller defrost guide: https://assets.danfoss.com/documents/latest/161344/BC364433930186en-000101.pdf
- Danfoss Cold Room Troubleshooting & Fault Diagnosis: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker Sporlan Bulletin 10-11 TEV Troubleshooting: https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-010/10-11.pdf

---

## CH3-W052 — Iced coil with fans normal and incomplete defrost

**Scope:** WIC  
**Applicable systems:** walk_in_cooler, walk_in_freezer  
**Operating state:** STABLE_COOLING

**Given facts:**
- `FACT_EVAP_COIL_ICED`
- `FACT_EVAP_FAN_RUNNING`
- `FACT_DEFROST_INCOMPLETE`

**Expected System Check:** Defrost is not fully clearing the evaporator

**Confirmed findings:**
- Evaporator is iced
- Fans operate
- Defrost is incomplete

**What this means:** Persistent ice with airflow hardware working points to defrost duration/termination/heater sequence.

**Next Action / Check:** Observe a complete defrost and verify heater output, duration and termination.

**Troubleshooting path:**
- Initiate/observe defrost
- Check heater/current
- Check termination

**Technical basis:**
- Danfoss AK-RC 251 walk-in controller defrost guide: https://assets.danfoss.com/documents/latest/161344/BC364433930186en-000101.pdf

---

## CH3-W053 — Defrost command and heater voltage but no current

**Scope:** WIC  
**Applicable systems:** walk_in_cooler, walk_in_freezer  
**Operating state:** STABLE_COOLING

**Given facts:**
- `FACT_DEFROST_COMMAND_PRESENT`
- `FACT_DEFROST_HEATER_VOLTAGE_PRESENT`
- `FACT_DEFROST_HEATER_CURRENT_ABSENT`
- `FACT_DEFROST_HEATER_NOT_HEATING`

**Expected System Check:** Defrost heater load is open/not producing heat

**Confirmed findings:**
- Defrost is commanded
- Heater voltage is present
- Heater current/heat is absent

**What this means:** Power is reaching the heater circuit but the heater/load path is open or failed.

**Next Action / Check:** De-energize and test heater continuity/resistance and connections; repair the heater circuit.

**Troubleshooting path:**
- Lock out power
- Test heater resistance
- Inspect connections

**Technical basis:**
- Danfoss AK-RC 251 walk-in controller defrost guide: https://assets.danfoss.com/documents/latest/161344/BC364433930186en-000101.pdf

---

## CH3-W054 — Defrost terminates too early

**Scope:** WIC  
**Applicable systems:** walk_in_cooler, walk_in_freezer  
**Operating state:** STABLE_COOLING

**Given facts:**
- `FACT_DEFROST_TERMINATION_ERROR`
- `FACT_DEFROST_INCOMPLETE`

**Expected System Check:** Premature defrost termination leaves ice on the coil

**Confirmed findings:**
- Defrost ends incorrectly
- Evaporator is not fully cleared

**What this means:** Termination sensor/control logic is ending defrost before the coil is clear.

**Next Action / Check:** Verify termination sensor location/calibration and controller settings, then observe a full cycle.

**Troubleshooting path:**
- Check termination sensor
- Check setting
- Observe complete defrost

**Technical basis:**
- Danfoss AK-RC 251 walk-in controller defrost guide: https://assets.danfoss.com/documents/latest/161344/BC364433930186en-000101.pdf

---

## CH3-W055 — Fan starts too early after defrost

**Scope:** WIC  
**Applicable systems:** walk_in_cooler, walk_in_freezer  
**Operating state:** STABLE_COOLING

**Given facts:**
- `FACT_FAN_DELAY_ERROR`
- `FACT_POST_DEFROST_ACTIVE`

**Expected System Check:** Evaporator fan-delay control is incorrect after defrost

**Confirmed findings:**
- Post-defrost recovery is active
- Fan delay operation is incorrect

**What this means:** Starting fans too early can blow heat/moisture into the room and disturb recovery.

**Next Action / Check:** Verify fan-delay sensor/setting and controller sequence before refrigerant diagnosis.

**Troubleshooting path:**
- Check fan-delay setting
- Check sensor
- Observe sequence

**Technical basis:**
- Danfoss AK-RC 251 walk-in controller defrost guide: https://assets.danfoss.com/documents/latest/161344/BC364433930186en-000101.pdf

---

## CH3-W056 — Fan delay intentionally active after defrost

**Scope:** WIC  
**Applicable systems:** walk_in_cooler, walk_in_freezer  
**Operating state:** POST_DEFROST

**Given facts:**
- `FACT_POST_DEFROST_ACTIVE`
- `FACT_FAN_DELAY_ACTIVE`

**Expected System Check:** Fan-off period is intentional during post-defrost recovery

**Confirmed findings:**
- Post-defrost recovery is active
- Configured fan delay is active

**What this means:** Fans may intentionally remain off until the evaporator cools.

**Next Action / Check:** Verify the delay releases at the configured condition; do not condemn the fan motor during the intentional delay.

**Troubleshooting path:**
- Check controller status
- Verify release condition
- Confirm fan starts afterward

**Must NOT conclude:**
- Do not diagnose evaporator fan failure while intentional fan delay is active.

**Technical basis:**
- Danfoss AK-RC 251 walk-in controller defrost guide: https://assets.danfoss.com/documents/latest/161344/BC364433930186en-000101.pdf

---

## CH3-W057 — Defrost completes but drain refreezes

**Scope:** WIC  
**Applicable systems:** walk_in_cooler, walk_in_freezer  
**Operating state:** STABLE_COOLING

**Given facts:**
- `FACT_DEFROST_COMPLETES`
- `FACT_DRAIN_REFREEZE`
- `FACT_DRAIN_ICE`

**Expected System Check:** Drain/refreeze fault remains after successful coil defrost

**Confirmed findings:**
- Defrost clears the evaporator
- Water refreezes in drain/pan

**What this means:** The defrost heater may be working while drain heat/slope/blockage remains faulty.

**Next Action / Check:** Inspect drain heater, trap/slope and blockage; correct drainage before changing defrost duration.

**Troubleshooting path:**
- Inspect drain path
- Test drain heater
- Correct slope/blockage

**Technical basis:**
- Danfoss AK-RC 251 walk-in controller defrost guide: https://assets.danfoss.com/documents/latest/161344/BC364433930186en-000101.pdf

---

## CH3-W058 — Icing with confirmed door infiltration

**Scope:** WIC  
**Applicable systems:** walk_in_cooler, walk_in_freezer  
**Operating state:** STABLE_COOLING

**Given facts:**
- `FACT_EVAP_COIL_ICED`
- `FACT_DOOR_INFILTRATION_CONFIRMED`
- `FACT_EVAP_FAN_RUNNING`

**Expected System Check:** Air infiltration is adding moisture that drives evaporator icing

**Confirmed findings:**
- Evaporator is iced
- Door infiltration is confirmed
- Evaporator fan runs

**What this means:** Warm humid air entering the box increases latent load and frost formation.

**Next Action / Check:** Repair door/gasket/closure, defrost the coil and monitor recurrence.

**Troubleshooting path:**
- Repair infiltration
- Defrost coil
- Monitor frost pattern

**Technical basis:**
- Danfoss AK-RC 251 walk-in controller defrost guide: https://assets.danfoss.com/documents/latest/161344/BC364433930186en-000101.pdf
- Danfoss Cold Room Troubleshooting & Fault Diagnosis: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker Sporlan Bulletin 10-11 TEV Troubleshooting: https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-010/10-11.pdf

---

## CH3-W059 — Icing despite door sealed and fan running

**Scope:** WIC  
**Applicable systems:** walk_in_cooler, walk_in_freezer  
**Operating state:** STABLE_COOLING

**Given facts:**
- `FACT_EVAP_COIL_ICED`
- `FACT_DOOR_CLOSED_SEALED`
- `FACT_EVAP_FAN_RUNNING`

**Expected System Check:** Common airflow/infiltration causes are excluded; inspect defrost and evaporating condition

**Confirmed findings:**
- Evaporator is iced
- Door seals normally
- Fan runs normally

**What this means:** Defrost schedule/termination, low evaporating temperature or feed conditions remain candidates.

**Next Action / Check:** Observe defrost performance and check evaporating temperature/feed after the coil is clear.

**Troubleshooting path:**
- Observe defrost
- Verify termination
- Recheck suction/feed

**Technical basis:**
- Danfoss AK-RC 251 walk-in controller defrost guide: https://assets.danfoss.com/documents/latest/161344/BC364433930186en-000101.pdf
- Danfoss Cold Room Troubleshooting & Fault Diagnosis: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker Sporlan Bulletin 10-11 TEV Troubleshooting: https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-010/10-11.pdf

---

## CH3-W060 — Warm room with compressor long runtime and high load

**Scope:** WIC  
**Applicable systems:** walk_in_cooler, walk_in_freezer  
**Operating state:** STABLE_COOLING

**Given facts:**
- `FACT_BOX_TEMP_HIGH`
- `FACT_COMPRESSOR_LONG_RUNTIME`
- `FACT_HIGH_PRODUCT_LOAD`

**Expected System Check:** Long runtime is consistent with a high room/product load

**Confirmed findings:**
- Room is warm
- Compressor runs continuously
- Product/room load is high

**What this means:** The system may be in extended pull-down rather than suffering a control fault.

**Next Action / Check:** Characterize load and monitor pull-down while verifying airflow and operating envelope.

**Troubleshooting path:**
- Record load/product temp
- Monitor temperature trend
- Verify airflow/pressures

**Technical basis:**
- Danfoss Cold Room Troubleshooting & Fault Diagnosis: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker Sporlan Bulletin 10-11 TEV Troubleshooting: https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-010/10-11.pdf

---

## CH3-W061 — Warm room with compressor long runtime and no abnormal load

**Scope:** WIC  
**Applicable systems:** walk_in_cooler, walk_in_freezer  
**Operating state:** STABLE_COOLING

**Given facts:**
- `FACT_BOX_TEMP_HIGH`
- `FACT_COMPRESSOR_LONG_RUNTIME`
- `FACT_CAPACITY_POOR`

**Expected System Check:** Cooling capacity is insufficient and needs systematic localization

**Confirmed findings:**
- Room is warm
- Compressor runs continuously
- Capacity is poor

**What this means:** With no known transient load explanation, airflow, feed, compressor performance and sizing must be checked.

**Next Action / Check:** Check evaporator/condenser airflow, refrigerant feed, compressor differential and system capacity.

**Troubleshooting path:**
- Check airflow
- Check SH/SC/feed
- Check compressor differential
- Compare capacity

**Technical basis:**
- Danfoss Cold Room Troubleshooting & Fault Diagnosis: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker Sporlan Bulletin 10-11 TEV Troubleshooting: https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-010/10-11.pdf

---

## CH3-W062 — Room sensor error causing poor temperature control

**Scope:** WIC  
**Applicable systems:** walk_in_cooler, walk_in_freezer  
**Operating state:** STABLE_COOLING

**Given facts:**
- `FACT_SENSOR_ERROR`
- `FACT_BOX_TEMP_HIGH`

**Expected System Check:** Sensor/control input fault can cause incorrect room temperature control

**Confirmed findings:**
- Room temperature is high
- Sensor reading/calibration is faulty

**What this means:** The controller may be making decisions from bad temperature information.

**Next Action / Check:** Compare sensor to an independent reference, inspect location/wiring and correct calibration/input.

**Troubleshooting path:**
- Use reference thermometer
- Inspect sensor placement
- Correct sensor/input

**Technical basis:**
- Danfoss Cold Room Troubleshooting & Fault Diagnosis: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker Sporlan Bulletin 10-11 TEV Troubleshooting: https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-010/10-11.pdf

---

## CH3-W063 — LP control opens too early during cooling

**Scope:** WIC  
**Applicable systems:** walk_in_cooler, walk_in_freezer  
**Operating state:** STABLE_COOLING

**Given facts:**
- `FACT_COOLING_DEMAND_PRESENT`
- `FACT_LP_CONTROL_OPEN`
- `FACT_SUCTION_PRESSURE_LOW`

**Expected System Check:** LP control setting/fault may stop cooling prematurely

**Confirmed findings:**
- Cooling demand remains
- LP control is open
- Suction is low

**What this means:** If the control opens above the intended cutout, the room can warm even though refrigeration hardware is otherwise capable.

**Next Action / Check:** Verify actual suction pressure and LP cutout/cut-in against the equipment sequence; adjust/repair as required.

**Troubleshooting path:**
- Measure suction accurately
- Check LP settings
- Verify restart/cut-in

**Technical basis:**
- Danfoss Cold Room Troubleshooting & Fault Diagnosis: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker Sporlan Bulletin 10-11 TEV Troubleshooting: https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-010/10-11.pdf

---

## CH3-W064 — Solenoid commanded closed but flow continues

**Scope:** WIC  
**Applicable systems:** walk_in_cooler, walk_in_freezer  
**Operating state:** STABLE_COOLING

**Given facts:**
- `FACT_SOLENOID_COMMAND_CLOSED`
- `FACT_SOLENOID_FLOW_CONTINUES_CLOSED`

**Expected System Check:** Liquid solenoid is leaking/not closing

**Confirmed findings:**
- Solenoid is commanded closed
- Refrigerant flow continues

**What this means:** Pump-down/temperature control can fail because liquid continues feeding.

**Next Action / Check:** Verify valve command and pressure differential, then repair/replace the leaking solenoid.

**Troubleshooting path:**
- Confirm command voltage off
- Verify continued flow
- Repair valve

**Technical basis:**
- Danfoss Cold Room Troubleshooting & Fault Diagnosis: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker Sporlan Bulletin 10-11 TEV Troubleshooting: https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-010/10-11.pdf

---

## CH3-W065 — Multiple faults: fan stopped and dirty condenser

**Scope:** WIC  
**Applicable systems:** walk_in_cooler, walk_in_freezer  
**Operating state:** STABLE_COOLING

**Given facts:**
- `FACT_EVAP_FAN_NOT_RUNNING`
- `FACT_COND_COIL_DIRTY`
- `FACT_BOX_TEMP_HIGH`

**Expected System Check:** Two confirmed airflow faults are active and both must be preserved

**Confirmed findings:**
- Evaporator fan is stopped
- Condenser is dirty
- Room is warm

**What this means:** The evaporator fan is an immediate cooling fault while the dirty condenser is also an active heat-rejection problem.

**Next Action / Check:** Restore evaporator airflow first for cooling, clean the condenser, then retest the full system.

**Troubleshooting path:**
- Repair evaporator fan
- Clean condenser
- Retest pressures/temperature

**Technical basis:**
- Danfoss Cold Room Troubleshooting & Fault Diagnosis: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker Sporlan Bulletin 10-11 TEV Troubleshooting: https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-010/10-11.pdf

---

## CH3-W066 — Multiple faults: drier restriction and TXV bulb fault

**Scope:** WIC  
**Applicable systems:** walk_in_cooler, walk_in_freezer  
**Operating state:** STABLE_COOLING

**Given facts:**
- `FACT_EVAP_SH_HIGH`
- `FACT_DRIER_TEMP_DROP`
- `FACT_TXV_BULB_BAD_CONTACT`

**Expected System Check:** Both a liquid-line restriction and TXV sensing fault are supported

**Confirmed findings:**
- High superheat
- Drier temperature drop
- TXV bulb contact is poor

**What this means:** Either fault can contribute to starvation; neither should be discarded.

**Next Action / Check:** Correct the confirmed drier restriction and bulb installation, then stabilize and recheck SH/feed.

**Troubleshooting path:**
- Correct drier restriction
- Correct bulb
- Retest feed

**Technical basis:**
- Danfoss Cold Room Troubleshooting & Fault Diagnosis: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker Sporlan Bulletin 10-11 TEV Troubleshooting: https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-010/10-11.pdf

---

## CH3-W067 — Multiple faults: dirty condenser, sensor error, high load

**Scope:** WIC  
**Applicable systems:** walk_in_cooler, walk_in_freezer  
**Operating state:** STABLE_COOLING

**Given facts:**
- `FACT_COND_COIL_DIRTY`
- `FACT_SENSOR_ERROR`
- `FACT_HIGH_PRODUCT_LOAD`
- `FACT_BOX_TEMP_HIGH`

**Expected System Check:** Heat rejection, sensing and load problems are simultaneously present

**Confirmed findings:**
- Condenser is dirty
- Sensor is faulty
- Product load is high
- Room is warm

**What this means:** Multiple independent contributors can coexist; selecting one must not erase the others.

**Next Action / Check:** Restore condenser heat rejection, verify temperature with a reference, characterize load, then reassess cooling.

**Troubleshooting path:**
- Clean condenser
- Verify sensor/reference
- Characterize load
- Retest

**Technical basis:**
- Danfoss Cold Room Troubleshooting & Fault Diagnosis: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker Sporlan Bulletin 10-11 TEV Troubleshooting: https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-010/10-11.pdf

---

## CH3-W068 — Unknown state but direct condenser fan fault

**Scope:** WIC  
**Applicable systems:** walk_in_cooler, walk_in_freezer  
**Operating state:** UNKNOWN

**Given facts:**
- `FACT_COND_FAN_NOT_RUNNING`

**Expected System Check:** Direct condenser fan fault should be acted on even when operating state is not fully characterized

**Confirmed findings:**
- Condenser fan is directly observed not running

**What this means:** A direct physical fault is actionable and should not be hidden behind a generic request for state.

**Next Action / Check:** Determine why the condenser fan is not running and restore airflow; then establish state and retest pressures.

**Troubleshooting path:**
- Check fan power/control
- Check capacitor/motor
- Restore airflow

**Technical basis:**
- Danfoss Cold Room Troubleshooting & Fault Diagnosis: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker Sporlan Bulletin 10-11 TEV Troubleshooting: https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-010/10-11.pdf

---

## CH3-W069 — Unknown state but direct evaporator fan fault

**Scope:** WIC  
**Applicable systems:** walk_in_cooler, walk_in_freezer  
**Operating state:** UNKNOWN

**Given facts:**
- `FACT_EVAP_FAN_NOT_RUNNING`

**Expected System Check:** Direct evaporator fan fault should remain the primary actionable finding

**Confirmed findings:**
- Evaporator fan is directly observed not running

**What this means:** Loss of evaporator airflow is a confirmed physical fault regardless of incomplete state information.

**Next Action / Check:** Troubleshoot fan power/control/motor and restore airflow, then obtain stabilized refrigeration readings.

**Troubleshooting path:**
- Check fan power
- Check motor/capacitor if applicable
- Restore airflow

**Technical basis:**
- Danfoss Cold Room Troubleshooting & Fault Diagnosis: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker Sporlan Bulletin 10-11 TEV Troubleshooting: https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-010/10-11.pdf

---

## CH3-W070 — Warm room with refrigeration normal but capacity/load not yet characterized

**Scope:** WIC  
**Applicable systems:** walk_in_cooler, walk_in_freezer  
**Operating state:** STABLE_COOLING

**Given facts:**
- `FACT_BOX_TEMP_HIGH`
- `FACT_REFRIGERATION_PERFORMANCE_NORMAL`

**Expected System Check:** Refrigeration circuit appears normal; room/load side needs characterization

**Confirmed findings:**
- Room is warm
- Refrigeration performance is verified normal

**What this means:** A warm box with normal refrigeration can result from infiltration, product load, sensor/control issues or undersizing.

**Next Action / Check:** Measure independent room/product temperature and characterize door/load conditions before changing refrigeration components.

**Troubleshooting path:**
- Verify room temperature
- Check doors/infiltration
- Quantify product load
- Compare capacity

**Must NOT conclude:**
- Do not add refrigerant when refrigeration performance is verified normal.

**Technical basis:**
- Danfoss Cold Room Troubleshooting & Fault Diagnosis: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker Sporlan Bulletin 10-11 TEV Troubleshooting: https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-010/10-11.pdf

---

