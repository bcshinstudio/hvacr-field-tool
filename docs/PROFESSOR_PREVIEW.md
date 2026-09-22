# HVAC/R Field Tool — Professor Preview

## Project purpose
A field-oriented HVAC/R troubleshooting tool that combines a system diagram, technician-entered measurements and observations, refrigerant P-T data, calculated values, and an offline diagnostic Knowledge Hub.

The current development application is a **Walk-In Cooler (WIC) with TXV**. The architecture is intended to support additional refrigeration and comfort-cooling systems later.

## Current workflow
Technician selects system/refrigerant → enters measurements/observations → app calculates saturation temperature, superheat, subcooling and related values → Knowledge Hub interprets evidence → app reports a system condition, possible causes, the most useful next check, or a specific diagnosis when localized evidence supports one.

## Diagnostic design principle
The software must not equate one symptom with one fault. For example, high evaporator superheat can indicate a starved evaporator, but low charge, liquid-line restriction, TXV/feed problems and other conditions can produce similar symptoms. The Brain therefore separates:
1. measured/calculated facts,
2. reference-based classification,
3. system condition,
4. competing fault hypotheses,
5. discriminating checks,
6. localized diagnosis,
7. corrective action and verification.

## Reference hierarchy
Model-specific target > equipment-manufacturer target > component-manufacturer target > application diagnostic reference > unclassified.

If a defensible target is unavailable, the app should preserve and display the measured value rather than inventing a normal range.

## Knowledge sources currently used
The project uses manufacturer/service literature, especially Danfoss refrigeration troubleshooting, Parker Sporlan TEV/liquid-line literature, Copeland compressor/system material, and Heatcraft commercial refrigeration guidance.

## Current validation status
This is a development prototype, not a finished diagnostic product. Core WIC refrigeration-feed logic is the strongest area. Several broader WIC domains remain under systematic validation. See `WIC_VALIDATION_COVERAGE.csv`.

## Feedback requested
Useful feedback from an HVAC/R instructor:
- Are the field measurements/checks practical and in the order a technician would actually use?
- Are important WIC fault families missing?
- Are any generic reference ranges being applied too broadly?
- Does the tool distinguish symptoms/system conditions from confirmed root causes appropriately?
- What field scenarios would be valuable as blind validation cases?
