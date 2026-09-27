# Brain 2.0.7 — Diagnostic Path Architecture

Purpose: move System Check from case-specific messages toward reusable field troubleshooting paths.

## Decision flow
Input -> facts -> direct faults/conditions -> candidate causes -> best applicable path/check -> technician result -> reevaluate -> diagnosis -> corrective action -> verification.

## Policy
- Direct observed faults remain actionable even when operating state is unknown.
- Operating state gates interpretation of steady-state refrigeration measurements; it does not erase a directly observed physical/electrical fault.
- When evidence is incomplete, keep Confirmed Findings and What This Means short. Put the useful request in Next Action / Check.
- Do not repeat a check already answered when a more specific known finding is available.
- Measurement patterns (pressure/SH/SC) are evidence, not automatic component diagnoses.
- Correct known airflow/electrical/control faults before using affected refrigerant readings to judge charge.
- After repair, verify the corrected component and then remeasure the system under an applicable operating state.

## Reusable paths in this release
Filter-drier restriction; TXV sensing bulb; TXV external equalizer; condenser fan stopped; condenser coil dirty/restricted; evaporator icing; evaporator fan stopped; evaporator airflow restriction; liquid-line solenoid not opening; liquid-line solenoid not closing; compressor not running; high-pressure safety trip; defrost/ice-removal fault; sight-glass flashing; high-superheat/underfed evaporator.

## Source policy
Manufacturer/component literature is preferred. User-supplied training/checklist material is used as supporting troubleshooting structure, not blindly converted into universal thresholds. Equipment/model-specific targets outrank generic patterns.
