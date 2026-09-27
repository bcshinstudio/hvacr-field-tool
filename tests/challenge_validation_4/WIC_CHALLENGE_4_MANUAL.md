# WIC Challenge Validation #4 — Human-Readable Answer Key

Brain frozen: **2.0.13**. These expected results were defined before the first Brain run.

## CH4-001 — High SH plus bubbles but operating state not confirmed

**Scope:** CORE  
**Operating state:** UNKNOWN  
**Given facts:** FACT_EVAP_SH_HIGH, FACT_EVAP_SH_MEASURED, FACT_SIGHT_GLASS_FLASHING

**Expected System Check:** Abnormal readings recorded but operating state must be established first

**Confirmed findings:**
- High superheat and sight-glass bubbles are recorded without confirmed stable cooling

**What this means:** Transient conditions can make both observations misleading.

**Next Action / Check:** Confirm stable cooling and repeat SH, liquid condition, and SC before diagnosing charge.

**Must NOT conclude:**
- Do not diagnose low charge from these readings alone.

**Technical basis:**
- Danfoss Cold Room Troubleshooting: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker/Sporlan or Copeland technical guidance: https://webapps.copeland.com/online-product-information/Publication/LaunchPDF?Index=AEB&PDF=1495

---

## CH4-002 — Low SC with receiver and confirmed leak

**Scope:** CORE  
**Operating state:** STABLE_COOLING  
**Given facts:** FACT_SUBCOOLING_LOW, FACT_SUBCOOLING_MEASURED, FACT_RECEIVER_PRESENT, FACT_LEAK_CONFIRMED

**Expected System Check:** Confirmed leak outweighs receiver-specific SC ambiguity

**Confirmed findings:**
- A refrigerant leak is confirmed
- Low subcooling is present but receiver configuration affects interpretation

**What this means:** Direct leak evidence supports refrigerant loss even when SC target is configuration-dependent.

**Next Action / Check:** Repair the leak, evacuate/charge by equipment procedure, then verify stable operation and charge indicators.


**Technical basis:**
- Danfoss Cold Room Troubleshooting: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker/Sporlan or Copeland technical guidance: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/

---

## CH4-003 — High SH with solid liquid at TXV and equalizer fault

**Scope:** CORE  
**Operating state:** STABLE_COOLING  
**Given facts:** FACT_EVAP_SH_HIGH, FACT_TXV_UPSTREAM_LIQUID_PROPER, FACT_TXV_EQUALIZER_PROBLEM

**Expected System Check:** TXV control/equalizer problem is localized

**Confirmed findings:**
- High superheat
- Proper liquid reaches the TXV
- External equalizer problem is present

**What this means:** The evaporator is starved despite proper inlet liquid because the TXV control signal is compromised.

**Next Action / Check:** Correct the equalizer problem, then recheck superheat under stable load.


**Technical basis:**
- Danfoss Cold Room Troubleshooting: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker/Sporlan or Copeland technical guidance: https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-010/10-11.pdf

---

## CH4-004 — High SH with solid liquid and wrong TXV match

**Scope:** CORE  
**Operating state:** STABLE_COOLING  
**Given facts:** FACT_EVAP_SH_HIGH, FACT_TXV_UPSTREAM_LIQUID_PROPER, FACT_WRONG_REFRIGERANT_OR_VALVE_MATCH

**Expected System Check:** Expansion device/application mismatch can cause starvation

**Confirmed findings:**
- High superheat
- Proper liquid reaches the TXV
- Refrigerant/TXV application mismatch is identified

**What this means:** A mismatched valve or charge can underfeed even with adequate upstream liquid.

**Next Action / Check:** Verify valve model, refrigerant, capacity and application range; correct the mismatch before charge adjustment.


**Technical basis:**
- Danfoss Cold Room Troubleshooting: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker/Sporlan or Copeland technical guidance: https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-010/10-11.pdf

---

## CH4-005 — Low SH with high suction and verified high load

**Scope:** CORE  
**Operating state:** STABLE_COOLING  
**Given facts:** FACT_EVAP_SH_LOW, FACT_SUCTION_PRESSURE_HIGH_FOR_LOAD, FACT_HIGH_PRODUCT_LOAD

**Expected System Check:** Low SH under heavy load indicates overfeeding/floodback risk

**Confirmed findings:**
- Low superheat
- Suction is high for load
- High product load is present

**What this means:** High load alone does not justify liquid return; expansion-device control must be checked.

**Next Action / Check:** Check TXV response, bulb installation and compressor-suction superheat before adjusting charge.

**Must NOT conclude:**
- Do not diagnose low charge.

**Technical basis:**
- Danfoss Cold Room Troubleshooting: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker/Sporlan or Copeland technical guidance: https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-010/10-11.pdf

---

## CH4-006 — Low suction plus low load and clear coil

**Scope:** CORE  
**Operating state:** STABLE_COOLING  
**Given facts:** FACT_SUCTION_PRESSURE_LOW, FACT_LOW_EVAP_LOAD, FACT_EVAP_COIL_CLEAR, FACT_EVAP_FAN_RUNNING

**Expected System Check:** Low suction is consistent with verified low evaporator load

**Confirmed findings:**
- Low suction
- Evaporator load is verified low
- Coil is clear and fan runs

**What this means:** Low suction can be a load effect rather than a feed fault.

**Next Action / Check:** Confirm room/load conditions and compare suction to the equipment target for that load before opening the circuit.

**Must NOT conclude:**
- Do not diagnose low charge from low suction alone.

**Technical basis:**
- Danfoss Cold Room Troubleshooting: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker/Sporlan or Copeland technical guidance: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/

---

## CH4-007 — Low suction plus low load but high SH

**Scope:** CORE  
**Operating state:** STABLE_COOLING  
**Given facts:** FACT_SUCTION_PRESSURE_LOW, FACT_LOW_EVAP_LOAD, FACT_EVAP_SH_HIGH

**Expected System Check:** Low load can lower suction, but high SH still needs feed verification

**Confirmed findings:**
- Low suction
- Low evaporator load
- High superheat

**What this means:** The readings are not sufficient to separate low-load behavior from refrigerant-feed starvation.

**Next Action / Check:** Verify liquid condition at TXV, SC/charge reference, and restrictions before assigning a charge fault.

**Must NOT conclude:**
- Do not diagnose low charge from this combination alone.

**Technical basis:**
- Danfoss Cold Room Troubleshooting: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker/Sporlan or Copeland technical guidance: https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-010/10-11.pdf

---

## CH4-008 — High head with high ambient but condenser airflow normal

**Scope:** CORE  
**Operating state:** STABLE_COOLING  
**Given facts:** FACT_COND_SAT_HIGH, FACT_HIGH_AMBIENT, FACT_COND_AIRFLOW_NORMAL, FACT_COND_COIL_CLEAN

**Expected System Check:** High ambient can explain elevated condensing pressure

**Confirmed findings:**
- High condensing pressure
- High ambient
- Condenser airflow and coil are normal

**What this means:** Head pressure must be judged against ambient/load before condemning charge or components.

**Next Action / Check:** Compare condensing temperature split to applicable design data and verify the pressure falls as ambient/load normalize.

**Must NOT conclude:**
- Do not diagnose overcharge from high head alone.

**Technical basis:**
- Danfoss Cold Room Troubleshooting: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker/Sporlan or Copeland technical guidance: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/

---

## CH4-009 — High head with normal ambient and recirculation

**Scope:** CORE  
**Operating state:** STABLE_COOLING  
**Given facts:** FACT_COND_SAT_HIGH, FACT_COND_RECIRCULATION_CONFIRMED, FACT_COND_FAN_RUNNING

**Expected System Check:** Condenser recirculation is a direct heat-rejection fault

**Confirmed findings:**
- High head
- Condenser fan runs
- Hot-air recirculation is confirmed

**What this means:** The condenser is ingesting its own hot discharge air.

**Next Action / Check:** Correct discharge-air recirculation/clearance first, then recheck head pressure.


**Technical basis:**
- Danfoss Cold Room Troubleshooting: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker/Sporlan or Copeland technical guidance: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/

---

## CH4-010 — High head with normal airflow and no cause localized

