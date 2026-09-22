# Brain 1.0 — WIC Causal Evidence Architecture

## Why
The earlier engine could reach many correct branches but its fixed rule/check flow encouraged case-by-case patching. Brain 1.0 separates measurement truth, reference-based interpretation, causal evidence, hypotheses, diagnosis, and next-check selection.

## Pipeline
1. System/application configuration
2. Operating-state context
3. Raw measurements and observations
4. Refrigerant-aware physical calculations
5. Measurement interpretation against the most specific applicable reference
6. Causal evidence facts
7. Competing fault hypotheses
8. Localized/direct evidence required for a specific diagnosis
9. Discriminating next check
10. Cause-specific corrective action and verification

## Reference policy
model-specific > equipment manufacturer > component manufacturer > application fallback.
If no applicable reference exists, preserve and display the numeric value but leave its LOW/NORMAL/HIGH state unclassified.

## High-superheat example
High SH can establish a starved-evaporator condition, but manufacturer literature lists multiple causes: inadequate liquid/subcooling, low charge, liquid-line/filter restriction, TEV sizing/blockage/bulb/equalizer problems, evaporator conditions, etc. The engine therefore keeps competing hypotheses until localized/direct evidence supports a cause.

## Sources
- Danfoss Ref Tools: Suction pressure too low and related branches.
- Parker Sporlan Form 10-143: 12 Solutions for Fixing Common TEV Problems.
- Parker Sporlan Form 1B / P-T service chart: systematic analysis of high SH/low suction causes.
- Parker Sporlan Bulletin 100-50-5.1: high-superheat troubleshooting checks.
- Existing Copeland / Heatcraft references in Knowledge Hub remain applicable to their documented domains.
