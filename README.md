# HVAC/R Field Tool

Offline-capable browser application for HVAC/R system measurements, pressure–temperature calculations, components, diagnostic evidence and technician next checks.

## Supported system selections

Walk-In Cooler, Walk-In Freezer, Residential Split A/C, Residential Packaged A/C, Reach-In Refrigerator, and Reach-In Freezer. The shared diagnostic engine applies common evidence relationships with application-specific references and component availability.

## How to use

1. Choose the actual equipment type and refrigerant.
2. Record box/cabinet temperature (or measured evaporator entering air), condenser entering air, pressures, and temperatures at their corresponding measurement points. Leave unknown measurements blank.
3. Open **Calculations** for saturation temperature, superheat, subcooling and automatically resolved application reference SAT ranges.
4. Open **System Check** for observed conditions, possible causes, evidence explanations and useful next checks. Select the actual operating state when known.
5. Record inspection results and re-evaluate. A hypothesis is not a confirmed fault and should not by itself justify a refrigerant charge adjustment or component replacement.

Application TD and condenser-split defaults are in `data/reference_values.csv`. These are diagnostic starting points, not promises of a specific model's design. Manufacturer/model targets take priority when known. Receiver-equipped systems require special caution when interpreting subcooling. The app does not ask for manual screening-reference inputs. Near-normal core refrigeration readings may prompt checks of room load and controls; that does not establish that cooling capacity or charge is correct.

## Local launch

Run `python -m http.server 8000` in the project folder; open `http://localhost:8000`.

## Development verification

Run `node tools/run_all_tests.mjs` from the project folder. Key coverage includes pressure-to-SAT interpolation with both R-404A and R-134a, evidence facts, application reference resolution, competing causal hypotheses, next-check selection, and rendering the production System Check HTML for 15 distinct input sets under Unknown and Stable cooling states.

Browser visual confirmation is still required because the automated environment blocked real Chromium navigation. No software can guarantee correct diagnosis of every real equipment fault: corroborate findings with safe field tests and manufacturer's documentation.

See `CHANGELOG.md` for major changes.
