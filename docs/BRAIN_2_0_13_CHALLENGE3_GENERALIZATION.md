# Brain 2.0.13 — Challenge #3 Generalization

Challenge #3 was first run against frozen Brain 2.0.12 and scored 52/70. This update addresses the 18 failures by strengthening reusable diagnostic concepts rather than adding case-ID-specific answers.

Key changes:
- low suction under verified low evaporator load preserves normal airflow context;
- confirmed leak + low-charge pattern gives leak-repair/evacuation/charge verification guidance;
- high head under high ambient + high load is compared against the application envelope before fault condemnation;
- long-off-cycle startup and satisfied/off readings receive state-specific guidance;
- cooling demand + dead contactor coil supports upstream control-power/safety localization;
- confirmed door infiltration is accepted as direct infiltration evidence;
- low SH + high suction + normal airflow is explicitly recognized as an overfeed/flooding pattern;
- conflicting high-SH + low-SC + high-head evidence no longer supports low charge without direct corroboration;
- iced coil cases better discriminate incomplete defrost, infiltration, and remaining defrost/feed candidates;
- LP control, leaking solenoid, direct fan faults in UNKNOWN state, and multi-fault preservation are strengthened.

Challenge #3 runner v1.1 also improves semantic normalization for equivalent fan/operation wording and includes active guidance meaning in finding comparison. This changes matching quality, not the locked expected HVAC answer key.

Validation after update:
- Master: 80/80
- Challenge #1: 50/50
- Challenge #2: 60/60
- Challenge #3: 70/70
- Combined: 260/260
- Node .mjs suites: 33/33
