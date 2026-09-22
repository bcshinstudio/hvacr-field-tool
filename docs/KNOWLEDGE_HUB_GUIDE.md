# HVAC/R Knowledge Hub Guide — WIC Brain 0.3.0

The Knowledge Hub is the offline troubleshooting brain. HVAC-specific thresholds and cause trees belong in knowledge/reference data, not the generic reasoning engine.

Flow:
Measurements/observations/state → calculations → reference-aware interpretation → facts → system conditions → candidate causes → evidence for/against → hierarchy → discriminating check → most specific defensible conclusion.

Reference priority:
1. model-specific
2. equipment manufacturer
3. component manufacturer
4. application fallback

Missing evidence is UNKNOWN, not contradiction.

The generic WIC/TXV superheat fallback is 8–12°F, spanning Parker Sporlan refrigeration guidance for fresh-meat (8–10°F) and dairy/deli/produce (10–12°F). It is not a universal equipment target and must be overridden by a known equipment/model/valve target.

High evaporator superheat may establish EVAPORATOR STARVATION without establishing WHY. Low charge, liquid-line restriction, and TXV/feed faults remain competing branches until discriminating evidence separates them.

Data contracts:
- evidence_rules.json: evidence roles; direct=true can establish a cause.
- relationships.json: INDICATES, MAY_CAUSE, SUBTYPE_OF.
- checks.json: checks and facts they can establish.
- discriminators.json: best next checks for unresolved branches/conditions.
- walk_in_cooler.json: application states and reference policy/profiles.
- sources.json: provenance.

For a new system type, reuse the generic engine and add an application profile, references, concepts, relationships, rules, checks, discriminators, tests, and manufacturer/model overlays.
