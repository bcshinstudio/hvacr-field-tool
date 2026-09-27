import fs from 'node:fs';
const suite=JSON.parse(fs.readFileSync(new URL('./wic_master_diagnostic_cases.json',import.meta.url),'utf8'));
const bad=[];
for(const c of suite.cases){
 const e=c.expected;
 if(!e.headline?.trim()) bad.push(`${c.id}: empty headline`);
 if(!e.confirmed_findings?.length) bad.push(`${c.id}: no confirmed findings`);
 if(!e.what_this_means?.trim()) bad.push(`${c.id}: empty meaning`);
 if(!e.next_action_check?.trim()) bad.push(`${c.id}: empty next action`);
 if(!e.troubleshooting_path?.length) bad.push(`${c.id}: no path`);
 if(!e.must_not_conclude?.length) bad.push(`${c.id}: no negative assertion`);
}
if(bad.length){console.error(bad.join('\n'));process.exit(1)}
console.log(`WIC MASTER SEMANTICS: ${suite.cases.length} cases have complete expected System Check + negative assertions`);
