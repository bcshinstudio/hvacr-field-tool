import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const load=(name)=>JSON.parse(fs.readFileSync(path.join(root,'data/knowledge/core',name+'.json'),'utf8')).items;
const concepts=load('concepts'), relationships=load('relationships'), rules=load('evidence_rules'), checks=load('checks');
const ids=new Set(concepts.map(x=>x.id));
const invalid=[];
const check=(id,where)=>{if (!ids.has(id))invalid.push({id,where});};
for(const rel of relationships){check(rel.from,`relationship:${rel.id}:from`);check(rel.to,`relationship:${rel.id}:to`);}
for(const rule of rules){check(rule.candidate,`rule:${rule.id}:candidate`);for(const e of rule.evidence||[])check(e.fact,`rule:${rule.id}:evidence`);}
for(const item of checks)for(const fact of item.produces||[])check(fact,`check:${item.id}:produces`);
const causal=relationships.filter(x=>x.relation==='MAY_CAUSE');
const conditionIds=new Set(concepts.filter(x=>x.type==='condition').map(x=>x.id));
const causeIds=new Set(concepts.filter(x=>x.type==='cause').map(x=>x.id));
const linkedConditions=[...conditionIds].filter(id=>causal.some(r=>r.to===id));
const linkedCauses=[...causeIds].filter(id=>causal.some(r=>r.from===id));
const produced=new Set(checks.flatMap(c=>c.produces||[]));
const testedFacts=new Set(rules.flatMap(r=>(r.evidence||[]).map(e=>e.fact)));
const report={concepts:concepts.length,relationships:relationships.length,evidence_rules:rules.length,checks:checks.length,condition_count:conditionIds.size,cause_count:causeIds.size,conditions_with_incoming_causal_links:linkedConditions.length,causes_with_outgoing_causal_links:linkedCauses.length,rule_facts_with_matching_check:[...testedFacts].filter(x=>produced.has(x)).length,rule_facts_total:testedFacts.size,invalid_references:invalid};
if(process.argv.includes('--json'))console.log(JSON.stringify(report,null,2));else console.log(`Knowledge audit: ${concepts.length} concepts; ${relationships.length} relations; ${rules.length} rules; ${checks.length} checks; ${invalid.length} invalid references.`);
if(invalid.length)process.exitCode=1;
