import {spawnSync} from 'node:child_process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
for(const script of ['knowledge_coverage_phase2.mjs','knowledge_coverage_phase3.mjs','knowledge_coverage_phase4.mjs','knowledge_coverage_phase5.mjs']){
 const result=spawnSync(process.execPath,[path.join(root,'tools',script)],{cwd:root,stdio:'inherit'});
 if(result.status!==0){console.error(`Knowledge coverage stopped at ${script}`);process.exit(result.status||1);}
}
