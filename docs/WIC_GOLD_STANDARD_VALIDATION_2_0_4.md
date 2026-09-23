# WIC Gold-Standard Diagnostic Validation — Brain 2.0.4

## Why this exists
A regression test can pass even when its expected answer is wrong. Brain 2.0.4 therefore separates software regression from diagnostic validation. The expected clinical/field reasoning below was derived from manufacturer/component literature first; only then was Brain output compared with it.

## Source-backed rules used
1. **High operating superheat**: Parker lists low charge, insufficient liquid subcooling/flash gas, TXV adjustment, pressure-drop/equalizer issues, contamination, bulb-charge problems and undersized valve among causes. Therefore high SH supports an underfed/starved evaporator but does not identify one root cause by itself. Source: Parker Refrigeration Tech Tips, Troubleshooting TXV Problems.
2. **Cold-room refrigerant feed differential**: Danfoss says charge diagnosis should combine SH, SC, sight glass, pressures, temperatures and system design; a restriction can mimic undercharge. Source: Danfoss Cold Room Troubleshooting.
3. **Receiver/subcooling**: Sporlan states that liquid and vapor together in a receiver are saturated at the liquid surface; subcooling can occur after a solid liquid column forms. Copeland states that some condenser subcooling may be lost in a receiver unless it is almost completely full. Therefore condenser-outlet SC on a receiver system must not be interpreted like a universal packaged-system charging target. Sources: Sporlan Form 10-135; Copeland AE17-1212.
4. **Insufficient SC is not an automatic charging command**: Danfoss explicitly instructs technicians not to charge refrigerant only because of insufficient subcooling. Source: Danfoss Ref Tools, Bubbles in sight glass after filter → Insufficient sub-cooling.
5. **Filter drier restriction**: Danfoss identifies a colder filter outlet / excessive pressure drop and bubbles after the filter as restriction clues. Source: Danfoss Ref Tools, Sight Glass / Pressure drop across filter too high.
6. **TXV localization**: Parker and Danfoss identify bulb contact/location, external equalizer, inlet contamination/strainer restriction, valve response and sizing as discriminators for TXV-related underfeed. Sources: Parker TXV Tech Tips; Danfoss Cold Room Troubleshooting.
7. **Evaporator icing**: Danfoss lists multiple causes including defrost, fan/airflow, infiltration and refrigerant-feed issues. Icing alone does not prove a failed heater. Source: Danfoss Cold Room Troubleshooting.

## Exact manual Test 2 expectation
Inputs: WIC, R-448A; evap outlet 34 psig / 35°F → 10.3°F dew SAT → 24.7°F SH; condenser outlet 211 psig / 88°F → 90.2°F bubble SAT → 2.2°F SC; receiver installed; no applicable equipment/model SC target.

Expected result:
- Preserve the measured 2.2°F SC.
- Do **not** label 2.2°F LOW merely from a generic WIC threshold.
- High SH supports evaporator starvation/underfeeding.
- Low refrigerant inventory, upstream liquid-line restriction and TXV underfeeding remain competing branches.
- Receiver configuration reduces the diagnostic value of condenser-outlet SC as a stand-alone charge indicator.
- Do not diagnose undercharge from these two values alone.
- Next checks should discriminate liquid inventory/leak evidence, localized liquid-line restriction, and TXV inlet/bulb/equalizer/response evidence.

## Validation policy
A test is tagged **gold-standard** only when its expected diagnostic meaning is independently supported by manufacturer/component literature or fundamental P-T physics. Artificial numeric references may test software mechanics, but they are not counted as evidence that an HVAC diagnosis is correct.
