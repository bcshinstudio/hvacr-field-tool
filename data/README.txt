HVAC/R V2 FOUNDATION CSV SET - v0.1

RELATIONSHIPS
applications.application_id
  -> application_parameters.application_id
  -> reference_values.application_id

parameters.parameter_id
  -> application_parameters.parameter_id
  -> reference_values.parameter_id
  -> calculation_rules.output_parameter_id

sources.source_id
  -> reference_values.source_id
  -> metering_devices.source_id

measurements.measurement_id
  -> referenced by calculation_rules.required_inputs

DESIGN RULES
1. A calculation formula is stored once in calculation_rules.csv.
2. Numeric reference values are NOT embedded in formulas.
3. A numeric reference is added only with conditions + source.
4. Manufacturer/model data is not promoted to a universal "normal" range.
5. Measured, calculated, estimated, design-rating, and manufacturer-target values remain distinct.
6. Unknown data stays absent/blank; never substitute zero.
7. For zeotropic blends: dew is the saturation reference for superheat; bubble is the saturation reference for subcooling.
8. Existing refrigerant P-T CSVs remain separate and feed PT_LOOKUP_LOW/PT_LOOKUP_HIGH.

STATUS
This is the conservative foundation set. It intentionally contains only a small number of verified numeric
reference records. Application-specific ranges should be expanded only after source-by-source verification.
