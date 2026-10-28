import assert from 'node:assert/strict';
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';

// This gate uses the production PT-to-fact-to-cause path, not the approximate
// hand-entered temperature test. No textbook-case-specific rules are added.
execFileSync(process.execPath,[new URL('real_pt_chain_regression.mjs',import.meta.url).pathname],{stdio:'pipe'});
const rows=JSON.parse(fs.readFileSync(new URL('real_pt_chain_results.json',import.meta.url),'utf8')).cases;
assert.equal(rows.length,15,'all Chapter 7 cases must be exercised');
const byId=new Map(rows.map(r=>[r.problem,r]));
const inspect=(id)=>{const r=byId.get(id);assert(r,`missing ${id}`);return r;};
const top=(id)=>inspect(id).possible[0];
const includes=(id,x)=>[...inspect(id).possible,...inspect(id).diagnoses,...inspect(id).causalAlternatives].includes(x);
const checks=[];
const verify=(id,description,fn)=>{fn();checks.push(`${id}: ${description}`)};

verify('7-1','high-head isolated -> investigate condenser heat rejection, not assume charge',()=>{
 const r=inspect('7-1');
 assert(r.facts.includes('FACT_COND_SAT_HIGH'));
 assert(['CAUSE_COND_AIRFLOW_RESTRICTION','CAUSE_HOT_AIR_RECIRCULATION','CAUSE_CONDENSER_RECIRCULATION'].includes(top('7-1')));
 assert.equal(r.nextCheck,'CHECK_VERIFY_COND_AIRFLOW');
 assert(!r.diagnoses.includes('CAUSE_OVERCHARGE'));
});
verify('7-2','high condenser pressure and measured high subcooling are preserved',()=>{
 const r=inspect('7-2');assert(r.pressureBased.estimatedSubcoolF>25);assert(r.facts.includes('FACT_COND_SAT_HIGH'));
 // The applicable target/receiver location is not established: don't force confirmation.
 assert(!r.diagnoses.includes('CAUSE_OVERCHARGE'));
});
verify('7-3','low evaporating pressure, high SH and starvation alternatives',()=>{
 const r=inspect('7-3');assert(r.facts.includes('FACT_EVAP_SH_HIGH')&&r.facts.includes('FACT_EVAP_SAT_LOW'));
 assert(r.conditions.includes('COND_EVAP_STARVED'));assert(includes('7-3','CAUSE_LOW_REFRIGERANT_CHARGE'));
});
verify('7-4','mixed high suction SAT and high SH: no premature confirmed repair',()=>{
 const r=inspect('7-4');assert(r.facts.includes('FACT_EVAP_SAT_HIGH')&&r.facts.includes('FACT_EVAP_SH_HIGH'));assert.equal(r.diagnoses.length,0);
});
verify('7-5','low evaporator SAT with normal SH favors evaporator heat-transfer check',()=>{
 const r=inspect('7-5');assert(r.facts.includes('FACT_LOW_EVAP_SAT_WITH_NORMAL_SH'));
 assert.equal(top('7-5'),'CAUSE_EVAP_AIRFLOW_RESTRICTION');assert.equal(r.nextCheck,'CHECK_VERIFY_EVAP_AIRFLOW');
});
verify('7-6','direct drier temperature differential localizes the restriction',()=>{
 const r=inspect('7-6');assert(r.facts.includes('FACT_DRIER_TEMP_DROP'));assert.equal(top('7-6'),'CAUSE_FILTER_DRIER_RESTRICTION');
 assert(r.diagnoses.includes('CAUSE_FILTER_DRIER_RESTRICTION'));
});
verify('7-7','capillary starvation may not invent a TXV component',()=>{
 const r=inspect('7-7');assert(r.conditions.includes('COND_EVAP_STARVED'));
 assert(![...r.diagnoses,...r.possible,...r.causalAlternatives].some(x=>/TXV/.test(x)));
});
verify('7-8','near-zero SH must not favor simple starvation',()=>{
 const r=inspect('7-8');assert(r.facts.includes('FACT_EVAP_SH_LOW'));
 assert(['CAUSE_EVAP_AIRFLOW_RESTRICTION','CAUSE_EVAP_ICING'].includes(top('7-8')));
 assert(!r.possible.slice(0,2).includes('CAUSE_LOW_REFRIGERANT_CHARGE'));
 assert(!r.possible.slice(0,2).includes('CAUSE_LIQUID_LINE_RESTRICTION'));
});
verify('7-9','high suction/low head -> provisional compressor inefficiency',()=>{
 const r=inspect('7-9');assert.equal(top('7-9'),'CAUSE_COMPRESSOR_INEFFICIENCY');
 assert.equal(r.nextCheck,'CHECK_COMPRESSOR_CONTEXT');assert(!r.diagnoses.includes('CAUSE_COMPRESSOR_INEFFICIENCY'));
});
verify('7-10','freezer low evaporating SAT, high SH: low charge remains differential',()=>{
 const r=inspect('7-10');assert(r.facts.includes('FACT_EVAP_SAT_LOW')&&r.facts.includes('FACT_EVAP_SH_HIGH'));
 assert(includes('7-10','CAUSE_LOW_REFRIGERANT_CHARGE'));
});
verify('7-11','low SH and high head retain overfeed/overcharge consideration',()=>{
 const r=inspect('7-11');assert(r.facts.includes('FACT_EVAP_SH_LOW')&&r.facts.includes('FACT_COND_SAT_HIGH'));
 assert(includes('7-11','CAUSE_OVERCHARGE'));assert(!r.diagnoses.includes('CAUSE_OVERCHARGE'));
});
verify('7-12','low SH and high head, stronger apparent subcool than 7-11',()=>{
 const r=inspect('7-12');assert(r.pressureBased.estimatedSubcoolF>inspect('7-11').pressureBased.estimatedSubcoolF);
 assert(includes('7-12','CAUSE_OVERCHARGE'));
});
verify('7-13','TXV system near-zero superheat supports overfeed suspect',()=>{
 const r=inspect('7-13');assert(r.facts.includes('FACT_EVAP_SH_LOW'));assert(includes('7-13','CAUSE_TXV_OVERFEED'));
});
verify('7-14','low ambient and low head -> head-pressure-control check',()=>{
 const r=inspect('7-14');assert(r.facts.includes('FACT_LOW_AMBIENT_LOW_HEAD_PATTERN'));
 assert.equal(top('7-14'),'CAUSE_HEAD_PRESSURE_CONTROL_FAULT');assert.equal(r.nextCheck,'CHECK_HEAD_PRESSURE_CONTROL');
});
verify('7-15','near-normal circuit alone must not invent a confirmed refrigerant fault',()=>{
 const r=inspect('7-15');assert(!r.diagnoses.length);
 assert(!r.diagnoses.includes('CAUSE_LOW_REFRIGERANT_CHARGE'));
 // The main application separately processes explicitly reported insufficient cooling.
 // This PT-only runner contains no reported symptom and cannot certify UI guidance.
});
console.log(`PASS: ${checks.length}/15 Chapter 7 diagnostic semantic checks`);
for(const s of checks)console.log('  '+s);
