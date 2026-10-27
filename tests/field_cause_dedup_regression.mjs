import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const source = readFileSync(new URL('../src/app.js', import.meta.url), 'utf8');
const start = source.indexOf('const fieldCauseCandidates = [');
const end = source.indexOf('const fieldCausesHtml =', start);
assert(start > -1 && end > start, 'field cause presentation exists');
const section = source.slice(start, end);
assert.match(section, /const fieldCauseKey = id => id === "CAUSE_OVERCHARGE"/);
assert.match(section, /\? "CAUSE_REFRIGERANT_OVERCHARGE" : id;/);
assert.match(section, /seenCauses\.has\(causeKey\)/);
assert.match(section, /seenCauses\.add\(causeKey\)/);
assert.match(section, /fieldCauseItems\.push\(item\.label\)/);
// Semantics of the shared display-only deduplication key.
const canonical = id => id === 'CAUSE_OVERCHARGE' ? 'CAUSE_REFRIGERANT_OVERCHARGE' : id;
function unique(ids) { const seen = new Set(); return ids.filter(id => {const key = canonical(id);if(seen.has(key))return false;seen.add(key);return true;}); }
assert.deepEqual(unique(['CAUSE_REFRIGERANT_OVERCHARGE','CAUSE_OVERCHARGE','CAUSE_NONCONDENSABLES']), ['CAUSE_REFRIGERANT_OVERCHARGE','CAUSE_NONCONDENSABLES']);
assert.deepEqual(unique(['CAUSE_OVERCHARGE','CAUSE_REFRIGERANT_OVERCHARGE','CAUSE_COND_FAN_FAILURE']), ['CAUSE_OVERCHARGE','CAUSE_COND_FAN_FAILURE']);
console.log('FIELD CAUSE DEDUP REGRESSION PASS');