**Scope:** CORE  
**Operating state:** STABLE_COOLING  
**Given facts:** FACT_COND_SAT_HIGH, FACT_COND_AIRFLOW_NORMAL, FACT_COND_COIL_CLEAN, FACT_HEAD_NOT_EXCESSIVE

**Expected System Check:** High-head report conflicts with verified non-excessive head context

**Confirmed findings:**
- Reported high-head condition conflicts with verified head not excessive

**What this means:** The evidence is internally inconsistent and should be re-measured before diagnosis.

**Next Action / Check:** Verify gauge/transducer accuracy, measurement point, refrigerant PT conversion and operating state.

**Must NOT conclude:**
- Do not diagnose overcharge or noncondensables from conflicting evidence.

**Technical basis:**
- Danfoss Cold Room Troubleshooting: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker/Sporlan or Copeland technical guidance: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/

---

## CH4-011 — High current with high head but condenser clean

**Scope:** CORE  
**Operating state:** STABLE_COOLING  
**Given facts:** FACT_COMPRESSOR_HIGH_CURRENT, FACT_COND_SAT_HIGH, FACT_COND_COIL_CLEAN, FACT_COND_AIRFLOW_NORMAL

**Expected System Check:** High compressor load is present without an airflow cause

**Confirmed findings:**
- High current
- High head
- Condenser airflow is verified normal

**What this means:** Electrical/mechanical load and refrigerant-side high-head causes remain possible.

**Next Action / Check:** Check supply voltage, compressor current against nameplate, ambient/load, charge evidence and noncondensables before condemning compressor.


**Technical basis:**
- Danfoss Cold Room Troubleshooting: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker/Sporlan or Copeland technical guidance: https://webapps.copeland.com/online-product-information/Publication/LaunchPDF?Index=AEB&PDF=1495

---

## CH4-012 — High current with low head

**Scope:** CORE  
**Operating state:** STABLE_COOLING  
**Given facts:** FACT_COMPRESSOR_HIGH_CURRENT, FACT_COND_SAT_LOW

**Expected System Check:** High current is not explained by high condensing pressure

**Confirmed findings:**
- Compressor current is high
- Condensing pressure is low

**What this means:** Investigate electrical/mechanical loading rather than assuming condenser overload.

**Next Action / Check:** Verify voltage/unbalance, start/run components where applicable, compressor temperature and winding condition.


**Technical basis:**
- Danfoss Cold Room Troubleshooting: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker/Sporlan or Copeland technical guidance: https://webapps.copeland.com/online-product-information/Publication/LaunchPDF?Index=AEB&PDF=1495

---

## CH4-013 — Hot compressor after long off-cycle start

**Scope:** CORE  
**Operating state:** STABLE_COOLING  
**Given facts:** FACT_COMPRESSOR_HOT, FACT_LONG_OFF_CYCLE_STARTUP

**Expected System Check:** Startup after long off-cycle raises migration/flooded-start concern

**Confirmed findings:**
- Compressor is hot
- Long off-cycle startup occurred

**What this means:** Off-cycle migration can dilute oil and create abnormal startup conditions.

**Next Action / Check:** Check crankcase heater/pump-down protection and observe stabilized suction superheat before judging steady-state charge.


**Technical basis:**
- Danfoss Cold Room Troubleshooting: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker/Sporlan or Copeland technical guidance: https://webapps.copeland.com/online-product-information/Publication/LaunchPDF?Index=AEB&PDF=1495

---

## CH4-014 — Post-defrost low SH with no fan delay information

**Scope:** CORE  
**Operating state:** POST_DEFROST  
**Given facts:** FACT_POST_DEFROST_ACTIVE, FACT_EVAP_SH_LOW

**Expected System Check:** Low SH immediately post-defrost is transient until recovery is established

**Confirmed findings:**
- Post-defrost recovery is active
- Low superheat is recorded

**What this means:** Post-defrost readings can temporarily resemble flooding.

**Next Action / Check:** Confirm fan-delay status and allow stable cooling before repeating superheat.

**Must NOT conclude:**
- Do not diagnose TXV overfeed from this transient reading alone.

**Technical basis:**
- Danfoss Cold Room Troubleshooting: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker/Sporlan or Copeland technical guidance: https://webapps.copeland.com/online-product-information/Publication/LaunchPDF?Index=AEB&PDF=1495

---

## CH4-015 — Pump-down low suction with solenoid closed

**Scope:** CORE  
**Operating state:** PUMPDOWN  
**Given facts:** FACT_PUMPDOWN_ACTIVE, FACT_SOLENOID_COMMAND_CLOSED, FACT_SUCTION_PRESSURE_LOW

**Expected System Check:** Low suction is expected during pump-down

**Confirmed findings:**
- Pump-down is active
- Solenoid is commanded closed
- Suction is low

**What this means:** The control sequence intentionally pulls suction down.

**Next Action / Check:** Verify LP control opens at its intended cutout and compressor stops; do not interpret pump-down suction as steady cooling.


**Technical basis:**
- Danfoss Cold Room Troubleshooting: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker/Sporlan or Copeland technical guidance: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/

---

## CH4-016 — Cooling call with anti-short-cycle active and compressor off

**Scope:** CORE  
**Operating state:** STABLE_COOLING  
**Given facts:** FACT_COOLING_DEMAND_PRESENT, FACT_ANTI_SHORT_CYCLE_DELAY_ACTIVE, FACT_COMPRESSOR_NOT_RUNNING

**Expected System Check:** Intentional anti-short-cycle delay explains compressor off state

**Confirmed findings:**
- Cooling demand exists
- Anti-short-cycle delay is active
- Compressor is not running

**What this means:** The controller is intentionally delaying restart.

**Next Action / Check:** Wait for the configured delay to expire and verify the compressor is then energized.


**Technical basis:**
- Danfoss Cold Room Troubleshooting: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker/Sporlan or Copeland technical guidance: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/

---

## CH4-017 — Cooling call, coil dead, wiring unknown

**Scope:** CORE  
**Operating state:** STABLE_COOLING  
**Given facts:** FACT_COOLING_DEMAND_PRESENT, FACT_CONTACTOR_COIL_NOT_ENERGIZED, FACT_WIRING_SCHEME_UNKNOWN

**Expected System Check:** Control circuit is open upstream of the contactor coil

**Confirmed findings:**
- Cooling demand exists
- Contactor coil is not energized
- Actual wiring scheme is not yet known

**What this means:** The open point must be traced through the actual safety/control chain.

**Next Action / Check:** Obtain the wiring diagram and trace control voltage through thermostat/controller, safeties and interlocks to the coil.


**Technical basis:**
- Danfoss Cold Room Troubleshooting: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker/Sporlan or Copeland technical guidance: https://webapps.copeland.com/online-product-information/Publication/LaunchPDF?Index=AEB&PDF=1495

---

## CH4-018 — Contactor coil energized but compressor terminal voltage absent

**Scope:** CORE  
**Operating state:** STABLE_COOLING  
**Given facts:** FACT_CONTACTOR_COIL_ENERGIZED, FACT_COMPRESSOR_TERMINAL_VOLTAGE_ABSENT

**Expected System Check:** Power is being lost between energized contactor/control and compressor

**Confirmed findings:**
- Contactor coil is energized
- Voltage is absent at compressor terminals

**What this means:** A load-side contactor/wiring/open connection problem is indicated.

**Next Action / Check:** Measure line and load sides of contactor and trace power wiring to compressor terminals.


**Technical basis:**
- Danfoss Cold Room Troubleshooting: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker/Sporlan or Copeland technical guidance: https://webapps.copeland.com/online-product-information/Publication/LaunchPDF?Index=AEB&PDF=1495

---

## CH4-019 — Correct compressor voltage and open overload

**Scope:** CORE  
**Operating state:** STABLE_COOLING  
**Given facts:** FACT_COMPRESSOR_TERMINAL_VOLTAGE_PRESENT, FACT_OVERLOAD_PROTECTION_OPEN, FACT_COMPRESSOR_HOT

**Expected System Check:** Compressor protection is open on an overheated compressor

**Confirmed findings:**
- Correct terminal voltage is available
- Overload is open
- Compressor is hot

