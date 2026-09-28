import fs from 'node:fs';
import {buildWicKnowledgeFacts} from '../../src/knowledge/wic_fact_adapter.js';
const here=new URL('.',import.meta.url);
const suite=JSON.parse(fs.readFileSync(new URL('./textbook_service_calls.json',here),'utf8'));
const app=fs.readFileSync(new URL('../../src/app.js',here),'utf8');
let pass=0;
for(const c of suite.cases){
  const input={measurements:{},calculated:{},references:{},observations:c.observations||{},configuration:['TXV'],context:{operatingState:'UNKNOWN'},derived:{}};
  const a=buildWicKnowledgeFacts(input), facts=new Set(a.facts), errors=[];
  for(const f of c.requiredFacts||[]) if(!facts.has(f)) errors.push(`missing fact ${f}`);
  if(!app.includes(c.requiredHeadline)) errors.push(`System Check headline not implemented: ${c.requiredHeadline}`);
  for(const t of c.requiredActionTerms||[]) if(!app.toLowerCase().includes(t.toLowerCase())) errors.push(`next-action term not implemented: ${t}`);
  for(const t of c.forbiddenHeadlineTerms||[]) if(c.requiredHeadline.toLowerCase().includes(t.toLowerCase())) errors.push(`forbidden headline term: ${t}`);
  if(!errors.length) pass++;
  console.log(`${errors.length?'FAIL':'PASS'} ${c.id} ${c.title}${errors.length?' :: '+errors.join('; '):''}`);
}
console.log(`TEXTBOOK SERVICE CALL RUNNER v2.0: ${pass} PASS / ${suite.cases.length-pass} FAIL / ${suite.cases.length} TOTAL`);
if(pass!==suite.cases.length) process.exitCode=1;
