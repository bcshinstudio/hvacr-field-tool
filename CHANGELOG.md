## 2026-10-27 — Shared reach-in screening and restriction evidence

- Connected reach-in screening superheat/subcooling ranges to both display and knowledge fact generation.
- Added high-subcooling evidence to the general liquid-line restriction vs. low-charge differential.
- Added cross-system/receiver regression tests; no prior passing tests regressed.

# Change log

## 2.3.0 — Shared evidence and application-reference integration

- Added a selectable Walk-In Freezer configuration using the existing refrigeration component model and application-specific reference scope.
- Integrated automatic box/entering-air → expected evaporator SAT and application-based condenser split references for walk-in and reach-in refrigeration.
- Added explicit low-ambient/low-head evidence and compressor pumping differential next-check relationships.
- Reused knowledge-graph condition-to-cause links in the shared engine and System Check without fixed scenario-specific cause positions.
- Kept direct findings, plausible conditions, underlying-cause alternatives and confirmations separate; reduced-heat-transfer patterns retain airflow/fan/icing possibilities rather than claiming a confirmed fault.
- Preserved receiver subcooling cautions and high-head/high-subcooling provisional hypothesis handling.
- Removed deprecated reference-input and exercise-preset UI controls. Consolidated separate release-note files into this change log.
- Added real P–T 15-set integration coverage, 30 production System Check HTML render tests and application-reference/causal-graph regression tests.
- Updated obsolete UI-string tests to verify the current behavior; none of the original 35 passing test files regressed.

## Earlier development

- Built the field measurement/system-diagram interface, DX calculation tools, component observations and control/electrical checks.
- Introduced structured diagnostic concepts, evidence rules, causal relationships, checks, discriminators, sources, and application profiles.
- Added knowledge integrity checks, direct-fault handling and regression coverage for ambiguous or incomplete evidence.

## Diagnostic usability update (2026-10-27)
- Preserve a provisional evidence-driven System Check heading when operating state is unknown.
- Add expandable, cause-specific confirmation guidance without changing hypothesis scores or confirming faults.
- Regression: 55/55 automated checks pass; browser interaction remains unverified.

## 2026-10-27 — Reach-in fixed-metering diagnostic correction
- Connected reach-in calculation classification directly to the loaded application reference profile; added regression tests of actual calculation HTML for high superheat and estimated high subcooling.
- Prevented TXV/TEV-specific causes from appearing in fixed-orifice/capillary-tube differentials.
- Used the combination of high superheat and reference-high subcooling to raise a *possible* liquid-feed restriction on fixed-metering systems without a receiver. No cause is confirmed by this screening combination.
- With low condensing SAT, prevented simple overcharge from appearing among the first three causes without additional direct evidence.
- Automated verification is not a replacement for the unavailable interactive browser acceptance test.

## 2.3.2 — Provisional evidence ranking
- Steady-state evidence rules can contribute **provisional**, unconfirmed suspects when operating state is Unknown; known transient/off-cycle states remain gated.
- Evidence-scored provisional suspects now take precedence over unscored condition-linked alternatives; the latter remain available.
- Added rendered System Check regression for high suction SAT + low condensing SAT across Unknown and Stable cooling states.
- Retained existing behavior verified by the complete regression suite.
