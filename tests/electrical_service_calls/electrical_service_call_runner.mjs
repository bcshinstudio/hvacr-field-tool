import fs from 'node:fs';
import {buildWicKnowledgeFacts} from '../../src/knowledge/wic_fact_adapter.js';
import {evaluateHypotheses} from '../../src/knowledge/hypothesis_engine.js';
const J=p=>JSON.parse(fs.readFileSync(new URL(p,import.meta.url),'utf8'));
const suite=J('./electrical_service_call_cases.json');
const rules=J('../../data/knowledge/core/evidence_rules.json').items;
const relationships=J('../../data/knowledge/core/relationships.json').items;
const discriminators=J('../../data/knowledge/core/discriminators.json').items;
const checks=J('../../data/knowledge/core/checks.json').items;
let pass=0;
for(const c of suite.cases){
  const input={measurements:{},calculated:{},references:{},observations:c.observations||{},configuration:['TXV'],context:{operatingState:c.operatingState||'UNKNOWN'},derived:{}};
  const a=buildWicKnowledgeFacts(input); const facts=new Set(a.facts); const errors=[];
  for(const f of c.requiredFacts||[]) if(!facts.has(f)) errors.push(`missing fact ${f}`);
  for(const f of c.forbiddenFacts||[]) if(facts.has(f)) errors.push(`forbidden fact ${f}`);
  const r=evaluateHypotheses({facts:[...facts],factRecords:a.factRecords||[],rules,relationships,discriminators,checks,application:'APP_WIC',operatingState:input.context.operatingState,configuration:input.configuration});
  if(c.requiredDiagnosis && !r.diagnoses.some(x=>x.candidate===c.requiredDiagnosis)) errors.push(`missing diagnosis ${c.requiredDiagnosis}`);
  if(!errors.length) pass++;
  console.log(`${errors.length?'FAIL':'PASS'} ${c.id} ${c.title}${errors.length?' :: '+errors.join('; '):''}`);
}
console.log(`ELECTRICAL SERVICE CALL RUNNER v1.0: ${pass} PASS / ${suite.cases.length-pass} FAIL / ${suite.cases.length} TOTAL`);
if(pass!==suite.cases.length) process.exitCode=1;
