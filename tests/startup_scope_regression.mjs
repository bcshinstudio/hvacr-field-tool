import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const app = readFileSync(new URL('../src/app.js', import.meta.url), 'utf8');
assert.equal((app.match(/const sc = measurementStates\.condenserSubcooling;/g) || []).length, 1,
  'System Check must not contain a duplicate legacy subcooling evidence block');
assert.ok(app.includes('const highHeadHighScPattern = highSideHigh && elevatedScScreen;'));
assert.ok(app.includes('const patternGuidance = highHeadScPatternNote;'));
assert.ok(!app.includes('No applicable manufacturer/equipment target is available'),
  'Obsolete fallback wording should not reappear');
console.log('STARTUP SCOPE REGRESSION: 4 assertions PASS');