**What this means:** The compressor is protected from restart until the overheat cause is resolved.

**Next Action / Check:** De-energize, allow safe cooling, then investigate current, head/suction conditions, floodback and voltage before resetting/restarting.


**Technical basis:**
- Danfoss Cold Room Troubleshooting: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker/Sporlan or Copeland technical guidance: https://webapps.copeland.com/online-product-information/Publication/LaunchPDF?Index=AEB&PDF=1495

---

## CH4-020 — Fuse open after condenser fan failure

**Scope:** CORE  
**Operating state:** STABLE_COOLING  
**Given facts:** FACT_FUSE_OPEN, FACT_COND_FAN_FAILED

**Expected System Check:** Open fuse and fan failure require cause investigation before replacement

**Confirmed findings:**
- Fuse is open
- Condenser fan failure is localized

**What this means:** The fuse may be a consequence rather than the root cause.

**Next Action / Check:** With power isolated, check fan motor/wiring for shorts or overload and verify circuit protection before replacing the fuse.


**Technical basis:**
- Danfoss Cold Room Troubleshooting: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker/Sporlan or Copeland technical guidance: https://webapps.copeland.com/online-product-information/Publication/LaunchPDF?Index=AEB&PDF=1495

---

## CH4-021 — Sensor error but refrigeration performance normal

**Scope:** CORE  
**Operating state:** STABLE_COOLING  
**Given facts:** FACT_SENSOR_DISAGREES_REFERENCE, FACT_REFRIGERATION_PERFORMANCE_NORMAL

**Expected System Check:** Temperature-control problem is localized to sensing rather than refrigeration capacity

**Confirmed findings:**
- Sensor disagrees with reference
- Refrigeration performance is normal

**What this means:** A bad sensor/location can make a healthy refrigeration circuit appear unable to control temperature.

**Next Action / Check:** Verify sensor placement, calibration, wiring and controller input before refrigerant work.


**Technical basis:**
- Danfoss Cold Room Troubleshooting: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker/Sporlan or Copeland technical guidance: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/

---

## CH4-022 — Warm room with normal refrigeration but load unknown

**Scope:** CORE  
**Operating state:** STABLE_COOLING  
**Given facts:** FACT_BOX_TEMP_HIGH, FACT_REFRIGERATION_PERFORMANCE_NORMAL

**Expected System Check:** Refrigeration circuit appears normal; room/load side still needs characterization

**Confirmed findings:**
- Room is warm
- Refrigeration performance is normal

**What this means:** The remaining cause may be infiltration, product load, controls or sizing.

**Next Action / Check:** Characterize door/infiltration, product load, setpoint/sensor and design capacity before opening the refrigerant circuit.

**Must NOT conclude:**
- Do not add refrigerant just because the room is warm.

**Technical basis:**
- Danfoss Cold Room Troubleshooting: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker/Sporlan or Copeland technical guidance: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/

---

## CH4-023 — Warm room with normal refrigeration and high product load

**Scope:** CORE  
**Operating state:** STABLE_COOLING  
**Given facts:** FACT_BOX_TEMP_HIGH, FACT_REFRIGERATION_PERFORMANCE_NORMAL, FACT_WARM_PRODUCT_LOAD_CONFIRMED

**Expected System Check:** Warm-product pull-down explains extended room temperature recovery

**Confirmed findings:**
- Room is warm
- Refrigeration performance is normal
- Warm product load is confirmed

**What this means:** A transient load can exceed instantaneous capacity without a refrigeration fault.

**Next Action / Check:** Monitor pull-down trend and product load; verify temperature recovers as load is removed.


**Technical basis:**
- Danfoss Cold Room Troubleshooting: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker/Sporlan or Copeland technical guidance: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/

---

## CH4-024 — Warm room with normal refrigeration and sealed door

**Scope:** CORE  
**Operating state:** STABLE_COOLING  
**Given facts:** FACT_BOX_TEMP_HIGH, FACT_REFRIGERATION_PERFORMANCE_NORMAL, FACT_DOOR_CLOSED_SEALED, FACT_INFILTRATION_LOAD_CHARACTERIZED

**Expected System Check:** Room remains warm after infiltration is ruled out

**Confirmed findings:**
- Room is warm
- Refrigeration performance is normal
- Door/infiltration is ruled out

**What this means:** Load, sensor/control, distribution or sizing still need separation.

**Next Action / Check:** Verify product load, sensor location/setpoint and compare actual load with equipment capacity.


**Technical basis:**
- Danfoss Cold Room Troubleshooting: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker/Sporlan or Copeland technical guidance: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/

---

## CH4-025 — Verified load exceeds capacity with normal circuit

**Scope:** CORE  
**Operating state:** STABLE_COOLING  
**Given facts:** FACT_DESIGN_LOAD_EXCEEDS_CAPACITY, FACT_REFRIGERATION_PERFORMANCE_NORMAL, FACT_AIRFLOW_VERIFIED_NORMAL, FACT_CONTROLS_VERIFIED_NORMAL

**Expected System Check:** System capacity is insufficient for verified load

**Confirmed findings:**
- Load exceeds equipment capacity
- Refrigeration, airflow and controls are verified normal

**What this means:** This is a sizing/capacity problem, not a charge-adjustment problem.

**Next Action / Check:** Quantify design/actual load and select corrective capacity/load reduction rather than altering charge.


**Technical basis:**
- Danfoss Cold Room Troubleshooting: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker/Sporlan or Copeland technical guidance: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/

---

## CH4-026 — Bubbles with confirmed leak

**Scope:** CORE  
**Operating state:** STABLE_COOLING  
**Given facts:** FACT_SIGHT_GLASS_FLASHING, FACT_LEAK_CONFIRMED

**Expected System Check:** Confirmed leak makes refrigerant loss credible; bubbles are supporting evidence

**Confirmed findings:**
- Sight glass bubbles
- Refrigerant leak is confirmed

**What this means:** Direct leak evidence is stronger than sight-glass interpretation alone.

**Next Action / Check:** Repair leak and restore charge by manufacturer procedure, then verify stable SH/SC/liquid condition.


**Technical basis:**
- Danfoss Cold Room Troubleshooting: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker/Sporlan or Copeland technical guidance: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/

---

## CH4-027 — Bubbles plus drier drop

**Scope:** CORE  
**Operating state:** STABLE_COOLING  
**Given facts:** FACT_SIGHT_GLASS_FLASHING, FACT_DRIER_TEMP_DROP, FACT_DRIER_TEMPERATURES_MEASURED

**Expected System Check:** Liquid-line restriction can create flash gas downstream

**Confirmed findings:**
- Sight glass bubbles
- Temperature drop across drier

**What this means:** A restricted drier can mimic low-charge bubbles by reducing liquid pressure.

**Next Action / Check:** Verify drier pressure/temperature drop and replace the restricted drier before judging charge.

**Must NOT conclude:**
- Do not diagnose low charge from bubbles alone.

**Technical basis:**
- Danfoss Cold Room Troubleshooting: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker/Sporlan or Copeland technical guidance: https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-010/10-11.pdf

---

## CH4-028 — High SH low SC with confirmed drier restriction

**Scope:** CORE  
**Operating state:** STABLE_COOLING  
**Given facts:** FACT_EVAP_SH_HIGH, FACT_SUBCOOLING_LOW, FACT_DRIER_TEMP_DROP, FACT_DRIER_TEMPERATURES_MEASURED

**Expected System Check:** Confirmed liquid-line restriction takes priority over charge-pattern shortcut

**Confirmed findings:**
- High superheat
- Low subcooling
- Drier temperature drop is confirmed

**What this means:** Restriction can create starvation and misleading charge indicators.

**Next Action / Check:** Correct the drier restriction, then stabilize and reassess charge indicators.

**Must NOT conclude:**
- Do not add refrigerant before correcting the confirmed restriction.

**Technical basis:**
- Danfoss Cold Room Troubleshooting: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker/Sporlan or Copeland technical guidance: https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-010/10-11.pdf

---

## CH4-029 — High SH low SC with confirmed leak and no restriction

**Scope:** CORE  
**Operating state:** STABLE_COOLING  
**Given facts:** FACT_EVAP_SH_HIGH, FACT_SUBCOOLING_LOW, FACT_LEAK_CONFIRMED, FACT_NO_LOCALIZED_RESTRICTION

