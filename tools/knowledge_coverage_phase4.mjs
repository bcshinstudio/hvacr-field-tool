import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const phase3=read('docs/knowledge_coverage_phase3.json');
const canonical=new Set(phase3.faults.map(f=>f.id));
const datasets=[
 'tests/knowledge_cases.json','tests/diagnostic_cases.json','tests/wic_fact_adapter_cases.json',
 'tests/wic_system_check_presentation_cases.json',
 'tests/master_validation/wic_master_diagnostic_cases.json',
 'tests/residential_ac/residential_ac_master_cases.json',
 'tests/residential_ac_deep/residential_ac_deep_cases.json',
 'tests/electrical_service_calls/electrical_service_call_cases.json',
 'tests/textbook_volume1/textbook_volume1_cases.json',
 ...[1,2,3,4].map(n=>n===1?'tests/challenge_validation/wic_challenge_cases_v1.json':`tests/challenge_validation_${n}/wic_challenge_cases_v${n}.json`)
];
const unique=a=>[...new Set(a)];
const allowedFields=['supported','notSupported','diagnoses','expected_diagnoses','expected_hypotheses','forbidden_diagnoses','requiredDiagnosis','required_diagnosis_ids','required_any_ids'];
function ids(value){if(typeof value==='string')return value.match(/CAUSE_[A-Z0-9_]+/g)||[];if(Array.isArray(value))return value.flatMap(ids);return [];}
const records=[],issues=[],inventory=[];
for(const file of datasets){
 const abs=path.join(root,file);
 if(!fs.existsSync(abs)){issues.push({file,issue:'DATASET_MISSING'});continue;}
 const obj=read(file),cases=Array.isArray(obj)?obj:obj.cases;
 if(!Array.isArray(cases)){issues.push({file,issue:'CASES_NOT_ARRAY'});continue;}
 let linked=0;
 for(const [index,c] of cases.entries()){
  const caseId=c.id||`INDEX_${index}`;
  const fields={};
  for(const field of allowedFields){
   const value=field==='required_diagnosis_ids'||field==='required_any_ids'?c.expected?.[field]:c[field];
   const found=unique(ids(value));if(found.length)fields[field]=found;
  }
  const positive=unique(['supported','diagnoses','expected_diagnoses','requiredDiagnosis','required_diagnosis_ids'].flatMap(k=>fields[k]||[]));
  const negative=unique(['notSupported','forbidden_diagnoses'].flatMap(k=>fields[k]||[]));
  const alternatives=fields.required_any_ids||[];
  const all=unique([...positive,...negative,...alternatives]);
  for(const id of all)if(!canonical.has(id))issues.push({file,case_id:caseId,issue:'UNKNOWN_CANONICAL_FAULT',id});
  if(all.length)linked++;
  records.push({dataset:file,case_id:caseId,title:c.title||c.name||null,application:c.application||c.system||null,positive_expected:positive,negative_expected:negative,alternative_expected:alternatives,link_fields:fields,link_status:all.length?'EXPLICIT_EXPECTATION':'NO_CANONICAL_EXPECTATION',case_execution:'NOT_ASSESSED',independent_answer_verification:'NOT_ASSESSED'});
 }
 inventory.push({file,cases:cases.length,explicitly_linked:linked,unlinked:cases.length-linked});
}
const faults=phase3.faults.map(f=>{
 const positive=records.filter(r=>r.positive_expected.includes(f.id)).map(r=>({dataset:r.dataset,case_id:r.case_id}));
 const negative=records.filter(r=>r.negative_expected.includes(f.id)).map(r=>({dataset:r.dataset,case_id:r.case_id}));
 const alternatives=records.filter(r=>r.alternative_expected.includes(f.id)).map(r=>({dataset:r.dataset,case_id:r.case_id}));
 return {id:f.id,taxonomy_proposal:f.taxonomy_proposal,declared_applications:f.declared_applications,direct_rule_count:f.rule_ids.length,phase3_assertion_links:f.assertion_links.length,positive_scenarios:positive,negative_scenarios:negative,alternative_scenarios:alternatives,coverage_status:positive.length?'SCENARIO_EXPECTATION_LINKED':negative.length||alternatives.length?'EXCLUSION_OR_ALTERNATIVE_ONLY':f.assertion_links.length?'ASSERTION_LINK_ONLY':'NO_EXPLICIT_SCENARIO_LINK',independent_validation:'NOT_ASSESSED'};
});
const summary={faults:faults.length,datasets:inventory.length,cases:records.length,cases_with_explicit_fault_expectations:records.filter(r=>r.link_status==='EXPLICIT_EXPECTATION').length,faults_with_positive_scenarios:faults.filter(f=>f.positive_scenarios.length).length,faults_with_any_scenario_link:faults.filter(f=>f.positive_scenarios.length||f.negative_scenarios.length||f.alternative_scenarios.length).length,integrity_issues:issues.length};
const result={schema_version:'4.0.0',method:'Explicit canonical fault IDs in structured scenario expectation fields; no text inference or engine changes',limitations:['Scenario expectation is not a passing case assertion','Suite PASS does not prove every scenario passed unless runner provides per-case outcomes','Expected answers are not independently verified here','Cases without canonical IDs may test safety, UI, measurements or operating-state behavior','Multiple expectations may represent alternatives, not simultaneous confirmed faults','Scope declarations are not runtime applicability proof'],summary,inventory,issues,faults,cases:records};
const docs=path.join(root,'docs');fs.mkdirSync(docs,{recursive:true});
fs.writeFileSync(path.join(docs,'knowledge_coverage_phase4.json'),JSON.stringify(result,null,2)+'\n');
const md=['# Knowledge Coverage — Phase 4: Scenario Mapping','','**Explicit scenario expectation mapping only. No claims of independently validated diagnosis.**','',...Object.entries(summary).map(([k,v])=>`- ${k}: ${v}`),'','## Dataset inventory','','| Dataset | Cases | Linked expectations | Unlinked |','|---|---:|---:|---:|',...inventory.map(x=>`| ${x.file} | ${x.cases} | ${x.explicitly_linked} | ${x.unlinked} |`),'','## Fault coverage','','| Fault | Positive scenarios | Negative scenarios | Alternative scenarios | Prior assertion links | Status |','|---|---:|---:|---:|---:|---|',...faults.map(f=>`| ${f.id} | ${f.positive_scenarios.length} | ${f.negative_scenarios.length} | ${f.alternative_scenarios.length} | ${f.phase3_assertion_links} | ${f.coverage_status} |`),'','## Integrity findings',...(issues.length?issues.map(x=>`- ${JSON.stringify(x)}`):['- No missing dataset or unknown canonical fault IDs in mapped expectation fields.']),'','## Interpretation',...result.limitations.map(x=>`- ${x}`),'','## Next','- Audit runner-to-case execution results and add explicit per-case PASS/FAIL where supported.','- Review unlinked cases manually; do not manufacture cause IDs for UI/safety tests.','- Review fault taxonomy before making categories canonical.','- Add Chapter 7 cases as a separate source-linked dataset, with reference answer status and blind production-engine output.'];
fs.writeFileSync(path.join(docs,'knowledge_coverage_phase4.md'),md.join('\n')+'\n');
console.log(`PHASE 4: ${summary.faults} faults; ${summary.cases} scenarios; ${summary.cases_with_explicit_fault_expectations} explicitly linked; ${summary.faults_with_positive_scenarios} faults with positive scenarios; ${summary.integrity_issues} integrity issues`);
if(issues.length)process.exitCode=1;
