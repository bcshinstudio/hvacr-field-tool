# Brain 2.0.8 — Evidence Priority & Multi-Fault

## Purpose
General presentation/selection architecture update, not a scenario patch.

- Direct/actionable field evidence outranks an UNKNOWN operating-state headline.
- Operating state still gates interpretation of steady-state measurement patterns.
- All matching field-guidance paths are retained, not only the first match.
- The highest-priority active path drives the primary next action.
- Other independent active findings are shown in an `OTHER ACTIVE FINDINGS` queue and remain active for reevaluation after the primary action.
- High-SH-only remains a measurement-pattern path and does not bypass operating-state validity.

## Priority behavior
Field-guidance priority >= 70 is treated as actionable/localized field evidence for presentation priority. This includes direct component faults and concrete clues such as icing, dirty condenser, and sight-glass flashing. High-SH guidance remains below this threshold.