**Expected System Check:** Confirmed leak supports refrigerant-loss starvation

**Confirmed findings:**
- High superheat
- Low subcooling
- Leak is confirmed
- No localized restriction is found

**What this means:** The combined pattern plus direct leak evidence supports low refrigerant inventory.

**Next Action / Check:** Repair leak, evacuate/charge correctly, then verify SH/SC under stable operation.


**Technical basis:**
- Danfoss Cold Room Troubleshooting: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker/Sporlan or Copeland technical guidance: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/

---

## CH4-030 — High SH high SC with proper liquid at TXV

**Scope:** CORE  
**Operating state:** STABLE_COOLING  
**Given facts:** FACT_EVAP_SH_HIGH, FACT_SUBCOOLING_HIGH, FACT_TXV_UPSTREAM_LIQUID_PROPER

**Expected System Check:** High SH with retained liquid inventory points away from simple low charge

**Confirmed findings:**
- High superheat
- High subcooling
- Proper liquid reaches TXV

**What this means:** A feed/control problem is more likely than low refrigerant inventory.

**Next Action / Check:** Check TXV response, bulb/equalizer and evaporator load before changing charge.

**Must NOT conclude:**
- Do not diagnose low charge from high SH alone.

**Technical basis:**
- Danfoss Cold Room Troubleshooting: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker/Sporlan or Copeland technical guidance: https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-010/10-11.pdf

---

## CH4-031 — Low SH with bulb bad contact

**Scope:** CORE  
**Operating state:** STABLE_COOLING  
**Given facts:** FACT_EVAP_SH_LOW, FACT_TXV_BULB_BAD_CONTACT

**Expected System Check:** TXV bulb installation can cause improper feed control

**Confirmed findings:**
- Low superheat
- TXV bulb contact/location is incorrect

**What this means:** Bad sensing can drive incorrect valve feeding and floodback risk.

**Next Action / Check:** Correct bulb mounting/insulation and recheck superheat after stabilization.


**Technical basis:**
- Danfoss Cold Room Troubleshooting: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker/Sporlan or Copeland technical guidance: https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-010/10-11.pdf

---

## CH4-032 — TXV hunting with low load

**Scope:** CORE  
**Operating state:** STABLE_COOLING  
**Given facts:** FACT_TXV_HUNTING, FACT_LOW_EVAP_LOAD

**Expected System Check:** TXV hunting may be load/valve-control related

**Confirmed findings:**
- TXV/feed hunting
- Evaporator load is low

**What this means:** Low load can destabilize a valve that is oversized or improperly adjusted.

**Next Action / Check:** Verify valve sizing, bulb location, SH setting and stability as load changes.


**Technical basis:**
- Danfoss Cold Room Troubleshooting: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker/Sporlan or Copeland technical guidance: https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-010/10-11.pdf

---

## CH4-033 — Uneven feed plus inlet restriction

**Scope:** CORE  
**Operating state:** STABLE_COOLING  
**Given facts:** FACT_EVAP_FEED_UNEVEN, FACT_TXV_INLET_RESTRICTION

**Expected System Check:** Localized TXV inlet restriction can produce uneven/starved feed

**Confirmed findings:**
- Uneven evaporator feed
- TXV inlet restriction is identified

**What this means:** The feed problem is localized upstream/at the expansion device.

**Next Action / Check:** Inspect/clean or replace the inlet screen/orifice and verify solid liquid supply before retesting.


**Technical basis:**
- Danfoss Cold Room Troubleshooting: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker/Sporlan or Copeland technical guidance: https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-010/10-11.pdf

---

## CH4-034 — Moisture wet plus TXV no response

**Scope:** CORE  
**Operating state:** STABLE_COOLING  
**Given facts:** FACT_MOISTURE_INDICATED, FACT_TXV_NO_RESPONSE, FACT_EVAP_SH_HIGH

**Expected System Check:** Moisture contamination can freeze/restrict the expansion valve

**Confirmed findings:**
- Moisture indicator is wet
- TXV does not respond
- High superheat

**What this means:** Moisture can intermittently restrict the valve at the coldest point.

**Next Action / Check:** Address moisture with proper dehydration/filter-drier service, then verify valve response and superheat.


**Technical basis:**
- Danfoss Cold Room Troubleshooting: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker/Sporlan or Copeland technical guidance: https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-010/10-11.pdf

---

## CH4-035 — EEV high SH with sensor disagreement

**Scope:** CORE  
**Operating state:** STABLE_COOLING  
**Given facts:** FACT_EVAP_SH_HIGH, FACT_SENSOR_DISAGREES_REFERENCE, FACT_TXV_NO_RESPONSE

**Expected System Check:** Sensor/input error can make electronic expansion control appear starved

**Confirmed findings:**
- High superheat
- Sensor disagrees with reference
- Expansion valve does not respond correctly

**What this means:** EEV control depends on accurate pressure/temperature inputs.

**Next Action / Check:** Verify sensor type/range, wiring, location and controller configuration before replacing the valve.


**Technical basis:**
- Danfoss Cold Room Troubleshooting: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker/Sporlan or Copeland technical guidance: https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-100/100-50-5.1-Superheat-Control.pdf

---

## CH4-036 — High DLT with low suction and high SH

**Scope:** CORE  
**Operating state:** STABLE_COOLING  
**Given facts:** FACT_COMPRESSOR_HIGH_DLT, FACT_SUCTION_PRESSURE_LOW, FACT_EVAP_SH_HIGH

**Expected System Check:** Compressor is operating with high discharge temperature under starved/low-suction conditions

**Confirmed findings:**
- High discharge temperature
- Low suction
- High superheat

**What this means:** Low suction/high SH can increase compression ratio and compressor thermal stress.

**Next Action / Check:** Correct the cause of low suction/starvation and verify compressor operating envelope and DLT.


**Technical basis:**
- Danfoss Cold Room Troubleshooting: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker/Sporlan or Copeland technical guidance: https://webapps.copeland.com/online-product-information/Publication/LaunchPDF?Index=AEB&PDF=1495

---

## CH4-037 — High DLT with high head

**Scope:** CORE  
**Operating state:** STABLE_COOLING  
**Given facts:** FACT_COMPRESSOR_HIGH_DLT, FACT_COND_SAT_HIGH

**Expected System Check:** High-side load is contributing to compressor thermal stress

**Confirmed findings:**
- High discharge temperature
- High condensing pressure

**What this means:** Excessive compression work can overheat the compressor.

**Next Action / Check:** Correct high-head cause first and recheck current, compression ratio and discharge temperature.


**Technical basis:**
- Danfoss Cold Room Troubleshooting: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker/Sporlan or Copeland technical guidance: https://webapps.copeland.com/online-product-information/Publication/LaunchPDF?Index=AEB&PDF=1495

---

## CH4-038 — Weak differential plus normal load

**Scope:** CORE  
**Operating state:** STABLE_COOLING  
**Given facts:** FACT_COMPRESSOR_RUNNING, FACT_COMPRESSOR_PRESSURE_DIFFERENTIAL_WEAK, FACT_AIRFLOW_VERIFIED_NORMAL, FACT_INFILTRATION_LOAD_CHARACTERIZED

**Expected System Check:** Running compressor has weak pumping under otherwise normal conditions

**Confirmed findings:**
- Compressor is running
- Pressure differential is weak
- Airflow/load are characterized

**What this means:** Reduced compressor pumping capacity is credible after external causes are ruled out.

**Next Action / Check:** Verify pressures/instrument accuracy and current, then evaluate compressor internal leakage/efficiency.


**Technical basis:**
- Danfoss Cold Room Troubleshooting: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker/Sporlan or Copeland technical guidance: https://webapps.copeland.com/online-product-information/Publication/LaunchPDF?Index=AEB&PDF=1495

---

## CH4-039 — Weak differential plus valve leakage evidence

**Scope:** CORE  
**Operating state:** STABLE_COOLING  
**Given facts:** FACT_COMPRESSOR_PRESSURE_DIFFERENTIAL_WEAK, FACT_COMPRESSOR_VALVE_LEAKAGE_EVIDENCE

