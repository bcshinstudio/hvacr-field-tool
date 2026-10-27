import assert from 'node:assert/strict';
import fs from 'node:fs';
import {buildWicKnowledgeFacts} from '../src/knowledge/wic_fact_adapter.js';
import {evaluateHypotheses} from '../src/knowledge/hypothesis_engine.js';
const load=(p)=>JSON.parse(fs.readFileSync(new URL('../data/knowledge/'+p,import.meta.url)));
const profile=load('applications/app_ric.json').reference_profiles;
assert.deepEqual([profile.evaporatorSuperheat.fallback.low,profile.evaporatorSuperheat.fallback.high],[5,20]);
assert.deepEqual([profile.condenserSubcooling.fallback.low,profile.condenserSubcooling.fallback.high],[5,20]);
const make=(sc, config=[], state='STABLE_COOLING')=>({
 calculated:{evaporatorSat:10.2,evaporatorReferenceLow:20,evaporatorReferenceHigh:40,evaporatorSuperheat:34.8,condenserSat:99.9,condenserReferenceLow:105,condenserReferenceHigh:125,condenserSubcooling:sc},
 references:{evaporatorSuperheat:profile.evaporatorSuperheat.fallback,condenserSubcooling:config.includes('RECEIVER')?null:profile.condenserSubcooling.fallback},
 configuration:config,context:{operatingState:state,evaporatorPressureQuality:'valid',condenserPressureQuality:'valid'},observations:{},measurements:{}
});
const evalCase=(snap)=>{
 const a=buildWicKnowledgeFacts(snap);
 const r=evaluateHypotheses({facts:a.facts,rules:load('core/evidence_rules.json').items,relationships:load('core/relationships.json').items,discriminators:load('core/discriminators.json').items,checks:load('core/checks.json').items,application:'APP_RIC',operatingState:snap.context.operatingState,configuration:snap.configuration,factRecords:a.factRecords||[]});
 return {a,r};
};
const hot=evalCase(make(24.9));
assert(hot.a.facts.includes('FACT_EVAP_SH_HIGH'));
assert(hot.a.facts.includes('FACT_SUBCOOLING_HIGH'));
const rank=hot.r.hypotheses.map(x=>[x.candidate,x.score]);
const restr=rank.find(x=>x[0]==='CAUSE_LIQUID_LINE_RESTRICTION');
const charge=rank.find(x=>x[0]==='CAUSE_LOW_REFRIGERANT_CHARGE');
assert(restr && charge, JSON.stringify(rank));
assert(restr[1]>charge[1], 'High SH + elevated SC must favor liquid-line restriction over low charge');
const normal=evalCase(make(10));
assert(!normal.a.facts.includes('FACT_SUBCOOLING_HIGH'));
assert(!normal.a.facts.includes('FACT_SUBCOOLING_LOW'));
const receiver=evalCase(make(24.9,['RECEIVER']));
assert(!receiver.a.facts.includes('FACT_SUBCOOLING_HIGH'),'Receiver without model target should not classify SC');
const app=fs.readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
assert(app.includes('classifyReading(condenserOutletSubcooling, applicableScRange?.low, applicableScRange?.high)'));
assert(app.includes('classifyReading(evaporatorSuperheat, applicableShRange?.low, applicableShRange?.high)'));
console.log('PASS: capillary screening evidence, restriction ranking, receiver guard, and calculation presentation links');
