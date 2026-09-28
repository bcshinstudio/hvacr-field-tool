# Textbook Volume 1 validation bank

Source: `20-HVACR-Troubleshooting-Problems-Volume-1.pdf` supplied by the user.

This suite contains all 20 problems and their source-supported expected answers. It separates:
- `executable`: decisive evidence can be represented by the current structured WIC/Brain inputs.
- `future_ui`: diagnostic principle is relevant, but a decisive input is not yet represented.
- `future_system`: case belongs to an equipment/system model not yet implemented.

This separation is intentional: the runner must not fabricate evidence merely to claim 20/20 executable coverage.

Run:
`node tests/textbook_volume1/textbook_volume1_runner.mjs`