**Expected System Check:** Internal compressor leakage is localized

**Confirmed findings:**
- Weak compressor differential
- Internal leakage evidence is present

**What this means:** The compressor cannot maintain normal pressure separation.

**Next Action / Check:** Confirm against model performance/current and plan compressor repair/replacement if evidence remains.


**Technical basis:**
- Danfoss Cold Room Troubleshooting: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker/Sporlan or Copeland technical guidance: https://webapps.copeland.com/online-product-information/Publication/LaunchPDF?Index=AEB&PDF=1495

---

## CH4-040 — High head and low-charge clues conflict

**Scope:** CORE  
**Operating state:** STABLE_COOLING  
**Given facts:** FACT_COND_SAT_HIGH, FACT_EVAP_SH_HIGH, FACT_SUBCOOLING_LOW

**Expected System Check:** Charge clues conflict and are insufficient for a charge diagnosis

**Confirmed findings:**
- High head
- High superheat
- Low subcooling

**What this means:** The pattern does not uniquely support undercharge or overcharge.

**Next Action / Check:** Verify operating state, airflow/ambient, liquid-line restriction, leak evidence and measurement accuracy before charge action.

**Must NOT conclude:**
- Do not diagnose low charge or overcharge from this conflicting pattern alone.

**Technical basis:**
- Danfoss Cold Room Troubleshooting: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker/Sporlan or Copeland technical guidance: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/

---

## CH4-041 — High head plus overcharge evidence and fan stopped

**Scope:** CORE  
**Operating state:** STABLE_COOLING  
**Given facts:** FACT_COND_SAT_HIGH, FACT_OVERCHARGE_EVIDENCE, FACT_COND_FAN_NOT_RUNNING

**Expected System Check:** Direct condenser airflow fault must be corrected even when overcharge evidence also exists

**Confirmed findings:**
- High head
- Condenser fan is stopped
- Overcharge evidence is present

**What this means:** Multiple faults may coexist; the stopped fan is an immediate heat-rejection fault.

**Next Action / Check:** Restore condenser airflow first, then reassess head pressure and remaining overcharge evidence.


**Technical basis:**
- Danfoss Cold Room Troubleshooting: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker/Sporlan or Copeland technical guidance: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/

---

## CH4-042 — Dirty condenser plus noncondensable evidence

**Scope:** CORE  
**Operating state:** STABLE_COOLING  
**Given facts:** FACT_COND_COIL_DIRTY, FACT_NONCONDENSABLE_EVIDENCE, FACT_COND_SAT_HIGH

**Expected System Check:** Two high-side faults are supported

**Confirmed findings:**
- Dirty condenser
- Noncondensable evidence
- High head

**What this means:** Do not drop one confirmed high-side fault when another is selected as primary.

**Next Action / Check:** Clean/restore condenser heat rejection, then verify whether noncondensable evidence remains under stable conditions.


**Technical basis:**
- Danfoss Cold Room Troubleshooting: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker/Sporlan or Copeland technical guidance: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/

---

## CH4-043 — Evap fan stopped plus high SH plus drier restriction

**Scope:** CORE  
**Operating state:** STABLE_COOLING  
**Given facts:** FACT_EVAP_FAN_NOT_RUNNING, FACT_EVAP_SH_HIGH, FACT_DRIER_TEMP_DROP

**Expected System Check:** Multiple starvation/heat-transfer faults are present

**Confirmed findings:**
- Evaporator fan is stopped
- High superheat
- Drier restriction evidence

**What this means:** Airflow loss and liquid restriction can coexist and distort SH.

**Next Action / Check:** Restore evaporator airflow and correct the confirmed drier restriction before judging charge/TXV behavior.


**Technical basis:**
- Danfoss Cold Room Troubleshooting: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker/Sporlan or Copeland technical guidance: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/

---

## CH4-044 — Unknown state plus direct fan fault and high SH

**Scope:** CORE  
**Operating state:** UNKNOWN  
**Given facts:** FACT_EVAP_FAN_NOT_RUNNING, FACT_EVAP_SH_HIGH

**Expected System Check:** Direct evaporator fan failure remains actionable even with unknown operating state

**Confirmed findings:**
- Evaporator fan is not running
- High SH is recorded with unknown state

**What this means:** Operating state limits interpretation of SH but does not erase a directly observed fan fault.

**Next Action / Check:** Diagnose/restore the evaporator fan first; then confirm stable cooling and repeat SH.


**Technical basis:**
- Danfoss Cold Room Troubleshooting: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker/Sporlan or Copeland technical guidance: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/

---

## CH4-045 — Unknown state plus direct condenser fan fault and high head

**Scope:** CORE  
**Operating state:** UNKNOWN  
**Given facts:** FACT_COND_FAN_NOT_RUNNING, FACT_COND_SAT_HIGH

**Expected System Check:** Direct condenser fan failure remains actionable even with unknown state

**Confirmed findings:**
- Condenser fan is not running
- High head is recorded with unknown state

**What this means:** The direct airflow fault is actionable; state uncertainty affects interpretation of secondary readings.

**Next Action / Check:** Restore condenser fan operation, then establish stable state and recheck head pressure.


**Technical basis:**
- Danfoss Cold Room Troubleshooting: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker/Sporlan or Copeland technical guidance: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/

---

## CH4-046 — Low head in low ambient with no head control

**Scope:** CORE  
**Operating state:** STABLE_COOLING  
**Given facts:** FACT_COND_SAT_LOW, FACT_LOW_AMBIENT

**Expected System Check:** Low ambient can drive low condensing pressure when no control evidence is present

**Confirmed findings:**
- Low head
- Low ambient

**What this means:** Low condensing pressure may reduce liquid pressure and cause flash gas/feed problems.

**Next Action / Check:** Verify whether head-pressure control is required/present and check liquid condition at the metering device.


**Technical basis:**
- Danfoss Cold Room Troubleshooting: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker/Sporlan or Copeland technical guidance: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/

---

## CH4-047 — Low head in low ambient with head control installed

**Scope:** CORE  
**Operating state:** STABLE_COOLING  
**Given facts:** FACT_COND_SAT_LOW, FACT_LOW_AMBIENT, FACT_HEAD_CONTROL_INSTALLED

**Expected System Check:** Installed head-pressure control is not maintaining expected condensing pressure

**Confirmed findings:**
- Low head
- Low ambient
- Head-pressure control is installed

**What this means:** The control system or its required refrigerant inventory may be inadequate.

**Next Action / Check:** Check head-control operation/setting and flood-charge requirement before altering TXV.


**Technical basis:**
- Danfoss Cold Room Troubleshooting: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker/Sporlan or Copeland technical guidance: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/

---

## CH4-048 — Head control flood charge insufficient with bubbles

**Scope:** CORE  
**Operating state:** STABLE_COOLING  
**Given facts:** FACT_HEAD_CONTROL_INSTALLED, FACT_HEAD_CONTROL_FLOOD_CHARGE_INSUFFICIENT, FACT_SIGHT_GLASS_FLASHING, FACT_LOW_AMBIENT

**Expected System Check:** Low-ambient liquid starvation is tied to head-control inventory

**Confirmed findings:**
- Head control is installed
- Flood charge is insufficient
- Sight glass bubbles in low ambient

**What this means:** The system lacks the inventory required for configured condenser flooding.

**Next Action / Check:** Correct charge to the head-control design requirement and verify liquid condition/head pressure.


**Technical basis:**
- Danfoss Cold Room Troubleshooting: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker/Sporlan or Copeland technical guidance: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/

---

## CH4-049 — LP control open during normal cooling, not pumpdown

**Scope:** CORE  
**Operating state:** STABLE_COOLING  
**Given facts:** FACT_LOW_PRESSURE_CONTROL_TRIP, FACT_LP_CONTROL_OPEN, FACT_COOLING_DEMAND_PRESENT

**Expected System Check:** LP control is interrupting cooling and requires setting/system evaluation

**Confirmed findings:**
- LP control is open
- Cooling demand is present

**What this means:** Unlike intentional pump-down, this may be an incorrect setting or a real low-suction condition.

**Next Action / Check:** Compare cutout/cutin to equipment specification and determine why suction reached cutout.


