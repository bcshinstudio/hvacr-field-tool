import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const phase2=read('docs/knowledge_coverage_phase2.json');
const causes=new Set(phase2.faults.map(f=>f.id));
// An intentionally small, audited list of directly executable suites. Never infer
// that every case in a passing suite validates every mentioned fault.
const suites=[
 {id:'WIC_STARVATION',file:'tests/wic_starvation_differential.mjs',scope:['APP_WIC']},
 {id:'REACH_IN_SAFETY',file:'tests/reach_in_brain_safety.mjs',scope:['APP_RIC','APP_RIF']},
 {id:'BRAIN_CONDITION',file:'tests/brain_2_0_condition_preservation.mjs',scope:[]},
 {id:'RESIDENTIAL_AC_DEEP',file:'tests/residential_ac_deep/residential_ac_deep_runner.mjs',scope:['APP_AC_SPLIT','APP_AC_PACKAGE']},
];
// Only accept explicit literal cause IDs inside a single assertion expression.
// This is static assertion traceability, not independent diagnosis validation.
function extractAssertions(source){
 const lines=source.split(/\r?\n/);const out=[];
 for(let i=0;i<lines.length;i++){
  const line=lines[i];
  if(!/\b(?:assert(?:\.[A-Za-z]+)?|ok)\s*\(/.test(line))continue;
  // Restrict to the assertion's own source line; avoid nearby setup/test fixtures.
  const ids=[...new Set(line.match(/CAUSE_[A-Z0-9_]+/g)||[])].filter(id=>causes.has(id));
  if(!ids.length)continue;
  const polarity=/\b(?:assert\.not|assert\.doesNot|!\s*[\w.]*\.(?:includes|some)\s*\()/.test(line)?'negative_or_exclusion':'positive_or_other';
  out.push({line:i+1,cause_ids:ids,polarity,assertion:line.trim().slice(0,320)});
 }
 return out;
}
const results=[];
for(const suite of suites){
 const abs=path.join(root,suite.file);
 if(!fs.existsSync(abs)){results.push({...suite,status:'MISSING',assertions:[],output:'Test file absent'});continue;}
 const run=spawnSync(process.execPath,[abs],{cwd:root,encoding:'utf8',timeout:120000,maxBuffer:2_000_000});
 const status=run.error?'ERROR':run.status===0?'PASS':'FAIL';
 results.push({...suite,status,exit_code:run.status,output:(run.stdout+'\n'+run.stderr).trim().slice(-3000),assertions:extractAssertions(fs.readFileSync(abs,'utf8'))});
}
const faults=phase2.faults.map(f=>{
 const links=results.flatMap(s=>s.assertions.flatMap(a=>a.cause_ids.includes(f.id)?[{suite:s.id,file:s.file,line:a.line,polarity:a.polarity,assertion:a.assertion,suite_status:s.status}]:[]));
 return {id:f.id,taxonomy_proposal:f.taxonomy_proposal,declared_applications:f.declared_applications,rule_ids:f.rule_ids,assertion_links:links,traceability_status:links.some(l=>l.suite_status==='PASS')?'PASSING_SUITE_ASSERTION_LINK':links.length?'ASSERTION_LINK_SUITE_NOT_PASSING':'NO_EXPLICIT_ASSERTION_LINK',independent_reference_validation:'NOT_ASSESSED'};
});
const summary={faults:faults.length,with_explicit_assertion_links:faults.filter(f=>f.assertion_links.length).length,without_explicit_assertion_links:faults.filter(f=>!f.assertion_links.length).length,suites_pass:results.filter(r=>r.status==='PASS').length,suites_fail:results.filter(r=>r.status!=='PASS').length};
const report={schema_version:'3.0.0',method:'Conservative literal fault-ID matching inside assertion source lines of four executed test suites',limitations:['A passing suite establishes test execution, not independent diagnostic correctness','A literal assertion link is not proof of complete fault coverage','Negative/exclusion assertions are not positive fault diagnosis validation','Assertions with computed IDs, multi-line syntax or fixtures may be missed','Equipment scope is declared in rules; not proven by test execution','Other suites and scenario datasets remain unreviewed','No manufacturer or textbook reference validation performed'],summary,suites:results,faults};
const docs=path.join(root,'docs');fs.mkdirSync(docs,{recursive:true});
fs.writeFileSync(path.join(docs,'knowledge_coverage_phase3.json'),JSON.stringify(report,null,2)+'\n');
const md=['# Knowledge Coverage — Phase 3: Fault-to-Test Traceability','','**Static assertion links plus executed suite results. Not a certificate of diagnostic accuracy.**','',`- Faults: ${summary.faults}`,`- With explicit fault-ID assertion links: ${summary.with_explicit_assertion_links}`,`- Without explicit links in the four selected suites: ${summary.without_explicit_assertion_links}`,`- Executed suites passing: ${summary.suites_pass}/${results.length}`,'','## Executed suites','', '| Suite | Status | Explicit fault-ID assertions |','|---|---|---:|',...results.map(s=>`| ${s.file} | ${s.status} | ${s.assertions.length} |`),'','## Fault-to-test matrix','', '| Fault ID | Direct rules | Declared applications | Assertion links | Status |','|---|---:|---|---|---|',...faults.map(f=>`| ${f.id} | ${f.rule_ids.length} | ${f.declared_applications.join(', ')||'—'} | ${f.assertion_links.map(l=>`${l.suite}:${l.line} (${l.polarity})`).join('; ')||'—'} | ${f.traceability_status} |`),'','## Important limitations',...report.limitations.map(x=>`- ${x}`),'','## Next review','1. Manually review linked assertions for positive vs exclusion semantics.','2. Expand traceability to structured scenario datasets with explicit expected fault IDs and assertion results.','3. Independently verify reference diagnoses before labeling any case as clinically/technically validated.','4. Link Chapter 7 cases to existing fault IDs without feeding expected diagnoses into the brain.'];
fs.writeFileSync(path.join(docs,'knowledge_coverage_phase3.md'),md.join('\n')+'\n');
console.log(`PHASE 3: ${summary.faults} faults; ${summary.with_explicit_assertion_links} assertion-linked; ${summary.suites_pass}/${results.length} suites PASS`);
for(const s of results)console.log(`  ${s.id}: ${s.status}`);
if(summary.suites_fail)process.exitCode=1;
