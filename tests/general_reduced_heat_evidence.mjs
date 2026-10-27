import assert from 'node:assert/strict';
import fs from 'node:fs';
import {buildWicKnowledgeFacts} from '../src/knowledge/wic_fact_adapter.js';
import {evaluateHypotheses} from '../src/knowledge/hypothesis_engine.js';
const read=p=>JSON.parse(fs.readFileSync(new URL(p,import.meta.url),'utf8')).items;
const relationships=read('../data/knowledge/core/relationships.json');
const concepts=read('../data/knowledge/core/concepts.json');
assert(concepts.some(x=>x.id==='FACT_LOW_EVAP_SAT_WITH_NORMAL_SH'));
const base={calculated:{evaporatorSat:0.4,evaporatorReferenceSat:15,evaporatorReferenceLow:5,evaporatorReferenceHigh:25,evaporatorSuperheat:9.6,condenserSat:100,condenserReferenceLow:110,condenserReferenceHigh:130},references:{evaporatorSuperheat:{low:8,high:12}},configuration:['RECEIVER','TXV']};
const get=s=>new Set(buildWicKnowledgeFacts(s).facts);
let facts=get(base);
assert(facts.has('FACT_EVAP_SAT_LOW'));
assert(facts.has('FACT_COND_SAT_LOW'),'condenser SAT below supplied bound must reach Brain');
assert(facts.has('FACT_LOW_EVAP_SAT_WITH_NORMAL_SH'));
for(const system of ['APP_WIC','APP_RIC','APP_RIF','APP_AC_SPLIT']){
 const r=evaluateHypotheses({facts:[...facts],relationships,rules:[],checks:[],discriminators:[],application:system,operatingState:'STABLE_COOLING'});
 assert(r.conditions.some(x=>x.id==='COND_EVAP_REDUCED_HEAT_TRANSFER'),system);
 assert.equal(r.diagnoses.length,0,'provisional physical finding must not establish fault');
}
assert(!get({...base,calculated:{...base.calculated,evaporatorReferenceLow:null,evaporatorReferenceSat:null}}).has('FACT_LOW_EVAP_SAT_WITH_NORMAL_SH'));
assert(!get({...base,calculated:{...base.calculated,evaporatorSuperheat:25}}).has('FACT_LOW_EVAP_SAT_WITH_NORMAL_SH'));
assert(!get({...base,references:{}}).has('FACT_LOW_EVAP_SAT_WITH_NORMAL_SH'));
assert(!get({...base,calculated:{...base.calculated,evaporatorSat:15}}).has('FACT_LOW_EVAP_SAT_WITH_NORMAL_SH'));
assert(!get({...base,calculated:{...base.calculated,condenserReferenceLow:null}}).has('FACT_COND_SAT_LOW'));
console.log('PASS: 4 application contexts, 5 evidence/reference gating conditions and provisional-cause guard');