**Technical basis:**
- Danfoss Cold Room Troubleshooting: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker/Sporlan or Copeland technical guidance: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/

---

## CH4-050 — HP safety open but head now normal

**Scope:** CORE  
**Operating state:** STABLE_COOLING  
**Given facts:** FACT_HP_SAFETY_OPEN, FACT_HEAD_NORMAL_FOR_STATE

**Expected System Check:** HP trip history needs cause investigation even if pressure has normalized

**Confirmed findings:**
- HP safety is open/tripped
- Current head pressure is normal

**What this means:** An intermittent airflow/load/control event may have caused the trip.

**Next Action / Check:** Review fan operation, condenser blockage/recirculation, ambient/load and reset history before simply resetting.


**Technical basis:**
- Danfoss Cold Room Troubleshooting: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker/Sporlan or Copeland technical guidance: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/

---

## CH4-051 — Solenoid commanded open, voltage present, no flow

**Scope:** CORE  
**Operating state:** STABLE_COOLING  
**Given facts:** FACT_SOLENOID_COMMAND_OPEN, FACT_SOLENOID_COIL_VOLTAGE_PRESENT, FACT_SOLENOID_NO_FLOW_WHEN_OPEN

**Expected System Check:** Liquid solenoid has a mechanical/flow fault

**Confirmed findings:**
- Solenoid is commanded open
- Correct coil voltage is present
- No refrigerant flow occurs

**What this means:** Electrical command is reaching the valve but the flow function is not occurring.

**Next Action / Check:** Verify pressure differential/valve orientation and inspect the solenoid mechanically for stuck/restricted operation.


**Technical basis:**
- Danfoss Cold Room Troubleshooting: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker/Sporlan or Copeland technical guidance: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/

---

## CH4-052 — Solenoid commanded closed but flow continues

**Scope:** CORE  
**Operating state:** STABLE_COOLING  
**Given facts:** FACT_SOLENOID_COMMAND_CLOSED, FACT_SOLENOID_FLOW_CONTINUES_CLOSED

**Expected System Check:** Liquid solenoid is leaking or not closing

**Confirmed findings:**
- Solenoid is commanded closed
- Flow continues

**What this means:** Pump-down/control sequence cannot work correctly if the valve leaks through.

**Next Action / Check:** Verify de-energized coil/control state and inspect valve seat/mechanical closure.


**Technical basis:**
- Danfoss Cold Room Troubleshooting: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker/Sporlan or Copeland technical guidance: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/

---

## CH4-053 — Room sensor disagrees only during door openings

**Scope:** CORE  
**Operating state:** STABLE_COOLING  
**Given facts:** FACT_SENSOR_DISAGREES_REFERENCE, FACT_DOOR_OPEN_OR_LEAKING

**Expected System Check:** Sensor/location may be influenced by infiltration

**Confirmed findings:**
- Sensor disagrees with reference
- Door/infiltration condition is present

**What this means:** Sensor placement near an infiltration path can create misleading control input.

**Next Action / Check:** Compare sensor and reference with door closed/stable; inspect sensor location before recalibration/replacement.


**Technical basis:**
- Danfoss Cold Room Troubleshooting: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker/Sporlan or Copeland technical guidance: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/

---

## CH4-054 — Controller setpoint wrong with otherwise normal system

**Scope:** CORE  
**Operating state:** STABLE_COOLING  
**Given facts:** FACT_CONTROLLER_SETPOINT_WRONG, FACT_REFRIGERATION_PERFORMANCE_NORMAL

**Expected System Check:** Control setting explains temperature complaint

**Confirmed findings:**
- Controller setpoint/differential is incorrect
- Refrigeration performance is normal

**What this means:** A settings problem can mimic refrigeration underperformance.

**Next Action / Check:** Correct setpoint/differential per application and observe temperature control before mechanical service.


**Technical basis:**
- Danfoss Cold Room Troubleshooting: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker/Sporlan or Copeland technical guidance: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/

---

## CH4-055 — High product load plus dirty condenser

**Scope:** CORE  
**Operating state:** STABLE_COOLING  
**Given facts:** FACT_HIGH_PRODUCT_LOAD, FACT_COND_COIL_DIRTY, FACT_BOX_TEMP_HIGH

**Expected System Check:** Load and heat-rejection faults coexist

**Confirmed findings:**
- High product load
- Dirty condenser
- Room temperature high

**What this means:** Both increased load and reduced condenser performance can prolong pull-down.

**Next Action / Check:** Clean condenser first, quantify load/pull-down trend, then reassess refrigeration performance.


**Technical basis:**
- Danfoss Cold Room Troubleshooting: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker/Sporlan or Copeland technical guidance: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/

---

## CH4-056 — WIC iced coil with fan running and defrost incomplete

**Scope:** WIC  
**Operating state:** STABLE_COOLING  
**Given facts:** FACT_EVAP_COIL_ICED, FACT_EVAP_FAN_RUNNING, FACT_DEFROST_INCOMPLETE

**Expected System Check:** Inadequate defrost is supported

**Confirmed findings:**
- Evaporator is iced
- Fan runs
- Defrost does not fully clear coil

**What this means:** With airflow fan available, incomplete defrost is a direct icing cause.

**Next Action / Check:** Check defrost duration, heater output and termination before charge adjustments.


**Technical basis:**
- Danfoss Cold Room Troubleshooting: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker/Sporlan or Copeland technical guidance: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/

---

## CH4-057 — WIC iced coil with fan stopped and incomplete defrost

**Scope:** WIC  
**Operating state:** STABLE_COOLING  
**Given facts:** FACT_EVAP_COIL_ICED, FACT_EVAP_FAN_NOT_RUNNING, FACT_DEFROST_INCOMPLETE

**Expected System Check:** Evaporator fan failure and inadequate defrost both contribute to icing

**Confirmed findings:**
- Evaporator is iced
- Fan is stopped
- Defrost is incomplete

**What this means:** Multiple WIC icing causes are present.

**Next Action / Check:** Restore fan operation and verify a complete defrost cycle before refrigeration-side diagnosis.


**Technical basis:**
- Danfoss Cold Room Troubleshooting: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker/Sporlan or Copeland technical guidance: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/

---

## CH4-058 — WIC defrost commanded, heater voltage present, zero current

**Scope:** WIC  
**Operating state:** STABLE_COOLING  
**Given facts:** FACT_DEFROST_COMMAND_PRESENT, FACT_DEFROST_HEATER_VOLTAGE_PRESENT, FACT_DEFROST_HEATER_CURRENT_ABSENT

**Expected System Check:** Defrost heater/load circuit failure is localized

**Confirmed findings:**
- Defrost command is present
- Heater voltage is present
- Heater current is absent

**What this means:** Voltage without current indicates an open heater/load connection rather than a missing command.

**Next Action / Check:** Power off and check heater resistance/continuity and wiring connections.


**Technical basis:**
- Danfoss Cold Room Troubleshooting: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker/Sporlan or Copeland technical guidance: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/

---

## CH4-059 — WIC defrost heater works but termination ends too soon

**Scope:** WIC  
**Operating state:** STABLE_COOLING  
**Given facts:** FACT_DEFROST_TERMINATION_ERROR, FACT_DEFROST_INCOMPLETE

**Expected System Check:** Defrost termination control is ending defrost incorrectly

**Confirmed findings:**
- Defrost terminates incorrectly
- Coil is not fully cleared

**What this means:** Premature termination can leave residual ice despite a functional heater.

**Next Action / Check:** Verify termination sensor location/calibration and controller termination setting.


**Technical basis:**
- Danfoss Cold Room Troubleshooting: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker/Sporlan or Copeland technical guidance: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/

---

## CH4-060 — WIC post-defrost fan delay active and room temporarily warm

**Scope:** WIC  
**Operating state:** POST_DEFROST  
**Given facts:** FACT_POST_DEFROST_ACTIVE, FACT_FAN_DELAY_ACTIVE, FACT_BOX_TEMP_HIGH

**Expected System Check:** Intentional fan delay can temporarily delay room cooling after defrost

**Confirmed findings:**
- Post-defrost recovery is active
- Fan delay is active
- Room is temporarily warm

