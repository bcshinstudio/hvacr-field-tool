# WIC Starvation Differential — 0.5.3

Purpose: distinguish a starved evaporator from its root causes rather than equating high superheat with one fault.

Validated branches:
- high SH alone -> starvation condition, insufficient root-cause evidence
- low-charge pattern when applicable SH/SC references support it
- filter-drier restriction with localized temperature-drop evidence
- completed drier temperature check with no drop (must not be requested again)
- TXV sensing-bulb installation problem
- TXV external-equalizer problem
- TXV inlet/strainer restriction
- TXV non-response / power-element fault

Manufacturer research basis:
- Danfoss cold-room troubleshooting: charge, restriction and TXV faults can all limit evaporator feed; diagnosis should use SH, SC, sight glass/liquid condition, pressure/temperature and valve checks.
- Danfoss low-suction guidance: lack of subcooling, high SH, valve sizing, blockage, bulb conditions and evaporator conditions are distinct causes/checks.
- Parker Sporlan Form 10-143: TEV underfeeding troubleshooting includes adjustment, sensing-bulb installation and valve/feed checks.
- Parker Sporlan superheat-control troubleshooting: high SH requires checking liquid condition, charge, valve sizing/control and liquid-line filter pressure drop.

Policy: no generic root cause is forced from high superheat alone. Manufacturer/model targets override application fallback.
