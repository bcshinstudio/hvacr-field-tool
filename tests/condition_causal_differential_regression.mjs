import assert from 'node:assert/strict';
import fs from 'node:fs';
import {buildWicKnowledgeFacts} from '../src/knowledge/wic_fact_adapter.js';
import {evaluateHypotheses,conditionCauseCandidates} from '../src/knowledge/hypothesis_engine.js';
const kb=name=>JSON.parse(fs.readFileSync(new URL(`../data/knowledge/core/${name}.json`,import.meta.url),'utf8')).items;
const rules=kb('evidence_rules'), relationships=kb('relationships'),checks=kb('checks'),discriminators=kb('discriminators');
let assertions=0;const ok=(truth,message)=>{assert.ok(truth,message);assertions++};
for(const app of ['APP_WIC','APP_WIF','APP_RIC','APP_RIF','APP_AC_SPLIT','APP_AC_PACKAGE']){
  for(const operatingState of ['UNKNOWN','STABLE_COOLING']){
    const s={calculated:{evaporatorSat:0.4,evaporatorReferenceSat:15,evaporatorReferenceLow:5,evaporatorReferenceHigh:25,evaporatorSuperheat:9.6},references:{evaporatorSuperheat:{low:5,high:20}},measurements:{},context:{operatingState,evaporatorPressureQuality:'valid',condenserPressureQuality:'valid'}};
    const a=buildWicKnowledgeFacts(s);
    ok(a.facts.includes('FACT_LOW_EVAP_SAT_WITH_NORMAL_SH'),`${app}/${operatingState}: low sat+normal SH fact`);
    const r=evaluateHypotheses({facts:a.facts,factRecords:a.factRecords||[],rules,relationships,discriminators,checks,application:app,operatingState});
    ok(r.conditions.some(x=>x.id==='COND_EVAP_REDUCED_HEAT_TRANSFER'),`${app}/${operatingState}: condition recognized`);
    const cs=new Set(r.conditionCauses.map(x=>x.candidate));
    ok(cs.has('CAUSE_EVAP_AIRFLOW_RESTRICTION'),`${app}/${operatingState}: airflow causally linked`);
    ok(cs.has('CAUSE_EVAP_ICING'),`${app}/${operatingState}: icing causally linked`);
    ok(!r.diagnoses.some(x=>x.candidate==='CAUSE_EVAP_ICING'),`${app}/${operatingState}: cannot confirm icing`);
  }
}
const empty=conditionCauseCandidates([],relationships);ok(empty.length===0,'missing condition produces no causes');
console.log(`PASS ${assertions} causal differential assertions across 6 applications and 2 operating states`);