**What this means:** This may be normal sequence behavior until the coil is ready for airflow.

**Next Action / Check:** Confirm fan starts at the configured delay/temperature and room temperature then recovers.


**Technical basis:**
- Danfoss Cold Room Troubleshooting: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker/Sporlan or Copeland technical guidance: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/

---

## CH4-061 — WIC fan starts too early after defrost

**Scope:** WIC  
**Operating state:** STABLE_COOLING  
**Given facts:** FACT_FAN_DELAY_ERROR, FACT_POST_DEFROST_ACTIVE

**Expected System Check:** Evaporator fan-delay control is incorrect

**Confirmed findings:**
- Post-defrost recovery
- Fan-delay error

**What this means:** Early fan operation can blow residual heat/moisture into the room.

**Next Action / Check:** Check fan-delay sensor/controller setting and wiring.


**Technical basis:**
- Danfoss Cold Room Troubleshooting: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker/Sporlan or Copeland technical guidance: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/

---

## CH4-062 — WIC drain refreezes after complete defrost

**Scope:** WIC  
**Operating state:** STABLE_COOLING  
**Given facts:** FACT_DEFROST_COMPLETES, FACT_DRAIN_REFREEZE

**Expected System Check:** Drain/refreeze fault remains after successful coil defrost

**Confirmed findings:**
- Defrost completes
- Water refreezes at drain/pan

**What this means:** The remaining problem is drainage/drain heat rather than defrost duration.

**Next Action / Check:** Check drain heater, trap/slope, blockage and pan drainage.


**Technical basis:**
- Danfoss Cold Room Troubleshooting: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker/Sporlan or Copeland technical guidance: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/

---

## CH4-063 — WIC icing concentrated near leaking door

**Scope:** WIC  
**Operating state:** STABLE_COOLING  
**Given facts:** FACT_EVAP_COIL_ICED, FACT_DOOR_INFILTRATION_CONFIRMED

**Expected System Check:** Air infiltration is a confirmed moisture/icing load

**Confirmed findings:**
- Evaporator is iced
- Door infiltration is confirmed

**What this means:** Warm humid air entering the box increases frost load.

**Next Action / Check:** Repair door/gasket/alignment and verify icing rate after a complete defrost.


**Technical basis:**
- Danfoss Cold Room Troubleshooting: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker/Sporlan or Copeland technical guidance: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/

---

## CH4-064 — WIC icing with sealed door, fan normal, defrost normal

**Scope:** WIC  
**Operating state:** STABLE_COOLING  
**Given facts:** FACT_EVAP_COIL_ICED, FACT_DOOR_CLOSED_SEALED, FACT_EVAP_FAN_RUNNING, FACT_DEFROST_COMPLETES

**Expected System Check:** Common airflow, infiltration and incomplete-defrost causes are ruled down

**Confirmed findings:**
- Evaporator is iced
- Door seals
- Fan runs
- Defrost completes

**What this means:** Investigate low evaporating temperature/feed/load rather than repeating the same checks.

**Next Action / Check:** Measure stable suction/evaporating temperature, SH, feed pattern and room load after defrost.


**Technical basis:**
- Danfoss Cold Room Troubleshooting: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker/Sporlan or Copeland technical guidance: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/

---

## CH4-065 — WIC long runtime with warm load and normal refrigeration

**Scope:** WIC  
**Operating state:** STABLE_COOLING  
**Given facts:** FACT_COMPRESSOR_LONG_RUNTIME, FACT_WARM_PRODUCT_LOAD_CONFIRMED, FACT_REFRIGERATION_PERFORMANCE_NORMAL

**Expected System Check:** Extended runtime is explained by warm-product pull-down

**Confirmed findings:**
- Compressor runs long
- Warm product load is confirmed
- Refrigeration performance is normal

**What this means:** Long runtime can be normal during pull-down.

**Next Action / Check:** Track product/room temperature trend and confirm runtime falls as load is removed.


**Technical basis:**
- Danfoss Cold Room Troubleshooting: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker/Sporlan or Copeland technical guidance: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/

---

## CH4-066 — WIC long runtime with no abnormal load and dirty condenser

**Scope:** WIC  
**Operating state:** STABLE_COOLING  
**Given facts:** FACT_COMPRESSOR_LONG_RUNTIME, FACT_COND_COIL_DIRTY, FACT_INFILTRATION_LOAD_CHARACTERIZED

**Expected System Check:** Dirty condenser is a supported cause of prolonged runtime

**Confirmed findings:**
- Long compressor runtime
- Dirty condenser
- Abnormal room load is ruled down

**What this means:** Poor heat rejection reduces capacity and extends runtime.

**Next Action / Check:** Clean condenser and verify head pressure/capacity and runtime improve.


**Technical basis:**
- Danfoss Cold Room Troubleshooting: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker/Sporlan or Copeland technical guidance: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/

---

## CH4-067 — WIC long runtime with normal coils and sensor error

**Scope:** WIC  
**Operating state:** STABLE_COOLING  
**Given facts:** FACT_COMPRESSOR_LONG_RUNTIME, FACT_COND_COIL_CLEAN, FACT_EVAP_COIL_CLEAR, FACT_SENSOR_ERROR

**Expected System Check:** Control/sensor error can cause excessive runtime

**Confirmed findings:**
- Long runtime
- Coils are clear/clean
- Sensor error is present

**What this means:** A bad sensor/control input can keep demand active unnecessarily.

**Next Action / Check:** Verify sensor calibration/location and controller cutout behavior.


**Technical basis:**
- Danfoss Cold Room Troubleshooting: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker/Sporlan or Copeland technical guidance: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/

---

## CH4-068 — WIC pump-down solenoid closed but flow continues

**Scope:** WIC  
**Operating state:** PUMPDOWN  
**Given facts:** FACT_PUMPDOWN_ACTIVE, FACT_SOLENOID_COMMAND_CLOSED, FACT_SOLENOID_FLOW_CONTINUES_CLOSED

**Expected System Check:** Leaking liquid solenoid defeats pump-down

**Confirmed findings:**
- Pump-down active
- Solenoid commanded closed
- Flow continues

**What this means:** The low side cannot pump down normally while liquid continues feeding.

**Next Action / Check:** Verify valve de-energizes and inspect/repair leaking solenoid seat.


**Technical basis:**
- Danfoss Cold Room Troubleshooting: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker/Sporlan or Copeland technical guidance: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/

---

## CH4-069 — WIC pump-down LP control opens too early

**Scope:** WIC  
**Operating state:** PUMPDOWN  
**Given facts:** FACT_PUMPDOWN_ACTIVE, FACT_LP_CONTROL_OPEN, FACT_LOW_PRESSURE_CONTROL_TRIP

**Expected System Check:** LP control setting/operation must match intended pump-down cutout

**Confirmed findings:**
- Pump-down active
- LP control opens/trips

**What this means:** An incorrect cutout can stop the compressor before proper pump-down.

**Next Action / Check:** Compare LP cutout/cutin to equipment/control specification and adjust/repair as required.


**Technical basis:**
- Danfoss Cold Room Troubleshooting: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker/Sporlan or Copeland technical guidance: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/

---

## CH4-070 — WIC high room temp with sealed door and warm product load

**Scope:** WIC  
**Operating state:** STABLE_COOLING  
**Given facts:** FACT_BOX_TEMP_HIGH, FACT_DOOR_CLOSED_SEALED, FACT_WARM_PRODUCT_LOAD_CONFIRMED

**Expected System Check:** Warm product load remains a direct explanation after infiltration is ruled out

**Confirmed findings:**
- Room is warm
- Door is sealed
- Warm product load is confirmed

**What this means:** The load can temporarily exceed available capacity.

**Next Action / Check:** Monitor pull-down and verify refrigeration performance/capacity against the actual product load.


**Technical basis:**
- Danfoss Cold Room Troubleshooting: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker/Sporlan or Copeland technical guidance: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/

---

## CH4-071 — WIC high room temp with infiltration and sensor error

**Scope:** WIC  
**Operating state:** STABLE_COOLING  
**Given facts:** FACT_BOX_TEMP_HIGH, FACT_DOOR_INFILTRATION_CONFIRMED, FACT_SENSOR_ERROR

