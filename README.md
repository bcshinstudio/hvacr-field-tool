## Brain 2.0.14 validation checkpoint

Brain 2.0.14 addresses the 25 independent Challenge #4 failures through generalized diagnostic reasoning and field guidance rather than case-ID-specific rules. The update strengthens direct-fault preservation across transient/unknown states, pump-down interpretation, contactor load-side localization, compressor thermal/current guidance, conflicting measurement handling, confirmed-leak workflow, control/sensor prioritization, and multi-fault presentation.

Validation: Master 80/80, Challenge #1 50/50, Challenge #2 60/60, Challenge #3 70/70, Challenge #4 80/80 = 340/340. All Node `.mjs` suites pass.


## Brain 2.0.12 validation checkpoint

Brain 2.0.12 addresses the 16 independent Challenge #2 failures with reusable diagnostic guidance for configuration-aware subcooling, model-specific targets, load/capacity separation, transient operating states, compressor current/temperature isolation, multi-fault preservation, moisture contamination, and evaporator distribution. It also tightens challenge-runner negative diagnostic assertions.

Validation: Master 80/80, Challenge #1 50/50, Challenge #2 60/60. All Node `.mjs` test suites pass.

# HVAC/R Field Tool

Current knowledge release: Brain 2.0.14 — Challenge #4 Generalization.

Run locally with a simple web server, for example `python -m http.server 8000`, then open `http://localhost:8000`.

Technical release notes are under `docs/`.

## Brain 2.0.11 validation checkpoint
- Master validation: 80/80 PASS
- Challenge Validation v1: 50/50 PASS
- See `docs/BRAIN_2_0_11_UPDATE.md`.

