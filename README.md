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

GitHub Actions runs Playwright browser UI tests on pushes to `main`, together with the Chapter 7 diagnostic acceptance gate. A green workflow confirms that the tested workflows and assertions passed **for that commit**; it does not certify every possible diagnosis, all on-screen guidance, or all future inputs. Review `Actions` for the exact commit before calling a deployment verified. No software can guarantee correct diagnosis of every real equipment fault: corroborate findings with safe field tests and manufacturer's documentation.

## Release status and verification (2026-10-28)

**Public release baseline:** Git commit `42639b9` on `main`. GitHub Actions **Browser UI Tests #9** and **GitHub Pages deployment #23** both passed for this commit, as verified by the workflow results. This is the project's initial documented stable baseline for the *tested* capabilities, not a certification of diagnostic accuracy in every field condition.

Release-validation evidence from the development cycle:

- Historical JavaScript test-file audit: **96/96** reported passing on the integrated local candidate (not independently rerun by GitHub's current workflow).
- Master validation: **80/80** reported passing; Challenge 1: **50/50**; Challenge 3: **70/70**.
- Chapter 7 semantic diagnostic acceptance: **15/15** passed locally and its gate passed in GitHub Actions on `42639b9`. These are specific assertions, not a full textbook-answer certification.
- Browser UI tests and Pages deployment: passed in GitHub Actions on `42639b9`.

**Known limits:** Chapter 7 acceptance assertions intentionally cover selected abnormal conditions, leading suspects, and next-check decisions. They do not independently verify the exact wording of every repair instruction or all possible fault combinations. Case 7-15's pressure/temperature-only test checks against an unjustified confirmed refrigerant fault; it does **not** prove the quality of room-load guidance when a user reports insufficient cooling. A provisional suspect is not a confirmed diagnosis. Estimates and default references may not apply to a specific model, operating stage, refrigerant service location, or receiver configuration. The tool does not replace safe field inspection, OEM specifications, or qualified judgment.

**Release discipline:** Preserve this commit as the known-good baseline. For further Brain changes, run historical regressions, the Chapter 7 acceptance gate, and Playwright on the **exact commit being released**; review any changed technician-facing reasoning before release.

See `CHANGELOG.md` for major changes.
