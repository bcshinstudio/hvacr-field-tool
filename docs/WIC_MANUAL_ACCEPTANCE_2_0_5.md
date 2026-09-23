# WIC Manual Acceptance — Brain 2.0.5

Use exact UI wording. Each case is independent.

## Acceptance rules corrected in 2.0.5
1. UNKNOWN operating state may limit steady-state interpretation, but it must not hide a direct localized physical fault such as a temperature decrease across the filter drier.
2. Direct localized evidence outranks a generic differential in technician-facing presentation.
3. Very little/minimal condenser-outlet subcooling on a receiver-equipped system is important liquid-supply evidence, but without an applicable manufacturer/equipment target it is not assigned a formal LOW/NORMAL/HIGH class and does not by itself prove charge.
4. Next actions must tell the technician exactly what to do in the current UI.
5. Test instructions use the exact field labels and option labels rendered by the application.

## Exact observation wording used by current UI
- Metering Device > Observations > Sensing Bulb Contact > **Poor**
- Metering Device > Observations > External Equalizer > **Issue Observed**
- Metering Device > Observations > TXV Inlet / Strainer > **Restriction Observed**
- Condenser > Observations > Fan Operation > **Not Running**
- Condenser > Observations > Coil Condition > **Dirty**
- Evaporator > Observations > Coil Condition > **Fully Iced**

## Self-checked acceptance cases 7–10
### 7 — Condenser fan not running
Operating State: Stable Cooling. Condenser > Observations > Fan Operation: Not Running.
Expected: condenser heat-rejection / airflow problem; confirmed finding says condenser fan is not operating; next action is to restore condenser airflow, not to ask whether the fan runs.

### 8 — Dirty condenser
Operating State: Stable Cooling. Condenser > Observations > Fan Operation: Normal. Condenser > Observations > Coil Condition: Dirty.
Expected: condenser heat-rejection / airflow problem; confirmed finding says condenser coil is dirty/restricted; next action is to restore condenser airflow and recheck readings. Do not diagnose overcharge from this observation.

### 9 — Defrost state
Operating State: Defrost. If high-SH measurements are present, ordinary steady-cooling charge/TXV conclusions remain gated.
Expected: Defrost — state-specific interpretation; no steady-cooling low-charge/TXV verdict.

### 10 — Subcooling alone on receiver-equipped WIC
Receiver installed; condenser-outlet SC measured at 2.2°F; no high-SH evidence and no applicable manufacturer/equipment SC target.
Expected: preserve 2.2°F as very little/minimal subcooling; do not diagnose low refrigerant charge from SC alone.
