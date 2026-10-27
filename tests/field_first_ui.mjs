import assert from 'node:assert/strict';
import fs from 'node:fs';
const s=fs.readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
for(const x of ['const fieldHeading =','const fieldCauseCandidates =','const fieldCausesHtml =','POSSIBLE CAUSES','ADDITIONAL INFORMATION NEEDED','Other possible causes','Evidence used','snapshot.context.operatingState === "UNKNOWN"','Condenser fan'])assert(s.includes(x),`missing technician-facing UI: ${x}`);
assert(s.indexOf('POSSIBLE CAUSES')<s.indexOf('Evidence used'),'concise findings precede detail');
console.log('PASS: field-first summary and evidence detail order');