**Expected System Check:** Both infiltration and sensing faults can affect room control

**Confirmed findings:**
- Room is warm
- Door infiltration is confirmed
- Sensor error is present

**What this means:** Multiple room-side faults are present and should both be preserved.

**Next Action / Check:** Repair infiltration and verify sensor/reference accuracy before refrigerant adjustments.


**Technical basis:**
- Danfoss Cold Room Troubleshooting: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker/Sporlan or Copeland technical guidance: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/

---

## CH4-072 — WIC dirty condenser plus high load plus sensor error

**Scope:** WIC  
**Operating state:** STABLE_COOLING  
**Given facts:** FACT_COND_COIL_DIRTY, FACT_HIGH_PRODUCT_LOAD, FACT_SENSOR_ERROR, FACT_BOX_TEMP_HIGH

**Expected System Check:** Multiple independent contributors to warm-room complaint are present

**Confirmed findings:**
- Dirty condenser
- High product load
- Sensor error
- Room warm

**What this means:** Heat rejection, load and control sensing can all contribute simultaneously.

**Next Action / Check:** Correct condenser condition and sensor error, characterize load, then reassess room pull-down.


**Technical basis:**
- Danfoss Cold Room Troubleshooting: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker/Sporlan or Copeland technical guidance: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/

---

## CH4-073 — WIC fan stopped plus dirty condenser plus high SH

**Scope:** WIC  
**Operating state:** STABLE_COOLING  
**Given facts:** FACT_EVAP_FAN_NOT_RUNNING, FACT_COND_COIL_DIRTY, FACT_EVAP_SH_HIGH

**Expected System Check:** Direct airflow faults on both sides make SH secondary until corrected

**Confirmed findings:**
- Evaporator fan stopped
- Dirty condenser
- High SH

**What this means:** Multiple airflow/heat-transfer faults can distort refrigerant readings.

**Next Action / Check:** Restore evaporator fan and clean condenser, then stabilize and repeat SH/pressures.


**Technical basis:**
- Danfoss Cold Room Troubleshooting: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker/Sporlan or Copeland technical guidance: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/

---

## CH4-074 — WIC drier restriction plus TXV bulb fault plus low SC

**Scope:** WIC  
**Operating state:** STABLE_COOLING  
**Given facts:** FACT_DRIER_TEMP_DROP, FACT_TXV_BULB_BAD_CONTACT, FACT_SUBCOOLING_LOW

**Expected System Check:** Two localized feed faults are present; low SC should not erase them

**Confirmed findings:**
- Drier restriction evidence
- TXV bulb fault
- Low subcooling

**What this means:** Multiple feed-side problems can coexist and mimic charge problems.

**Next Action / Check:** Correct drier restriction and bulb mounting, then reassess charge indicators.

**Must NOT conclude:**
- Do not add refrigerant before correcting localized faults.

**Technical basis:**
- Danfoss Cold Room Troubleshooting: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker/Sporlan or Copeland technical guidance: https://www.parker.com/content/dam/Parker-com/Literature/Sporlan/Sporlan-pdf-files/Sporlan-pdf-010/10-11.pdf

---

## CH4-075 — WIC high head plus fan stopped plus dirty condenser

**Scope:** WIC  
**Operating state:** STABLE_COOLING  
**Given facts:** FACT_COND_SAT_HIGH, FACT_COND_FAN_NOT_RUNNING, FACT_COND_COIL_DIRTY

**Expected System Check:** Two direct condenser airflow faults support high head

**Confirmed findings:**
- High head
- Condenser fan stopped
- Condenser coil dirty

**What this means:** Both faults reduce heat rejection.

**Next Action / Check:** Restore fan and clean coil, then recheck head before charge diagnosis.


**Technical basis:**
- Danfoss Cold Room Troubleshooting: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker/Sporlan or Copeland technical guidance: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/

---

## CH4-076 — WIC unknown state with direct solenoid no-flow fault

**Scope:** WIC  
**Operating state:** UNKNOWN  
**Given facts:** FACT_SOLENOID_COMMAND_OPEN, FACT_SOLENOID_COIL_VOLTAGE_PRESENT, FACT_SOLENOID_NO_FLOW_WHEN_OPEN

**Expected System Check:** Direct liquid-solenoid flow fault is actionable even if overall state is uncertain

**Confirmed findings:**
- Solenoid commanded open with voltage
- No flow occurs

**What this means:** A localized command-versus-response fault does not require pressure-pattern inference.

**Next Action / Check:** Inspect the solenoid/pressure differential and restore flow before broader diagnosis.


**Technical basis:**
- Danfoss Cold Room Troubleshooting: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker/Sporlan or Copeland technical guidance: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/

---

## CH4-077 — WIC unknown state with confirmed door infiltration

**Scope:** WIC  
**Operating state:** UNKNOWN  
**Given facts:** FACT_DOOR_INFILTRATION_CONFIRMED, FACT_BOX_TEMP_HIGH

**Expected System Check:** Confirmed infiltration remains actionable with unknown refrigeration state

**Confirmed findings:**
- Door infiltration confirmed
- Room warm

**What this means:** A direct room-load fault should not be hidden by missing operating-state information.

**Next Action / Check:** Repair infiltration, then establish stable cooling and reassess remaining temperature complaint.


**Technical basis:**
- Danfoss Cold Room Troubleshooting: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker/Sporlan or Copeland technical guidance: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/

---

## CH4-078 — WIC defrost active with high head and dirty condenser

**Scope:** WIC  
**Operating state:** DEFROST  
**Given facts:** FACT_DEFROST_ACTIVE, FACT_COND_SAT_HIGH, FACT_COND_COIL_DIRTY

**Expected System Check:** Defrost makes refrigerant readings transient, but dirty condenser remains a direct fault

**Confirmed findings:**
- Defrost is active
- High head recorded
- Condenser is dirty

**What this means:** Do not use defrost pressure as steady-state charge evidence; preserve the physical condenser fault.

**Next Action / Check:** Clean condenser and repeat pressures only after defrost and stable cooling resume.

**Must NOT conclude:**
- Do not diagnose overcharge from defrost pressure.

**Technical basis:**
- Danfoss Cold Room Troubleshooting: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker/Sporlan or Copeland technical guidance: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/

---

## CH4-079 — WIC post-defrost with low SH and door infiltration

**Scope:** WIC  
**Operating state:** POST_DEFROST  
**Given facts:** FACT_POST_DEFROST_ACTIVE, FACT_EVAP_SH_LOW, FACT_DOOR_INFILTRATION_CONFIRMED

**Expected System Check:** Post-defrost SH is transient while confirmed infiltration remains actionable

**Confirmed findings:**
- Post-defrost recovery
- Low SH
- Door infiltration confirmed

**What this means:** Transient SH should not distract from a direct moisture/load fault.

**Next Action / Check:** Repair infiltration and repeat SH after stable cooling is restored.


**Technical basis:**
- Danfoss Cold Room Troubleshooting: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker/Sporlan or Copeland technical guidance: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/

---

## CH4-080 — WIC warm room with normal refrigeration, load not characterized, sensor normal

**Scope:** WIC  
**Operating state:** STABLE_COOLING  
**Given facts:** FACT_BOX_TEMP_HIGH, FACT_REFRIGERATION_PERFORMANCE_NORMAL, FACT_CONTROLS_VERIFIED_NORMAL

**Expected System Check:** Warm-room complaint remains unresolved because room load/capacity has not been characterized

**Confirmed findings:**
- Room warm
- Refrigeration performance normal
- Controls verified normal

**What this means:** The next discriminating step is load/infiltration/capacity characterization, not refrigerant adjustment.

**Next Action / Check:** Measure/characterize door traffic, infiltration, product load and compare actual load to equipment capacity.

**Must NOT conclude:**
- Do not add refrigerant without evidence of a refrigerant fault.

**Technical basis:**
- Danfoss Cold Room Troubleshooting: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/
- Parker/Sporlan or Copeland technical guidance: https://www.danfoss.com/en-us/industries/food-and-beverage/dcs/cold-rooms/system-design-component-selection/application-vertical-market-sizing/troubleshooting-fault-diagnosis/

---

