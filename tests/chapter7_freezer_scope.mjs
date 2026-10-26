import assert from 'node:assert/strict';
import fs from 'node:fs';
import {evaluateHypotheses} from '../src/knowledge/hypothesis_engine.js';
const j=name=>JSON.parse(fs.readFileSync(new URL('../data/knowledge/core/'+name+'.json',import.meta.url))).items;
const rules=j('evidence_rules'),relationships=j('relationships'),checks=j('checks'),discriminators=j('discriminators');
const ctx={rules,relationships,checks,discriminators,application:'APP_WIF',operatingState:'STABLE_COOLING',configuration:['TXV','RECEIVER','FILTER_DRIER']};
for(const id of ['RULE_TXV_UNDERFEED','RULE_TXV_OVERFEED','RULE_EVAP_AIRFLOW','RULE_COMPRESSOR_INEFFICIENT','RULE_HEAD_PRESSURE_CONTROL']){
 const r=rules.find(x=>x.id===id);assert(r?.scope?.applications?.includes('APP_WIF'),id+' scope missing');
}
const empty=evaluateHypotheses({...ctx,facts:[]});assert.equal(empty.diagnoses.length,0,'No evidence must not confirm fault');
const starved=evaluateHypotheses({...ctx,facts:['FACT_EVAP_SAT_LOW','FACT_EVAP_SH_HIGH']});
assert(starved.hypotheses.length>0,'Freezer starvation should have candidate hypotheses');
console.log('PASS: walk-in freezer scoped hypotheses, no-evidence safety');
