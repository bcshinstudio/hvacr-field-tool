import assert from 'node:assert/strict';
import fs from 'node:fs';
const app=fs.readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
const ref=fs.readFileSync(new URL('../data/reference_values.csv',import.meta.url),'utf8');
assert.doesNotMatch(app,/data-evap-textbook-preset|data-evap-reference-box|data-evap-reference-td/,'rejected manual inputs stay removed');
assert.match(app,/function applicableEvaporatorReference\(\)/);
assert.match(app,/const temperature = air !== null \? air : box/);
for(const id of ['REF_WIC_EVAP_TD_SCREEN','REF_WIF_EVAP_TD_SCREEN','REF_RIC_EVAP_TD_SCREEN','REF_RIF_EVAP_TD_SCREEN']) assert(ref.includes(id),`${id} application reference`);
console.log('PASS: automatic application references without rejected preset controls');
