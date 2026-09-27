# Automation Contract

The master JSON is intentionally independent of current Brain output. It can be consumed by the application test harness in two stages:

1. `setup[]` is converted to the same snapshot/facts used by `wic_fact_adapter.js`. Direct observation and measurement cases already carry machine paths/names plus human `ui_instruction` text.
2. The rendered System Check is compared against `expected` by structured concept assertions, not fragile whole-paragraph equality.

Required assertions per case:
- headline intent
- all confirmed findings preserved
- `what_this_means` diagnostic intent
- primary next-action intent
- troubleshooting-path required concepts
- `must_not_conclude` negative assertions
- other active findings retained in multi-fault cases

Cases with `setup.type = fact` and placeholder IDs such as `PATTERN_INPUT`, `CONTROL_PATTERN`, `SCENARIO_INPUT`, or `MULTI_PATTERN` are deliberate higher-level combination cases. They are machine-readable but require the application test adapter to translate the named scenario into current fact IDs. This prevents the answer key from being coupled to one internal implementation version.
