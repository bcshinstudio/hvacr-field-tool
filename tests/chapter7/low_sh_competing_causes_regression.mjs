import assert from 'node:assert/strict';
import fs from 'node:fs';
import {buildWicKnowledgeFacts} from '../../src/knowledge/wic_fact_adapter.js';
import {evaluateHypotheses} from '../../src/knowledge/hypothesis_engine.js';
const read = name => JSON.parse(fs.readFileSync(new URL(`../../data/knowledge/core/${name}.json`,import.meta.url),'utf8')).items;
const engine = {rules:read('evidence_rules'),relationships:read('relationships'),discriminators:read('discriminators'),checks:read('checks')};
function run(lowSH){
 const input={ calculated:{evaporatorSat:20,evaporatorReferenceLow:30,evaporatorReferenceHigh:50,evaporatorSuperheat:lowSH?0.6:30,condenserSat:100,condenserReferenceLow:110,condenserReferenceHigh:130},references:{evaporatorSuperheat:{low:5,high:20}},context:{operatingState:'STABLE_COOLING',evaporatorPressureQuality:'valid',condenserPressureQuality:'valid'},configuration:[]};
 const a=buildWicKnowledgeFacts(input);
 return evaluateHypotheses({...engine,facts:a.facts,factRecords:a.factRecords,application:'APP_RIC',operatingState:'STABLE_COOLING',configuration:[]});
}
const low=run(true);
assert(low.hypotheses.some(x=>x.candidate==='CAUSE_EVAP_AIRFLOW_RESTRICTION'));
assert(!low.hypotheses.some(x=>x.candidate==='CAUSE_LOW_REFRIGERANT_CHARGE'||x.candidate==='CAUSE_LIQUID_LINE_RESTRICTION'),'Low SH must contradict simple starvation suspects');
const high=run(false);
assert(high.hypotheses.some(x=>x.candidate==='CAUSE_LOW_REFRIGERANT_CHARGE'),'Keep the high SH starvation differential');
console.log('PASS: low-SH contradiction and high-SH backward compatibility');
const graphConditions=[{id:'COND_EVAP_STARVED'}];
const {conditionCauseCandidates}=await import('../../src/knowledge/hypothesis_engine.js');
assert(!conditionCauseCandidates(graphConditions,engine.relationships,[]).some(x=>/^CAUSE_TXV_/.test(x.candidate)),'Capillary/fixed-orifice graph cannot show TXV-only causes');
assert(conditionCauseCandidates(graphConditions,engine.relationships,['TXV']).some(x=>/^CAUSE_TXV_/.test(x.candidate)),'Actual TXV equipment retains the TXV differential');
console.log('PASS: metering-device-aware condition graph');
