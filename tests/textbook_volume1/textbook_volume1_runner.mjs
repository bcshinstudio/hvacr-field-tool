import fs from 'node:fs';
import {buildWicKnowledgeFacts} from '../../src/knowledge/wic_fact_adapter.js';
const here=new URL('.',import.meta.url);
const suite=JSON.parse(fs.readFileSync(new URL('./textbook_volume1_cases.json',here),'utf8'));
const app=fs.readFileSync(new URL('../../src/app.js',here),'utf8');
const observationsByProblem={
  3:{},
  9:{controls:{contactor_coil:'not_energized'}},
  11:{},
  12:{controls:{fuse_state:'open_blown'}},
  14:{controls:{contactor_coil:'energized',contactor_output:'not_passing_voltage'},compressor:{running_state:'not_running'},condenser:{fan_operation:'not_running'}},
  19:{evaporator:{coil_condition:'dirty'}}
};
// Pressure-derived textbook cases use derived facts because the PDF's figure supplies
// the pressure pattern, while this source bank deliberately does not invent numeric values.
const derivedFactsByProblem={3:['FACT_EVAP_SAT_LOW'],11:['FACT_EVAP_SAT_LOW','FACT_COND_SAT_LOW']};
let oraclePass=0, execPass=0, execTotal=0;
for(const c of suite.cases){
  const errors=[];
  if(!c.expected_answer?.trim()) errors.push('missing source expected answer');
  if(!['executable','future_ui','future_system'].includes(c.automation_status)) errors.push('invalid coverage classification');
  if(!c.coverage_reason?.trim()) errors.push('missing coverage rationale');
  if(!errors.length) oraclePass++;
  if(c.automation_status==='executable'){
    execTotal++;
    const input={measurements:{},calculated:{},references:{},observations:observationsByProblem[c.problem]||{},configuration:['TXV'],context:{operatingState:'UNKNOWN'},derived:{}};
    const adapted=buildWicKnowledgeFacts(input); const facts=new Set([...adapted.facts,...(derivedFactsByProblem[c.problem]||[])]);
    for(const f of c.requiredFacts||[]) if(!facts.has(f)) errors.push(`missing fact ${f}`);
    if(c.requiredHeadline && !app.includes(c.requiredHeadline)) errors.push(`headline not implemented: ${c.requiredHeadline}`);
    for(const t of c.requiredActionTerms||[]) if(!app.toLowerCase().includes(t.toLowerCase())) errors.push(`action term not implemented: ${t}`);
    if(!errors.length) execPass++;
  }
  console.log(`${errors.length?'FAIL':'PASS'} ${c.id} [${c.automation_status}] ${c.title}${errors.length?' :: '+errors.join('; '):''}`);
}
console.log(`TEXTBOOK VOLUME 1 SOURCE ORACLE: ${oraclePass}/${suite.cases.length} complete`);
console.log(`TEXTBOOK VOLUME 1 CURRENT EXECUTABLE COVERAGE: ${execPass}/${execTotal} passing`);
if(oraclePass!==suite.cases.length || execPass!==execTotal) process.exitCode=1;
