import fs from "node:fs";
const p=new URL("./wic_master_diagnostic_cases.json",import.meta.url);
const suite=JSON.parse(fs.readFileSync(p,"utf8"));
let n=0;
for(const c of suite.cases){
 const e=c.expected;
 const req=["headline","confirmed_findings","what_this_means","next_action_check","troubleshooting_path","must_not_conclude"];
 for(const k of req){ if(!(k in e)) throw new Error(`${c.id}: missing expected.${k}`); }
 if(!c.setup?.length) throw new Error(`${c.id}: no setup`);
 if(!c.validation?.source_ids?.length) throw new Error(`${c.id}: no validation sources`);
 n++;
}
console.log(`WIC MASTER CASE CONTRACT: ${n}/${suite.test_count} cases structurally valid`);
