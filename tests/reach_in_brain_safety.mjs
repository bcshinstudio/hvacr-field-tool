import assert from 'node:assert/strict';
import fs from 'node:fs';
import {evaluateHypotheses} from '../src/knowledge/hypothesis_engine.js';
const read = name=>JSON.parse(fs.readFileSync(new URL(`../data/knowledge/core/${name}.json`,import.meta.url),'utf8')).items;
const rules=read('evidence_rules'),checks=read('checks'),relationships=read('relationships'),discriminators=read('discriminators');
const evaluate=(application,facts=[],opts={})=>evaluateHypotheses({rules,checks,relationships,discriminators,application,operatingState:'STABLE_COOLING',facts,...opts});
for(const app of ['APP_WIC','APP_RIC','APP_RIF','APP_AC_SPLIT','APP_AC_PACKAGE']){
 const empty=evaluate(app);
 assert.equal(empty.diagnoses.length,0,`${app} invented diagnosis`);
 assert.equal(empty.nextCheck,null,`${app} suggested unrelated check ${empty.nextCheck}`);
}
for(const app of ['APP_RIC','APP_RIF']){
 const blank=evaluate(app);
 assert(blank.outOfScope.some(x=>x.ruleId==='RULE_TXV_UNDERFEED'));
 assert(blank.outOfScope.some(x=>x.ruleId==='RULE_DRAIN_REFREEZE_LOCALIZED'));
 assert(blank.outOfScope.some(x=>x.ruleId==='RULE_AC_FIXED_ORIFICE_RESTRICTED'));
 assert(!blank.outOfScope.some(x=>x.ruleId==='RULE_FILTER_DRIER_RESTRICTION'));
 const localized=evaluate(app,['FACT_DRIER_TEMP_DROP']);
 assert(localized.hypotheses.some(x=>x.candidate==='CAUSE_FILTER_DRIER_RESTRICTION'),`${app} lacks common refrigeration rule`);
 assert(!localized.diagnoses.some(x=>x.candidate==='CAUSE_TXV_UNDERFEED'));
 const invalid=evaluate(app,[],{factRecords:[{id:'FACT_DRIER_TEMP_DROP',quality:'INVALID'}]});
 assert.equal(invalid.diagnoses.length,0,`${app} accepted invalid measurement`);
}
const transient=evaluateHypotheses({rules,checks,relationships,discriminators,application:'APP_RIC',operatingState:'DEFROST',facts:[]});
assert.equal(transient.stateGate.steadyInterpretationAllowed,false);
assert.equal(transient.nextCheck,null);
console.log('REACH-IN BRAIN SAFETY: PASS (empty evidence, scope, shared faults, invalid readings, transient state)');
