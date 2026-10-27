// Reproducible release verification: execute production-data integrations first.
import { readdirSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
const tests = ['tests/chapter7/real_pt_chain_regression.mjs', ...readdirSync('tests').filter(f => f.endsWith('.mjs')).sort().map(f => join('tests', f))];
const results=[];
for(const file of tests){
  const p=spawnSync(process.execPath,[file],{encoding:'utf8',maxBuffer:20*1024*1024,timeout:60000});
  const ok=p.status===0;
  results.push({test:file,pass:ok,exit_code:p.status,stdout_tail:(p.stdout||'').slice(-800),stderr_tail:(p.stderr||'').slice(-800)});
  process.stdout.write(`${ok?'PASS':'FAIL'} ${file}\n`);
}
const audit=spawnSync(process.execPath,['tools/brain_knowledge_audit.mjs'],{encoding:'utf8'});
const syntax=spawnSync(process.execPath,['--check','src/app.js'],{encoding:'utf8'});
const extra=[{test:'knowledge audit',pass:audit.status===0,stdout_tail:(audit.stdout||'').slice(-600)},{test:'app.js syntax',pass:syntax.status===0,stderr_tail:(syntax.stderr||'').slice(-600)}];
results.push(...extra);extra.forEach(x=>process.stdout.write(`${x.pass?'PASS':'FAIL'} ${x.test}\n`));
const summary={passed:results.filter(x=>x.pass).length,failed:results.filter(x=>!x.pass).length,total:results.length,generated_at:new Date().toISOString(),results};
writeFileSync('tests/verification_report.json',JSON.stringify(summary,null,2)+'\n');
console.log(`VERIFICATION ${summary.passed}/${summary.total}; failures ${summary.failed}`);
if(summary.failed)process.exitCode=1;
