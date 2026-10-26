import assert from 'node:assert/strict';
import fs from 'node:fs';
import {buildDxKnowledgeFacts} from '../../src/knowledge/dx_fact_adapter.js';
import {evaluateHypotheses} from '../../src/knowledge/hypothesis_engine.js';
const root=new URL('../../data/knowledge/core/',import.meta.url);
const J=n=>JSON.parse(fs.readFileSync(new URL(n+'.json',root),'utf8')).items;
const rules=J('evidence_rules'),relationships=J('relationships'),checks=J('checks'),discriminators=J('discriminators');
const cases=JSON.parse(fs.readFileSync(new URL('inputs.json',import.meta.url),'utf8')).cases;
// Independently estimated PT temperatures, NOT a textbook answer key or
// validated manufacturer PT interpolation. R404A dew for SH, bubble for SC.
const evap=[35,40,-5,25,0,20,10,20,60,-10,25,25,25,20,35];
const cond=[120,140,105,80,100,100,100,110,90,90,120,115,125,50,115];
const apps={walk_in_cooler:'APP_WIC',walk_in_freezer:'APP_WIF',reach_in_refrigerator:'APP_RIC',reach_in_freezer:'APP_RIF'};
const results=[];
for(let i=0;i<cases.length;i++){
 const c=cases[i], sh=c.suction_line_f-evap[i],sc=cond[i]-c.liquid_line_f;
 const er=c.expected_evaporating_f,cr=c.expected_condensing_f;
 const snapshot={
  calculated:{evaporatorSat:evap[i],evaporatorReferenceSat:er,evaporatorReferenceLow:er-10,evaporatorReferenceHigh:er+10,
    condenserSat:cond[i],condenserReferenceLow:cr-10,condenserReferenceHigh:cr+10,evaporatorSuperheat:sh,
    // Apparent negative subcooling is not a valid liquid subcooling value.
    ...(sc>=0?{condenserSubcooling:sc}:{})},
  references:{evaporatorSuperheat:{low:5,high:20},condenserSubcooling:{low:5,high:20},lowAmbientThresholdF:50},
  measurements:{outdoorAmbientF:c.ambient_f,...(c.book_problem==='7-6'?{filterDrierInletTemperature:90,filterDrierOutletTemperature:80}:{})},
  configuration:c.metering==='TEV'?['TXV','RECEIVER','FILTER_DRIER']:['CAPILLARY_TUBE']
 };
 const adapted=buildDxKnowledgeFacts(snapshot);
 const result=evaluateHypotheses({facts:adapted.facts,rules,relationships,checks,discriminators,application:apps[c.equipment],operatingState:'STABLE_COOLING',configuration:snapshot.configuration});
 results.push({problem:c.book_problem,application:apps[c.equipment],evapSatF:evap[i],condSatF:cond[i],superheatF:sh,apparentSubcoolingF:sc,
   caveat:sc<0?'Subcooling invalid: apparent negative value':null,facts:adapted.facts,
   diagnoses:result.diagnoses.map(x=>x.candidate),hypotheses:result.hypotheses.map(x=>x.candidate),hypothesisEvidence:result.hypotheses.map(x=>({candidate:x.candidate,score:x.score,ruleId:x.ruleId,evidence:x.evidence.filter(e=>e.state==="PRESENT").map(e=>({fact:e.fact,role:e.role}))})),nextCheck:result.nextCheck});
}
assert.equal(results.length,15);
assert(results.slice(2,5).every(x=>x.hypotheses.length>0),'walk-in freezer coverage');
assert(!results[3].diagnoses.includes('CAUSE_LOW_REFRIGERANT_CHARGE'),'7-4 premature charge diagnosis');
assert.equal(results[8].hypotheses[0],'CAUSE_COMPRESSOR_INEFFICIENCY','7-9 compressor hypothesis must lead competing causes');
assert.equal(results[8].diagnoses.length,0,'7-9 cannot condemn compressor without direct evidence');
assert.equal(results[3].diagnoses.length,0,'7-4 ambiguous: no confirmed repair');
assert.equal(results[10].diagnoses.length,0,'7-11 ambiguous: no confirmed repair');
assert(results[13].hypotheses.includes('CAUSE_HEAD_PRESSURE_CONTROL_FAULT'),'7-14 head control hypothesis');
assert.equal(results[14].diagnoses.length,0,'7-15 no supported diagnosis');
assert.equal(results[14].hypotheses.length,0,'7-15 no speculative hypotheses');
fs.writeFileSync(new URL('chapter7_results.json',import.meta.url),JSON.stringify({
 status:'ENGINE_OUTPUT_NOT_TEXTBOOK_ANSWER_KEY',
 pt_basis:'Approximate exercise PT temperatures; independently verify before authoritative numerical acceptance',
 interpretation:'Hypotheses are not confirmed repairs; 7-4 and 7-11 remain ambiguous',
 cases:results
},null,2)+'\n');
for(const r of results)console.log(`${r.problem}: diagnoses=${r.diagnoses.join(',')||'none'}; hypotheses=${r.hypotheses.slice(0,5).join(',')||'none'}`);
console.log('CHAPTER 7: 15 cases processed; 9 safety/coverage assertions PASS');
