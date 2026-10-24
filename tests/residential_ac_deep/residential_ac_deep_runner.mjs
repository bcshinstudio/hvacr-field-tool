import fs from 'node:fs';
import {evaluateHypotheses} from '../../src/knowledge/hypothesis_engine.js';
const J=p=>JSON.parse(fs.readFileSync(new URL(p,import.meta.url),'utf8'));
const suite=J('./residential_ac_deep_cases.json');
const rules=J('../../data/knowledge/core/evidence_rules.json').items;
const relationships=J('../../data/knowledge/core/relationships.json').items;
const discriminators=J('../../data/knowledge/core/discriminators.json').items;
const checks=J('../../data/knowledge/core/checks.json').items;
let pass=0; const results=[];
for(const c of suite.cases){
 const r=evaluateHypotheses({facts:c.facts,rules,relationships,discriminators,checks,application:c.application,operatingState:c.operating_state||'STABLE_COOLING',configuration:c.configuration||[]});
 const dx=new Set(r.diagnoses.map(x=>x.candidate));
 const hy=new Set(r.hypotheses.map(x=>x.candidate));
 const errors=[];
 for(const x of c.expected_diagnoses||[]) if(!dx.has(x)) errors.push(`missing diagnosis ${x}`);
 for(const x of c.expected_hypotheses||[]) if(!hy.has(x)) errors.push(`missing hypothesis ${x}`);
 for(const x of c.forbidden_diagnoses||[]) if(dx.has(x)) errors.push(`forbidden diagnosis ${x}`);
 if(c.expect_no_supported_diagnosis && dx.size) errors.push(`expected no supported diagnosis; got ${[...dx].join(',')}`);
 const ok=!errors.length; if(ok)pass++;
 results.push({id:c.id,title:c.title,pass:ok,errors,diagnoses:[...dx],hypotheses:[...hy],resolution:r.resolution,nextCheck:r.nextCheck});
 console.log(`${ok?'PASS':'FAIL'} ${c.id} ${c.title}${ok?'':` :: ${errors.join('; ')}`}`);
}
const out={suite:suite.suite_id,total:results.length,passed:pass,failed:results.length-pass,results};
fs.writeFileSync(new URL('./residential_ac_deep_report.json',import.meta.url),JSON.stringify(out,null,2));
console.log(`\nRESIDENTIAL A/C DEEP VALIDATION: ${pass} PASS / ${results.length-pass} FAIL / ${results.length} TOTAL`);
if(pass!==results.length) process.exitCode=1;
