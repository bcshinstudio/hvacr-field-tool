# WIC Challenge Validation v1

This suite is intentionally separate from `master_validation`. Brain 2.0.10 is frozen. Do not change the challenge answer key after seeing Brain output unless independent source review proves the expected answer itself is wrong.

Run:

```bat
node tests\challenge_validation\validate_challenge_contract.mjs
node tests\challenge_validation\validate_challenge_semantics.mjs
node tests\challenge_validation\challenge_brain_runner.mjs
```
