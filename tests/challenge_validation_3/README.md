# Challenge Validation #3

70 unseen cases against frozen Brain 2.0.12.

- 50 `CORE` cases: reusable refrigeration diagnostic relationships.
- 20 `WIC` cases: walk-in cooler/freezer-specific controls, defrost, room/load and multi-fault behavior.

Run:

```bat
node tests\challenge_validation_3\validate_challenge_3_contract.mjs
node tests\challenge_validation_3\validate_challenge_3_semantics.mjs
node tests\challenge_validation_3\challenge_3_brain_runner.mjs
```

The first Brain run is a generalization benchmark. Do not modify expected answers to match Brain output.
