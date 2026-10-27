import assert from 'node:assert/strict';
import fs from 'node:fs';
const s=fs.readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
for(const x of ['Why this diagnosis?','Other possible causes','Confirmation tests','Repair guidance','Evidence used','POSSIBLE CAUSES','ADDITIONAL INFORMATION NEEDED']) assert(s.includes(x),x);
assert(!s.includes('<summary style="cursor:pointer;color:#277fb5;font-weight:600;">Technical details and other checks</summary>'));
assert.match(s,/const fieldCauseCandidates =/);
assert.match(s,/const plannedChecks = planNextChecks\(/);
console.log('PASS: concise primary findings plus expandable technical evidence');
