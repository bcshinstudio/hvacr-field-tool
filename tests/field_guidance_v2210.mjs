import assert from 'node:assert/strict';
import fs from 'node:fs';
const s=fs.readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
for(const label of ['Why this diagnosis?','Other possible causes','Confirmation tests','Repair guidance','Evidence used','activeFieldGuide','otherActiveGuides','data-next-check-state','data-next-check-component','data-next-check-field','renderSidePanel();']) assert(s.includes(label),label);
assert(s.includes('result.stateGate?.steadyInterpretationAllowed'));
assert(s.includes('const highHeadHighScPattern ='));
console.log('PASS: current field guidance rendering and evidence feedback controls');
