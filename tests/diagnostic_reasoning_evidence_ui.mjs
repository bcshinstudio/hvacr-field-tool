import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const src = readFileSync(new URL('../src/app.js', import.meta.url), 'utf8');
for (const value of [
  'const highHeadScPatternNote = highHeadHighScPattern',
  'Leading hypothesis:',
  'Liquid occupying condenser volume',
  'Alternative causes:',
  'Confirmation tests:',
  'Corrective action:',
  'Only if overcharge is confirmed, recover excess refrigerant',
  'No manufacturer-specific subcooling target is available',
  'receiver and measurement-location limitations apply',
  'result.state?.subcoolingApproximate',
  'const rootCauses =',
]) assert.ok(src.includes(value), `Missing: ${value}`);
assert.ok(src.includes('const patternGuidance = highHeadScPatternNote;')); 
console.log('DIAGNOSTIC REASONING / EVIDENCE UI: 12 assertions PASS');
