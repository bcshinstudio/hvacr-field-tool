import assert from 'node:assert/strict';
import fs from 'node:fs';
import {buildDxKnowledgeFacts} from '../../src/knowledge/dx_fact_adapter.js';
import {evaluateHypotheses} from '../../src/knowledge/hypothesis_engine.js';
import {planNextCheck} from '../../src/diagnostics/next_check_planner.js';
const J=n=>JSON.parse(fs.readFileSync(new URL('../../data/knowledge/core/'+n+'.json',import.meta.url),'utf8')).items;
const rules=J('evidence_rules'),relationships=J('relationships'),checks=J('checks'),discriminators=J('discriminators');
const cases=JSON.parse(fs.readFileSync(new URL('inputs.json',import.meta.url),'utf8')).cases;
const evap=[35,40,-5,25,0,20,10,20,60,-10,25,25,25,20,35];
const cond=[120,140,105,80,100,100,100,110,90,90,120,115,125,50,115];
const apps={walk_in_cooler:'APP_WIC',walk_in_freezer:'APP_WIF',reach_in_refrigerator:'APP_RIC',reach_in_freezer:'APP_RIF'};
const output=[];
for(let i=0;i<cases.length;i++){
 const c=cases[i],sc=cond[i]-c.liquid_line_f;
 const snap={
   calculated:{evaporatorSat:evap[i],evaporatorReferenceSat:c.expected_evaporating_f,
     evaporatorReferenceLow:c.expected_evaporating_f-10,evaporatorReferenceHigh:c.expected_evaporating_f+10,
     condenserSat:cond[i],condenserReferenceLow:c.expected_condensing_f-10,
     condenserReferenceHigh:c.expected_condensing_f+10,
     evaporatorSuperheat:c.suction_line_f-evap[i],
     ...(sc>=0?{condenserSubcooling:sc}:{})},
   references:{evaporatorSuperheat:{low:5,high:20},condenserSubcooling:{low:5,high:20},lowAmbientThresholdF:50},
   measurements:{outdoorAmbientF:c.ambient_f,...(c.book_problem==='7-6'?{filterDrierInletTemperature:90,filterDrierOutletTemperature:80}:{})},
   configuration:c.metering==='TEV'?['TXV','RECEIVER','FILTER_DRIER']:['CAPILLARY_TUBE']
 };
 const adapted=buildDxKnowledgeFacts(snap);
 const brain=evaluateHypotheses({facts:adapted.facts,rules,relationships,checks,discriminators,
   application:apps[c.equipment],operatingState:'STABLE_COOLING',configuration:snap.configuration});
 const plan=planNextCheck({
   facts:adapted.facts,operatingState:'STABLE_COOLING',
   candidates:[...brain.diagnoses,...brain.hypotheses].map(x=>x.candidate),
   nextCheck:checks.find(x=>x.id===brain.nextCheck)?.label||brain.nextCheck||'',
   observations:{},measurements:{
     'box_temperature:temperature':c.box_f,
     'condenser_entering_air:temperature':c.ambient_f,
     'compressor_suction:pressure':c.suction_psig,
     'compressor_discharge:pressure':c.discharge_psig,
     'compressor_suction:temperature':c.suction_line_f,
     'condenser_outlet:temperature':c.liquid_line_f
   }
 });
 assert.ok(plan && plan.instruction?.length>12,`Missing next check for ${c.book_problem}`);
 assert.ok(['observation','tool','action','state'].includes(plan.type),`Invalid check for ${c.book_problem}`);
 output.push({case:c.book_problem,system:c.equipment,brainHypotheses:brain.hypotheses.length,
   brainDiagnoses:brain.diagnoses.length,nextCheckType:plan.type,nextCheck:plan.id||plan.tool||plan.instruction});
}
assert.equal(output.length,15);
console.log('CHAPTER 7 NEXT-CHECK INTEGRATION: 15/15 actionable paths; approximate PT values, not textbook answer-key validation');
for(const x of output) console.log(`${x.case} ${x.system}: ${x.nextCheckType} ${x.nextCheck}`);
