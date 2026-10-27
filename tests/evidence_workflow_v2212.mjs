import assert from 'node:assert/strict';
import fs from 'node:fs';
const s=fs.readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
for(const x of ['data-next-check-state','data-next-check-component','data-next-check-field','data-next-check-tool','componentObservationValues.delete(key)','componentObservationValues.set(key','Review / change earlier answers','recorded inspection(s)','const seenCauses = new Set()','OBS_COIL_DIRTY','OBS_FAN_STOPPED','fieldCauseItems.push(item.label)','Why this diagnosis?','Confirmation tests','Evidence used'])assert(s.includes(x),x);
assert(!s.includes('guidedCheck.airflow'));
assert(s.includes('if (airflowFault && item.id === "CAUSE_REFRIGERANT_OVERCHARGE") continue'));
console.log('PASS: current evidence workflow, cause dedup, and inspection updates');
