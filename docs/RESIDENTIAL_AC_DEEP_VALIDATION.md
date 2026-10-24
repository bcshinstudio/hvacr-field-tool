# Residential A/C Deep Validation — v2.1.1

Scope: residential split and packaged direct-expansion cooling systems.

The deep suite uses the real `APP_AC_SPLIT` and `APP_AC_PACKAGE` application contexts. It intentionally challenges false-positive behavior as well as direct fault recognition.

Coverage families:
- line power, disconnect/fuse/control power
- 24-V transformer and thermostat Y path
- contactor input/output behavior
- compressor/fan run capacitors
- compressor open/grounded winding evidence
- condenser fan and indoor blower electrical isolation
- filter/duct/evaporator airflow faults
- condenser coil/fan/recirculation heat-rejection faults
- TXV feed faults and liquid-line restrictions
- fixed-orifice restriction/size and target-superheat logic
- TXV target-subcooling charge logic
- compressor weak differential/capacity
- startup/transient gating
- conflicting charge clues and multi-fault preservation

Initial v2.1.0 result against the new deep oracle after proper A/C application scoping: 76/80. The four failures exposed two generalized problems: (1) fixed-orifice target-superheat evidence was not promoted strongly enough to support the intended charge interpretation, and (2) generic WIC low-charge logic could overreach from low subcooling alone when reused in A/C. v2.1.1 separates the A/C charging rules by metering-device/target context and finishes at 80/80.

This suite is broad regression coverage, not a claim that every possible residential A/C fault or every manufacturer-specific control board can be diagnosed without the required field evidence and model-specific documentation.
