import assert from 'node:assert/strict';
import fs from 'node:fs';
import {buildWicKnowledgeFacts} from '../src/knowledge/wic_fact_adapter.js';
import {evaluateHypotheses} from '../src/knowledge/hypothesis_engine.js';
const items=n=>JSON.parse(fs.readFileSync(new URL(`../data/knowledge/core/${n}.json`,import.meta.url),'utf8')).items;
const kb={rules:items('evidence_rules'),relationships:items('relationships'),discriminators:items('discriminators'),checks:items('checks')};
const base={calculated:{evaporatorSat:35.5,evaporatorReferenceLow:30,evaporatorReferenceHigh:50,condenserSat:115,condenserReferenceLow:100,condenserReferenceHigh:120,evaporatorSuperheat:14.5,condenserSubcooling:5},references:{evaporatorSuperheat:{low:5,high:20}},configuration:['RECEIVER','TXV'],context:{operatingState:'STABLE_COOLING',evaporatorPressureQuality:'valid',condenserPressureQuality:'valid'}};
const run=(snapshot,state='STABLE_COOLING')=>{const a=buildWicKnowledgeFacts(snapshot);return {facts:a.facts,result:evaluateHypotheses({...kb,facts:a.facts,application:'APP_WIC',operatingState:state,configuration:snapshot.configuration})}};
for (const state of ['UNKNOWN','STABLE_COOLING']){
 const {facts,result}=run(base,state);
 assert(facts.includes('FACT_CORE_REFRIGERATION_VALUES_WITHIN_REFERENCE'),state+' normal core evidence');
 assert(!result.hypotheses.some(x=>/TXV_UNDERFEED|LOW_REFRIGERANT_CHARGE/.test(x.candidate)),state+' no invented starvation');
}
const highSh=structuredClone(base);highSh.calculated.evaporatorSuperheat=31;
assert(!run(highSh).facts.includes('FACT_CORE_REFRIGERATION_VALUES_WITHIN_REFERENCE'),'high SH invalidates normal core');
const missing=structuredClone(base);delete missing.calculated.evaporatorReferenceLow;
assert(!run(missing).facts.includes('FACT_CORE_REFRIGERATION_VALUES_WITHIN_REFERENCE'),'missing reference cannot imply normal');
const lowSat=structuredClone(base);lowSat.calculated.evaporatorSat=19.8;
assert(!run(lowSat).facts.includes('FACT_CORE_REFRIGERATION_VALUES_WITHIN_REFERENCE'),'low SAT invalidates normal');
const noReceiver=structuredClone(base);noReceiver.configuration=['TXV'];
assert(!run(noReceiver).facts.includes('FACT_CORE_REFRIGERATION_VALUES_WITHIN_REFERENCE'),'not generalized to nonreceiver without SC reference');
console.log('PASS receiver core-reference evidence differential: normal, high SH, low SAT, missing reference, no receiver');
