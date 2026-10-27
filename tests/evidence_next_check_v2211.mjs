import assert from 'node:assert/strict';
import fs from 'node:fs';
const s=fs.readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
for(const t of ['data-next-check-state','data-next-check-component','data-next-check-field','componentObservationValues.set(key','componentObservationValues.delete(key)','wicDiagnosticContext.operatingState = event.target.value','renderSidePanel();','Why this diagnosis?','Confirmation tests','Evidence used']) assert(s.includes(t),t);
assert.match(s,/planNextChecks\(\{/);
assert(!s.includes('guidedCheck.airflow'));
console.log('PASS: current evidence-driven next check controls and live update bindings');
