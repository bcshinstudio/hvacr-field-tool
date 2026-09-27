# Brain 2.0.9 — Field Paths & State-Aware Guidance

Baseline: Master Runner v1.1 = 35/80.

This release expands reusable field-guidance paths rather than patching individual master cases. Added guidance families include moisture contamination, TXV hunting, door infiltration, warm-product load, sensor/reference disagreement, anti-short-cycle delay, contactor/control voltage, blown fuse, compressor overload, pump-down LP control, solenoid command/flow disagreement, and drain icing.

System Check now also provides state-specific next actions for Defrost, Startup, Satisfied/Off, Post-defrost and Pump-down so transient/off-state refrigeration readings are not treated like stable-cooling evidence.

The master answer key was not changed.
