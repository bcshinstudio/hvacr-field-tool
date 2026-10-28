# Change log

## 2.3.4 development candidate — warm-box outcome and localized restriction guidance (2026-10-28)

- A recorded warm walk-in-cooler box temperature is now visible in the main System Check summary, Evidence Used, and diagnostic explanation, independently of operating-state confirmation.
- Normal core refrigeration readings without independent fault evidence no longer create speculative refrigerant-feed causes; the output directs investigation toward load, airflow and temperature controls.
- Localized filter-drier inlet/outlet temperature evidence prioritizes a restriction for verification while retaining other causes when justified; a small temperature difference does not force this finding.
- Generalized conflicting-evidence scoring: low evaporator superheat now weighs against simple low-charge, liquid-line restriction and TXV-underfeeding hypotheses; reduced-airflow alternatives can gain measured support. This is a confidence adjustment, never an exclusion.
- Corrected the 15-case engine regression harness to use applicable reach-in subcooling references, preserving the distinction between receiver systems and fixed metering. Added independent assertions for 7-7, 7-8 and 7-10 ranking.
- Added tests for warm-box, normal-box, cross-system applicability and localized drier checks. No manufacturer-specific temperature guarantee is implied.
- Browser validation through GitHub Actions and reconciliation with the latest online commit remain release gates.


## 2.3.3 — Consolidated evidence and diagnosis consistency (2026-10-28)

- Fixed a shared reasoning defect: an unavailable receiver-specific subcooling reference no longer **excludes** low system charge. Low charge stays an unconfirmed competitor alongside restrictions and TXV underfeeding when supported by other measurements.
- Aligned Walk-In Cooler superheat fallback classification between Calculations and System Check, including provisional Unknown-state readings. Broad 5–20°F screening interval is overridden by an applicable equipment/valve-specific reference; it does not prove correct charge.
- With reference-normal evaporator SAT, condensing SAT and superheat on a receiver-equipped system, the Brain avoids speculative refrigerant-feed faults when no independent abnormal or direct evidence exists. The absence of a receiver subcooling target is not interpreted as normal charge.
- With such core-normal readings, System Check prioritizes cabinet load/infiltration, controls, and runtime checks rather than valve replacement or charge changes. Missing references and contradictory readings do not trigger this rule.
- Added input-to-rendered-output differential tests covering normal-core, low-charge alternative preservation, low superheat display and nearby counterexamples. Preserved prior passing tests.
- Known limits: interactive browser navigation was unavailable in the test environment, and not every physical diagnosis can be uniquely established from the input measurements. The 15-case runner validates runtime reasoning paths, not independently supplied answer keys.

## 2026-10-27 — Shared reach-in screening and restriction evidence

- Connected reach-in screening superheat/subcooling ranges to both display and knowledge fact generation.
- Added high-subcooling evidence to the general liquid-line restriction vs. low-charge differential.
- Added cross-system/receiver regression tests; no prior passing tests regressed.


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
