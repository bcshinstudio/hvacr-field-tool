import fs from 'node:fs';
import assert from 'node:assert/strict';
const app=fs.readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
const manifest=JSON.parse(fs.readFileSync(new URL('../data/knowledge/manifest.json',import.meta.url)));
assert.match(manifest.knowledge_version,/^2\./);
assert(manifest.entry_files?.rules && manifest.entry_files?.relationships && manifest.entry_files?.checks);
for(const x of ['data-wic-context="operatingState"','data-wic-context="evaporatorPressureQuality"','buildWicCaseEvidenceControls()','factRecords: adapted.factRecords || []','operatingState: snapshot.context.operatingState','POSSIBLE CAUSES','ADDITIONAL INFORMATION NEEDED']) assert(app.includes(x),`runtime wiring: ${x}`);
assert(!app.includes('KNOWLEDGE HUB PREVIEW'));
console.log('PASS: current release knowledge manifest and live diagnostic input paths');
