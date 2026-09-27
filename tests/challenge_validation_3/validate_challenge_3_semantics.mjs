import fs from 'node:fs';
const s=JSON.parse(fs.readFileSync(new URL('./wic_challenge_cases_v3.json',import.meta.url),'utf8'));
let bad=[];for(const c of s.cases){const e=c.expected,v=c.validation;if(!e.system_check_result||!e.confirmed_findings?.length||!e.what_this_means||!e.next_action_check||!Array.isArray(e.must_not_conclude)||!v?.sources?.length||!v.sources.every(x=>x.name&&x.url))bad.push(c.id)}
console.log(`WIC CHALLENGE 3 SEMANTICS: ${s.cases.length-bad.length}/${s.cases.length} complete expected System Check + negative assertions + sources`);if(bad.length){console.log('INVALID:',bad.join(', '));process.exitCode=1}
